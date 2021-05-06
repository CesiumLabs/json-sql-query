const { chunk } = require("../Util");

module.exports = (ast, db) => {
    if (ast.type.toLowerCase() !== 'update') throw new TypeError('invalid query type');
    const table = ast.table[0].table;
    const data = db.db;
    if (!data[table]) throw new Error(`Table "${table}" does not exist`);
    
    const set = { col: ast.set[0].column, val: ast.set[0].value.value };
    const point = { left: ast.where.left.value, op: ast.where.operator, right: ast.where.right.value, set };
    if (!data[table].keys.some(x => x.column === set.col)) throw new Error(`Column "${set.col}" does not exists in table "${table}"`);
    const bin = binOp(data[table], point);
    if (bin.index < 0) return;

    const dataAt = data[table].data[bin.index + bin.idx];
    data[table].data.splice(bin.index + bin.idx, 1, {
        ...dataAt,
        data: set.val
    });

    db.write(data);
}

function binOp(data, clause) {
    switch(clause.op) {
        case "=":
            const child = chunk(data.data, 2);
            const fnx = m => m.key === clause.left && m.data === clause.right;
            const fn = x => x.find(fnx);

            try {
                return {
                    data: child.find(fn),
                    index: child.findIndex(fn),
                    idx: child.find(fn).findIndex(x => x.key === clause.set.col)
                };
            } catch {
                throw new Error(`Could not verify operation "${clause.left} = ${clause.right}"`);
            }
    }
}