const sql = require('../sql/parser');
const fs = require('fs');
const handlers = {
    create: require('../Util/create'),
    select: require('../Util/select'),
    insert: require('../Util/insert'),
    drop: require('../Util/drop'),
};

class Database {
    constructor(name) {
        this.name = name;
        if (!fs.existsSync(this.name)) fs.writeFileSync(this.name, '{}');
    }

    get db() {
        try {
            const db = JSON.parse(fs.readFileSync(this.name, 'utf-8'));
            return db;
        } catch {
            throw new Error('malformed database');
        }
    }

    static get handlers() {
        return handlers;
    }

    write(data) {
        fs.writeFileSync(this.name, JSON.stringify(data));
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