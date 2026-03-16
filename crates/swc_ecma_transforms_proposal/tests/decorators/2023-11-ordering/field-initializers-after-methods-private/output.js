var _init_foo, _init_extra_foo;
var counter = 0;
class A {
    static{
        ({ e: [_init_foo, _init_extra_foo] } = _apply_decs_2311(this, [], [
            [
                (_, { addInitializer })=>{
                    addInitializer(function() {
                        counter++;
                        expect(typeof this.method).toBe("function");
                        expect(this.#foo).toBe("#foo");
                        expect(()=>this.#bar).toThrow();
                    });
                },
                0,
                "foo",
                function(_this) {
                    return _this.#foo;
                },
                function(_this, value) {
                    _this.#foo = value;
                }
            ]
        ], 0, (o)=>#foo in o));
    }
    #foo = (()=>{
        const _value = _init_foo(this, (()=>{
            counter++;
            expect(typeof this.method).toBe("function");
            expect(()=>this.#foo).toThrow();
            expect(()=>this.#bar).toThrow();
            return "#foo";
        })());
        _init_extra_foo(this);
        return _value;
    })();
    method() {}
    #bar = (()=>{
        counter++;
        expect(typeof this.method).toBe("function");
        expect(this.#foo).toBe("#foo");
        expect(()=>this.#bar).toThrow();
    })();
}
expect(counter).toBe(0);
new A();
expect(counter).toBe(3);
