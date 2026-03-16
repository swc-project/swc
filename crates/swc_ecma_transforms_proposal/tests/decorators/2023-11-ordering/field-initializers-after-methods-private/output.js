var _init_foo, _initProto;
var counter = 0;
class A {
    static{
        ({ e: [_init_foo, _initProto] } = _apply_decs_2311(this, [], [
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
                function() {
                    return this.#foo;
                },
                function(value) {
                    this.#foo = value;
                }
            ]
        ], 0, (o)=>#foo in o));
    }
    #foo = (_initProto(this), _init_foo(this, (()=>{
        counter++;
        expect(typeof this.method).toBe("function");
        expect(()=>this.#foo).toThrow();
        expect(()=>this.#bar).toThrow();
        return "#foo";
    })()));
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
