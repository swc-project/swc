//// [mappedTypeErrors.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function setState(obj, props) {
    for(var k in props)obj[k] = props[k];
}
var foo = {
    a: "hello",
    b: 42
};
setState(foo, {
    a: "test",
    b: 43
}), setState(foo, {
    a: "hi"
}), setState(foo, {
    b: void 0
}), setState(foo, {}), setState(foo, foo), setState(foo, {
    a: void 0
}), setState(foo, {
    c: !0
});
var c = new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.setState = function(props) {
        for(var k in props)this.state[k] = props[k];
    }, C;
}())();
c.setState({
    a: "test",
    b: 43
}), c.setState({
    a: "hi"
}), c.setState({
    b: void 0
}), c.setState({}), c.setState(foo), c.setState({
    a: void 0
}), c.setState({
    c: !0
});
