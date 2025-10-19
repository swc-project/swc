var Store = /*#__PURE__*/ function() {
    "use strict";
    function Store() {
        _class_call_check(this, Store);
    }
    _create_class(Store, null, [
        {
            key: "count",
            get: function() {
                return _class_static_private_field_spec_get(this, Store, __accessor_count);
            },
            set: function(_v) {
                _class_static_private_field_spec_set(this, Store, __accessor_count, _v);
            }
        }
    ]);
    return Store;
}();
var __accessor_count = {
    writable: true,
    value: 42
};
expect(Store.count).toBe(42);
Store.count = 100;
expect(Store.count).toBe(100);
