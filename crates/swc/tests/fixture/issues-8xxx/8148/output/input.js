function _toBeMocked() {
    return "I am the original function";
}
export var toBeMocked = _toBeMocked;
var _$mock = {
    get toBeMocked () {
        return toBeMocked;
    },
    set toBeMocked (mock){
        toBeMocked = mock;
    }
};
export { _$mock as mock };
