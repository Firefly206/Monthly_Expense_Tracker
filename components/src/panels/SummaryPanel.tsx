import React, { useEffect, useMemo, useState } from "react";
import { useDatabase } from "../hooks/useDatabase";

type CategoryTotal = {
  name: string;
  total: number;
};

function firstDayOfMonth(year: number, month1to12: number): Date {
  return new Date(year, month1to12 - 1, 1, 0, 0, 0, 0);
}

function lastDayOfMonth(year: number, month1to12: number): Date {
  return new Date(year, month1to12, 0, 23, 59, 59, 999);
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const SummaryPanel: React.FC = () => {
  const { ready, api } = useDatabase(); // { ready, transactions, categories, ... }
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);

  const [loading, setLoading] = useState<boolean>(true);
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [byCategory, setByCategory] = useState<CategoryTotal[]>([]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const load = async () => {
      setLoading(true);

      const from = firstDayOfMonth(year, month);
      const to = lastDayOfMonth(year, month);

      // Build category id -> name map
      const cats = await api.categories.listCategories();
      const catNameById = new Map<number, string>();
      for (const c of cats as any[]) {
        if (typeof c.id === "number") {
          catNameById.set(c.id, String(c.name ?? "Uncategorized"));
        }
      }

      // Pull txns for the month, then aggregate in JS (loop, not recursion)
      const txns = await api.transactions.listTransactions({
        from: toIso(from),
        to: toIso(to),
      });

      let totalIncome = 0;
      let totalExpense = 0;
      const totals = new Map<string, number>();

      for (const t of txns as any[]) {
        const amount = Number(t.amount ?? 0);
        let category = "Uncategorized";
        if (
          typeof t.category_id === "number" &&
          catNameById.has(t.category_id)
        ) {
          category = catNameById.get(t.category_id)!;
        } else if (typeof t.category === "string") {
          category = t.category;
        }

        if (Number.isFinite(amount)) {
          if (amount >= 0 || t.type === "income") {
            totalIncome = totalIncome + Math.abs(amount);
          } else {
            totalExpense = totalExpense + Math.abs(amount);
          }
          const prev = totals.get(category) ?? 0;
          totals.set(category, prev + Math.abs(amount));
        }
      }

      const list: CategoryTotal[] = Array.from(totals.entries())
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total);

      setIncome(totalIncome);
      setExpense(totalExpense);
      setByCategory(list);
      setLoading(false);
    };

    load();
  }, [ready, api, year, month]);

  const net = useMemo(() => income - expense, [income, expense]);

  return (
    <div className="summary-panel" style={{ display: "grid", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label>Month</label>
        <select
          value={month}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= 1 && v <= 12) {
              setMonth(v);
            }
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const m = i + 1;
            return (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
              </option>
            );
          })}
        </select>

        <label>Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value));
          }}
          style={{ width: 100 }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: "0.75rem",
          }}
        >
          <div>Income</div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>
            {currency.format(income)}
          </div>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: "0.75rem",
          }}
        >
          <div>Expenses</div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>
            {currency.format(expense)}
          </div>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: "0.75rem",
          }}
        >
          <div>Net</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: net >= 0 ? "green" : "crimson",
            }}
          >
            {currency.format(net)}
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>
          By Category (Top 5)
        </div>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {byCategory.slice(0, 5).map((row) => {
              return (
                <li
                  key={row.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px dashed #e6e6e6",
                  }}
                >
                  <span>{row.name}</span>
                  <span>{currency.format(row.total)}</span>
                </li>
              );
            })}
            {byCategory.length === 0 && (
              <li>No transactions in this period.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SummaryPanel;
