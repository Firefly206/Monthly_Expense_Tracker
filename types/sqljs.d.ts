declare module "sql.js" {
  export interface Database {
    run(sql: string, params?: any[]): void;
    prepare(sql: string): any;
    export(): Uint8Array;
    close(): void;
  }

  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => Database;
  }

  const initSqlJs: (options?: {
    locateFile?: (file: string) => string;
  }) => Promise<SqlJsStatic>;
  export default initSqlJs;
}
