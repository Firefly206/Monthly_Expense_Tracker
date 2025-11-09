import { all, runWrite } from "../db/sqlite";

export type Txn = {
  id: number;
  date_iso: string; // 'YYYY-MM-DD'
  amount_cents: number; // integer cents
  category_id: number;
  note?: string | null;
  category_name?: string; // joined for display
  category_type?: "expense" | "income";
};

export function addTransaction(input: {
  dateISO: string;
  amountCents: number;
  categoryId: number;
  note?: string;
}) {
  runWrite(
    "INSERT INTO transactions (date_iso, amount_cents, category_id, note) VALUES (?, ?, ?, ?);",
    [input.dateISO, input.amountCents, input.categoryId, input.note ?? null]
  );
}

export function listTransactions(filters?: {
  from?: string;
  to?: string;
  categoryId?: number;
}): Txn[] {
  const parts: string[] = [];
  const args: (string | number)[] = [];
  if (filters?.from) {
    parts.push("date_iso >= ?");
    args.push(filters.from);
  }
  if (filters?.to) {
    parts.push("date_iso <= ?");
    args.push(filters.to);
  }
  if (filters?.categoryId) {
    parts.push("category_id = ?");
    args.push(filters.categoryId);
  }

  const where = parts.length ? `WHERE ${parts.join(" AND ")}` : "";
  const sql = `SELECT t.id, t.date_iso, t.amount_cents, t.category_id, t.note,
            c.name as category_name, c.type as category_type
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       ${where}
       ORDER BY t.date_iso DESC, t.id DESC;`;

  return all<Txn>(sql, args);
}

export function monthTotals(
  year: number,
  month: number
): { sumCents: number; count: number } {
  const m = String(month).padStart(2, "0");
  const from = `${year}-${m}-01`;
  const to = `${year}-${m}-31`; // simple bound; index handles it
  const rows = all<{ sumCents: number; count: number }>(
    "SELECT COALESCE(SUM(amount_cents),0) as sumCents, COUNT(*) as count FROM transactions WHERE date_iso BETWEEN ? AND ?;",
    [from, to]
  );
  return rows[0] ?? { sumCents: 0, count: 0 };
}
