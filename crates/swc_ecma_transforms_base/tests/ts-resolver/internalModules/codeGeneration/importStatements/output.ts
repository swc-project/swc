module A {
    export class Point__2 {
        constructor(public x__3: number, public y__3: number){
        }
    }
    export var Origin__2 = new Point__2(0, 0);
}
module B {
    import a__4 = A
}
module C {
    import a__5 = A
    var m__5: typeof a__5;
    var p__5: a__5.Point;
    var p__5 = {
        x: 0,
        y: 0
    };
}
module D {
    import a__6 = A
    var p__6 = new a__6.Point(1, 1);
}
module E {
    import a__7 = A
    export function xDist__7(x__8: a__7.Point) {
        return (a__7.Origin.x - x__8.x);
    }
}
