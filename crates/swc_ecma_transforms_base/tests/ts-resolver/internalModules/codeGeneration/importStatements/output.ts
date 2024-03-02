namespace A__2 {
    export class Point__3 {
        constructor(public x__4: number, public y__4: number){}
    }
    export var Origin__3 = new Point__3(0, 0);
}
namespace B__2 {
    import a__5 = A__2;
}
namespace C__2 {
    import a__6 = A__2;
    var m__6: typeof a__6;
    var p__6: a__6.Point;
    var p__6 = {
        x: 0,
        y: 0
    };
}
namespace D__2 {
    import a__7 = A__2;
    var p__7 = new a__7.Point(1, 1);
}
namespace E__2 {
    import a__8 = A__2;
    export function xDist__8(x__9: a__8.Point) {
        return a__8.Origin.x - x__9.x;
    }
}
