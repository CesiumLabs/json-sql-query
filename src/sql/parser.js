const { Parser } = require('node-sql-parser');
const parser = new Parser();

module.exports.parse = function (query) {
    try {
        return parser.astify(query);
    } catch(e) {
        const expected = [...new Set((e.expected ?? []).filter(m => m.type === "literal").map((m) => m.text))];
        throw new SyntaxError(`Expected ${expected.join(", ")} but received "${e.found}"!`);
    }
};

module.exports.stringify = function (query) {
    return parser.sqlify(query);
};

module.exports.validate = function (query) {
    try {
        parser.parse(query);
        return true;
    } catch {
        return false;
    }
};
