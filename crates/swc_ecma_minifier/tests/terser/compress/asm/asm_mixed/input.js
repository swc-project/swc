function asm_GeometricMean(stdlib, foreign, buffer) {
    "use asm";
    var exp = stdlib.Math.exp;
    var log = stdlib.Math.log;
    var values = new stdlib.Float64Array(buffer);
    function logSum(start, end) {
        start = start | 0;
        end = end | 0;
        var sum = 0.0,
            p = 0,
            q = 0;
        for (p = start << 3, q = end << 3; (p | 0) < (q | 0); p = (p + 8) | 0) {
            sum = sum + +log(values[p >> 3]);
        }
        return +sum;
    }
    function geometricMean(start, end) {
        start = start | 0;
        end = end | 0;
        return +exp(+logSum(start, end) / +((end - start) | 0));
    }
    return { geometricMean: geometricMean };
}
function no_asm_GeometricMean(stdlib, foreign, buffer) {
    var exp = stdlib.Math.exp;
    var log = stdlib.Math.log;
    var values = new stdlib.Float64Array(buffer);
    function logSum(start, end) {
        start = start | 0;
        end = end | 0;
        var sum = 0,
            p = 0,
            q = 0;
        for (p = start << 3, q = end << 3; (p | 0) < (q | 0); p = (p + 8) | 0) {
            sum = sum + +log(values[p >> 3]);
        }
        return +sum;
    }
    function geometricMean(start, end) {
        start = start | 0;
        end = end | 0;
        return +exp(+logSum(start, end) / +((end - start) | 0));
    }
    return { geometricMean: geometricMean };
}
