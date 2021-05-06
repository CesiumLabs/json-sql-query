module.exports = (ast, db) => {
    if (ast.type.toLowerCase() !== 'select') throw new TypeError('invalid query type');
    const table = ast.from[0].table;
    const limit = ast.limit?.value[0].value ?? -1;

    const data = db.db[table];
    if (!data) throw new Error(`Table \"${table}\" does not exist`);

    const fn = chunk(
        data.data.map((m) => ({ id: m.key, data: m.data ?? null })),
        2
    );

    if (limit >= 0) return fn.slice(0, limit);
    return fn;
};

function chunk(arr, len) {
    const nm = [];
    for (let i = 0; i < arr.length; i += len) nm.push(arr.slice(i, i + len));
    return nm;
}
