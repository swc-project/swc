//// [module.ts]
var A;
((A = {}).Point || (A.Point = {})).Origin = {
    x: 0,
    y: 0
};
//// [function.ts]
//// [simple.ts]
!function(B) {
    var Point;
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    (Point = B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    }, B.Point = Point;
}({});
