class C__1<T__2, U__2 extends T__2, V__2 extends U__2> {
    z: W;
    foo<W__4 extends V__2>(x__4: W__4): T__2 {
        var r__4: T__2;
        return x__4;
    }
}
interface I__1<T__5, U__5 extends T__5, V__5 extends U__5> {
    x__0: T__5;
    y__0: U__5;
    z__0: W;
    foo__0<W__6 extends V__5>(x__6: W__6): T__5;
}
function foo__1<T__7, U__7 extends T__7>(x__7: T__7, y__7: U__7): V {
    function bar__7<V__8 extends T__7, W__8 extends U__7>(): X {
        function baz__8<X__9 extends W__8, Y__9 extends V__8>(a__9: X__9, b__9: Y__9): T__7 {
            x__7 = y__7;
            return y__7;
        }
    }
}
function foo2__1<U__10 extends T__10, T__10>(x__10: T__10, y__10: U__10): W {
    function bar__10<V__11 extends T__10, W__11 extends U__10>(): Y {
        function baz__11<X__12 extends W__11, Y__12 extends V__11>(a__12: X__12, b__12: Y__12): T__10 {
            x__10 = y__10;
            return y__10;
        }
    }
}
var f3__1 = <T__13, U__13 extends T__13>(x__13: T__13, y__13: U__13)=>{
    function bar__13<V__14 extends T__13, W__14 extends U__13>(r__14: X, s__14: Y) {
        var g__14 = <X__15 extends W__14, Y__15 extends V__14>(a__15: X__15, b__15: Y__15): T__13 =>{
            x__13 = y__13;
            return y__13;
        };
    }
};
var f4__1 = <U__16 extends T__16, T__16>(x__16: V, y__16: X)=>{
    function bar__16<V__17 extends T__16, W__17 extends U__16>() {
        var g__17 = <X__18 extends W__17, Y__18 extends V__17>(a__18: X__18, b__18: Y__18): T__16 =>{
            x__16 = y__16;
            return y__16;
        };
    }
};
