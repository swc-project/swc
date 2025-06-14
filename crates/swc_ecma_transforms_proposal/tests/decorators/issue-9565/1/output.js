var _dec, _init_effect, _initProto;
function effect(getDep) {
    return function(_, context) {};
}
_dec = effect(()=>[
        1,
        2
    ]);
class A {
    static{
        ({ e: [_init_effect, _initProto] } = _apply_decs_2203_r(this, [
            [
                _dec,
                0,
                "effect",
                function() {
                    return this.#effect;
                },
                function(value) {
                    this.#effect = value;
                }
            ]
        ], []));
    }
    constructor(){
        _initProto(this);
    }
    #effect = _init_effect(this, ()=>{
        console.log(123);
    });
}