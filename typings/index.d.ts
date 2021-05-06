import { AST } from "node-sql-parser"

declare module "jsql" {

    export interface Handlers {
        create: (q: AST) => void;
        select: (q: AST) => any[];
        insert: (q: AST) => void;
        drop: (q: AST) => boolean;
    }

    export interface DatabasePrepare {
        ast: AST | AST[];
        run: () => any;
        statement: string;
    }

    export type Statement = string | AST | AST[];

    export class SQLParser {
        static parse(statement: string): AST | AST[];
        static stringify(statement: AST | AST[]): string;
        static validate(statement: string): boolean;
    }

    export class Database {
        constructor(name: string);
        get db(): any;
        static get handlers(): Handlers;
        write(data: any): void;
        run(query: Statement): any;
        prepare(query: Statement): DatabasePrepare;
        parse(statement: Statement): string;
    }

}