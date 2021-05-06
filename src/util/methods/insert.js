module.exports = (ast, db) => {
    if (ast.type.toLowerCase() !== 'insert') throw new TypeError('invalid query type');
    const table = ast.table[0].table;
    const data = db.db;
    if (!data[table]) throw new Error(`Table "${table}" does not exist`);
    const values = ast.values.find((f) => f.type === 'expr_list');
    if (ast.columns.length !== values.value.length) throw new Error('values length mismatch');

    const payload = ast.columns.map((m, i) => ({
        key: m,
        data: values.value[i].value,
    }));

    payload.forEach((i) => {
        data[table].data.push(i);
    });

    db.write(data);
};
