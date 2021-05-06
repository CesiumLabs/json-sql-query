const { chunk } = require('../Util');

module.exports = (ast, db) => {
    if (ast.type.toLowerCase() !== 'select') throw new TypeError('invalid query type');
    const table = ast.from[0].table;
    const limit = ast.limit?.value[0].value ?? -1;

    const data = db.db[table];
    if (!data) throw new Error(`Table \"${table}\" does not exist`);

    if (!ast.where) {
        const fn = chunk(
            data.data.map((m) => ({ key: m.key, data: m.data ?? null })),
            2
        );
        if (limit >= 0) return handle(fn.slice(0, limit));
        return handle(fn);
    } else {
        const bin = binOp(data, { op: ast.where.operator, left: ast.where.left.value, right: ast.where.right.value });
        if (limit >= 0) return handle(bin.data?.slice(0, limit) ?? []);
        return handle(bin.data ?? []);
    }
};

function handle(d) {
    if (!d) return [];

    return Object.defineProperties(d, {
        parse: {
            value: () => {
                return d.map(col => {
                    let obj = {};

                    col.forEach(keys => {
                        obj[keys.key] = keys.data;
                    });

                    return obj;
                })
            }
        },
    });
}

function binOp(data, clause) {
    switch (clause.op) {
        case '=': {
            const dat = [];
            const child = chunk(data.data, 2);
            for (let i = 0; i < child.length; i++) {
                if (child[i].some(m => m.key === clause.left && m.data === clause.right)) dat.push(child[i]);
            }

            try {
                return {
                    data: dat
                };
            } catch {
                throw new Error(`Could not verify operation "${clause.left} = ${clause.right}"`);
            }
        }

        case 'IS NOT': {
            const dat = [];
            const child = chunk(data.data, 2);
            for (let i = 0; i < child.length; i++) {
                if (child[i].some(m => m.key === clause.left && m.data !== clause.right)) dat.push([child[i]]);
            }

            try {
                return {
                    data: dat
                };
            } catch {
                throw new Error(`Could not verify operation "${clause.left} = ${clause.right}"`);
            }
        }
        default:
            return { data: [] };
    }
}