var _dec, _dec1, _init_a, _init_b, _initProto;
const fields = Symbol.for("fields");
const track = ()=>(_value, ctx)=>{
        if (ctx.kind === "field") {
            ctx.addInitializer(function() {
                (this[fields] ??= new Set()).add(ctx.name);
            });
        }
    };
_dec = track(), _dec1 = track();
class Foo {
    static{
        ({ e: [_init_a, _init_b, _initProto] } = _apply_decs_2203_r(this, [
            [
                _dec,
                0,
                "a"
            ],
            [
                _dec1,
                0,
                "b"
            ]
        ], []));
    }
    a = (_initProto(this), _init_a(this));
    b = _init_b(this);
    static X = class {
    };
    constructor(){
        this.a = 1;
        this.b = 2;
    }
}
console.log([
    ...new Foo()[fields] ?? []
]); // expected ["a","b"], actual []
