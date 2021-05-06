module.exports = {
    chunk: (arr, len) => {
        const nm = [];
        for (let i = 0; i < arr.length; i += len) nm.push(arr.slice(i, i + len));
        return nm;
    },
};
