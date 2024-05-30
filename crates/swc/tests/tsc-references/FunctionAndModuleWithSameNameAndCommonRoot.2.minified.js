//// [function.ts]
//// [module.ts]
var A;
((A = {}).Point || (A.Point = {})).Origin = {
    x: 0,
    y: 0
};
//// [test.ts]
A.Point, A.Point(), A.Point.Origin;
//// [simple.ts]
var B;
!function(B) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    B.Point = Point, (Point = B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B = {}), B.Point, B.Point(), B.Point.Origin;
