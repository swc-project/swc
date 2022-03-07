var E, Flag;
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {})), one(()=>{}), on({
    test: ()=>{}
}), on({
    test: (x)=>{}
}), new Component1({
    data: {
        hello: ""
    }
}).get("hello"), dispatchMethod("someMethod", [
    "hello",
    35
]);
class SampleClass {
    constructor(props){
        this.props = Object.freeze(props);
    }
}
new class extends SampleClass {
    brokenMethod() {
        this.props.foo.concat;
    }
    constructor(props){
        super(merge(props, {
            foo: "bar"
        }));
    }
}({}), function(Flag) {
    Flag.FLAG_1 = "flag_1", Flag.FLAG_2 = "flag_2";
}(Flag || (Flag = {}));
