const sql = require('../sql/parser');
const fs = require('fs');
const handlers = {
    create: require('../util/methods/create'),
    select: require('../util/methods/select'),
    insert: require('../util/methods/insert'),
    drop: require('../util/methods/drop'),
    update: require('../util/methods/update'),
};

class Database {
    constructor(name, memory = false) {
        this.name = memory === true ? ':memory:' : name;
        this.memory = !memory && this.name === ':memory:' ? true : Boolean(memory);
        this._memdb = {};

        Object.defineProperty(this, '_memdb', { enumerable: false });

        if (!this.memory && !fs.existsSync(this.name)) fs.writeFileSync(this.name, '{}');
    }

    get db() {
        try {
            const db = this.memory ? this._memdb : JSON.parse(fs.readFileSync(this.name, 'utf-8'));
            return db;
        } catch {
            throw new Error('malformed database');
        }
    }

    static get handlers() {
        return handlers;
    }

    write(data) {
        if (!this.memory) fs.writeFileSync(this.name, JSON.stringify(data));
        else this._memdb = data;
    }

    run(query) {
        if (typeof query === 'string') query = sql.parse(q);
        if (Array.isArray(query)) {
            return query.map((q) => handlers[q.type](q, this));
        } else {
            return handlers[query.type](query, this);
        }
    }

    prepare(query) {
        const q = typeof query === 'string' ? sql.parse(query) : query;

        const stmt = { statement: sql.stringify(q) };

        const run = this.run.bind(this);

        Object.defineProperties(stmt, {
            ast: {
                get: () => q,
                enumerable: true,
            },
            run: {
                value: function runFunction() {
                    return run(q);
                },
                enumerable: true,
            },
        });

        return stmt;
    }

    parse(statement) {
        return this.prepare(statement).statement;
    }
}

module.exports = Database;
