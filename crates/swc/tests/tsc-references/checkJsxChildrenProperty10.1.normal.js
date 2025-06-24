//// [file.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Button = /*#__PURE__*/ function() {
    "use strict";
    function Button() {
        _class_call_check(this, Button);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return <div>My Button</div>;
    };
    return Button;
}();
// OK
var k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
var k2 = <div> <h2> Hello </h2> {function(user) {
    return <h2>{user.name}</h2>;
}}</div>;
var k3 = <div> {1} {"That is a number"} </div>;
var k4 = <Button> <h2> Hello </h2> </Button>;
