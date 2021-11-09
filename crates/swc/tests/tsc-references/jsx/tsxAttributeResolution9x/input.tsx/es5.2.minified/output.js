function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var MyComponent = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function MyComponent() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, MyComponent);
    }
    return protoProps = [
        {
            key: "render",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = MyComponent).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), MyComponent;
}();
React.createElement(MyComponent, {
    foo: "bar"
}), React.createElement(MyComponent, {
    foo: 0
});
