var E, E1, Flag, Flag1;
(E = E1 || (E1 = {
}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", one(()=>{
}), on({
    test: ()=>{
    }
}), on({
    test: (x)=>{
    }
}), new Component1({
    data: {
        hello: ""
    }
}).get("hello"), dispatchMethod("someMethod", [
    "hello",
    35
]);
class SampleClass {
    constructor(props1){
        this.props = Object.freeze(props1);
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
}({
}), (Flag1 = Flag || (Flag = {
})).FLAG_1 = "flag_1", Flag1.FLAG_2 = "flag_2";
