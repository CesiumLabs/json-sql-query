module.exports = (ast, db) => {
    if (ast.type.toLowerCase() !== 'drop') throw new TypeError('invalid query type');
    if (ast.keyword !== 'table') throw new Error(`Unsupported ${ast.keyword}`);

    const table = ast.name[0].table;

    const data = db.db;
    if (!data[table]) return false;

    delete data[table];
    db.write(data);

    return true;
};
