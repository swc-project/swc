var _store = /*#__PURE__*/ new WeakMap(), _body = /*#__PURE__*/ new WeakMap();
export class Context {
    constructor(optionsOrContext){
        _class_private_field_init(this, _store, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _body, {
            writable: true,
            value: void 0
        });
        this.response = {
            headers: new Headers()
        };
        this.params = {};
        if (optionsOrContext instanceof Context) {
            Object.assign(this, optionsOrContext);
            this.customContext = this;
            return;
        }
    }
}
