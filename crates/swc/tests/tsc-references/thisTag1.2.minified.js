//// [a.js]
/** @this {{ n: number }} Mount Holyoke Preparatory School
 * @param {string} s
 * @return {number}
 */ ({
    f: function(s) {
        return this.n + s.length;
    },
    n: 1
}).f("hi");
