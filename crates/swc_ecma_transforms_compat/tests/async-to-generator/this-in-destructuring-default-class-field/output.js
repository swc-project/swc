class Base {
    setState(value) {
        return value;
    }
}
class Derived extends Base {
    constructor(...args){
        var _this;
        super(...args), _this = this, _define_property(this, "state", {
            value: 1
        }), _define_property(this, "method", (param)=>_async_to_generator(function*() {
                const { state = _this.state } = param;
                return _this.setState(state);
            })());
    }
}
