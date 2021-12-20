function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Button = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Button() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Button);
    }
    return Constructor = Button, protoProps = [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null, "My Button");
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Button;
}();
React.createElement("div", null, " ", React.createElement("h2", null, " Hello "), " ", React.createElement("h1", null, " world ")), React.createElement("div", null, " ", React.createElement("h2", null, " Hello "), " ", function(user) {
    return React.createElement("h2", null, user.name);
}), React.createElement("div", null, " ", 1, " ", "That is a number", " "), React.createElement(Button, null, " ", React.createElement("h2", null, " Hello "), " ");
