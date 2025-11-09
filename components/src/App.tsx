import DatabaseProvider from "./providers/DatabaseProvider";
import { useDatabase } from "./hooks/useDatabase";

function TransactionsPage() {
  const { ready, api } = useDatabase();
  if (!ready) return <div>Loading database…</div>;

  const txns = api.transactions.listTransactions(); // read
  // render table/list here…

  return <div>{txns.length} transactions</div>;
}

export default function App() {
  return (
    <DatabaseProvider>
      {/* router or simple pages go here */}
      <TransactionsPage />
    </DatabaseProvider>
  );
}
