var _obj;
const Hello = {
    toString: function toString() {
        return 'hello';
    }
};
const Outer = _obj = {
    constructor: function constructor() {
        const Inner = {
            [_get(_get_prototype_of(_obj), "toString", this).call(this)]: function() {
                return 'hello';
            }
        };
        return Inner;
    }
};
Object.setPrototypeOf(Outer, Hello);
