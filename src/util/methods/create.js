module.exports = (ast, db) => {
    if (ast.type.toLowerCase() !== 'create') throw new TypeError('invalid query type');
    if (ast.keyword !== 'table') throw new Error(`Unsupported ${ast.keyword}`);
    const ifne = ast.if_not_exists === 'if not exists';
    const table = ast.table[0].table;

    const col = ast.create_definitions.map((m) => ({ column: m.column.column, type: m.definition.dataType }));
    const data = db.db;

    const payload = {
        tableName: table,
        keys: col,
        data: [],
    };

    if (ifne && data[payload.tableName]) return;

    data[payload.tableName] = payload;
    db.write(data);
};
