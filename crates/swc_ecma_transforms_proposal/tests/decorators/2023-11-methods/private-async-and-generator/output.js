var _call_a, _call_g, _call_ag, _initProto;
class Foo {
    static{
        ({ e: [_call_a, _call_g, _call_ag, _initProto] } = _apply_decs_2311(this, [], [
            [
                dec,
                2,
                "a",
                async function() {}
            ],
            [
                dec,
                2,
                "g",
                function*() {}
            ],
            [
                dec,
                2,
                "ag",
                async function*() {}
            ]
        ], 0, (o)=>#a in o));
    }
    constructor(){
        _initProto(this);
    }
    get #a() {
        return _call_a;
    }
    get #g() {
        return _call_g;
    }
    get #ag() {
        return _call_ag;
    }
}
