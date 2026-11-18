module.exports = [50708, (context) => {
    "use strict";
    var join, run;
    join = (left, right) => left + right,
    run = (rows) => {
        rows.map((row) => join(row.g, row.r));
        return rows.map((row) => (item) => join(row.g, item.l));
    };
    context.s(["run", 0, run], 42519);
}];
