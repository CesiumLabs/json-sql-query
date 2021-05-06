const { chunk } = require('../Util');

module.exports = (ast, db) => {
    if (ast.type.toLowerCase() !== 'delete') throw new TypeError('invalid query type');
    const table = ast.from[0].table;
    const data = db.db;
    if (!data[table]) throw new Error(`Table "${table}" does not exist`);

    const point = { left: ast.where.left.value, op: ast.where.operator, right: ast.where.right.value };
    if (!data[table].keys.some((x) => x.column === point.left)) throw new Error(`Column "${set.col}" does not exists in table "${table}"`);
    const bin = binOp(data[table], point);
    if (bin.index < 0) return;

    bin.data.forEach((d) => {
        data[table].data.splice(data[table].data.indexOf(d), 1);
    });

    db.write(data);
};

function binOp(data, clause) {
    switch (clause.op) {
        case '=':
            const child = chunk(data.data, 2);
            const fnx = (m) => m.key === clause.left && m.data === clause.right;
            const fn = (x) => x.find(fnx);

            try {
                const data = child.find(fn);
                if (!data) throw new Error(`Could not verify operation "${clause.left} = ${clause.right}"`);
                return {
                    data: data,
                    index: child.findIndex(fn),
                };
            } catch {
                throw new Error(`Could not verify operation "${clause.left} = ${clause.right}"`);
            }
    }
}
