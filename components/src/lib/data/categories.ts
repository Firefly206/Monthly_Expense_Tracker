import { all, runWrite } from "../db/sqlite";

export type Category = {
  id: number;
  name: string;
  type: "expense" | "income";
  description?: string | null;
};

export function listCategories(): Category[] {
  return all<Category>(
    "SELECT id, name, type, description FROM categories ORDER BY type, name;"
  );
}

export function createCategory(input: {
  name: string;
  type: "expense" | "income";
  description?: string;
}) {
  runWrite(
    "INSERT INTO categories (name, type, description) VALUES (?, ?, ?);",
    [input.name, input.type, input.description ?? null]
  );
}

export function deleteCategory(id: number) {
  runWrite("DELETE FROM categories WHERE id = ?;", [id]);
}
