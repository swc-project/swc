var _initClass, _Bar;
const dec = ()=>{};
const Foo = (class Bar {
    static{
        ({ c: [_Bar, _initClass]  } = _apply_decs_2203_r(this, [], [
            dec
        ]));
    }
    bar = new _Bar();
    static{
        _initClass();
    }
}, _Bar);
const foo = new Foo();
