function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
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
}), setState(foo, {
}), setState(foo, foo), setState(foo, {
    a: void 0
}), setState(foo, {
    c: !0
});
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "setState",
            value: function(props) {
                for(var k in props)this.state[k] = props[k];
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), c = new C();
c.setState({
    a: "test",
    b: 43
}), c.setState({
    a: "hi"
}), c.setState({
    b: void 0
}), c.setState({
}), c.setState(foo), c.setState({
    a: void 0
}), c.setState({
    c: !0
});
