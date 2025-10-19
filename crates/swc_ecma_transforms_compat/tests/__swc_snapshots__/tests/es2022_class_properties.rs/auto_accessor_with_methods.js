var __accessor_count = /*#__PURE__*/ new WeakMap();
var Store = /*#__PURE__*/ function() {
    "use strict";
    function Store() {
        _class_call_check(this, Store);
        _class_private_field_init(this, __accessor_count, {
            writable: true,
            value: 0
        });
    }
    _create_class(Store, [
        {
            key: "count",
            get: function() {
                return _class_private_field_get(this, __accessor_count);
            },
            set: function(_v) {
                _class_private_field_set(this, __accessor_count, _v);
            }
        },
        {
            key: "increment",
            value: function increment() {
                this.count++;
            }
        }
    ]);
    return Store;
}();
var store = new Store();
expect(store.count).toBe(0);
store.count = 5;
expect(store.count).toBe(5);
store.increment();
expect(store.count).toBe(6);
