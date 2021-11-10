class C<T__2, U__2 extends T__2, V__2 extends U__2> {
    z__0: W;
    foo<W__3 extends V__2>(x__3: W__3): T__2 {
        var r__3: T__2;
        return x__3;
    }
}
interface I<T__4, U__4 extends T__4, V__4 extends U__4> {
    x__0: T__4;
    y__0: U__4;
    z__0: W;
    foo__0<W__5 extends V__4>(x__5: W__5): T__4;
}
function foo<T__6, U__6 extends T__6>(x__6: T__6, y__6: U__6): V {
    function bar__6<V__7 extends T__6, W__7 extends U__6>(): X {
        function baz__7<X__8 extends W__7, Y__8 extends V__7>(a__8: X__8, b__8: Y__8): T__6 {
            x__6 = y__6;
            return y__6;
        }
    }
}
function foo2<U__9 extends T__9, T__9>(x__9: T__9, y__9: U__9): W {
    function bar__9<V__10 extends T__9, W__10 extends U__9>(): Y {
        function baz__10<X__11 extends W__10, Y__11 extends V__10>(a__11: X__11, b__11: Y__11): T__9 {
            x__9 = y__9;
            return y__9;
        }
    }
}
var f3 = <T__12, U__12 extends T__12>(x__12: T__12, y__12: U__12)=>{
    function bar__12<V__13 extends T__12, W__13 extends U__12>(r__13: X, s__13: Y) {
        var g__13 = <X__14 extends W__13, Y__14 extends V__13>(a__14: X__14, b__14: Y__14)=>{
            x__12 = y__12;
            return y__12;
        };
    }
};
var f4 = <U__15 extends T__15, T__15>(x__15: V, y__15: X)=>{
    function bar__15<V__16 extends T__15, W__16 extends U__15>() {
        var g__16 = <X__17 extends W__16, Y__17 extends V__16>(a__17: X__17, b__17: Y__17)=>{
            x__15 = y__15;
            return y__15;
        };
    }
};
