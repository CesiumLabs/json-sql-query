import { AST } from 'node-sql-parser';

declare module '@devsnowflake/jsql' {
    export interface Handlers {
        create: (q: AST, db: Database) => void;
        select: (q: AST, db: Database) => SelectOperation[] & ParseFunction;
        insert: (q: AST, db: Database) => void;
        drop: (q: AST, db: Database) => boolean;
        update: (q: AST, db: Database) => void;
        delete: (q: AST, db: Database) => void;
    }

    export type SelectOperation = any[];
    export type ParseFunction = () => any[];

    export interface DatabasePrepare {
        ast: AST | AST[];
        run: () => any;
        statement: string;
    }

    export type Statement = string | AST | AST[];

    export interface SQLParser {
        parse: (statement: string) => AST | AST[];
        stringify: (statement: AST | AST[]) => string;
        validate: (statement: string) => boolean;
    }

    export class Database {
        memory: boolean;
        constructor(name: string, memory?: boolean);
        get db(): any;
        static get handlers(): Handlers;
        write(data: any): void;
        run(query: Statement): any;
        prepare(query: Statement): DatabasePrepare;
        parse(statement: Statement): string;
    }
}
