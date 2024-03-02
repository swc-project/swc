var _client = /*#__PURE__*/ new WeakMap();
var Foo = function Foo(props) {
    "use strict";
    _class_call_check(this, Foo);
    _class_private_field_init(this, _client, {
        writable: true,
        value: void 0
    });
    _class_private_field_set(this, _client, 'foo');
    ({ x: this.x = _class_private_field_get(this, _client), y: _class_private_field_destructure(this, _client).value, z: this.z = _class_private_field_get(this, _client) } = props);
};
