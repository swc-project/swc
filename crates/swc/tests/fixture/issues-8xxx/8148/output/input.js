function _toBeMocked() {
    return "I am the original function";
}
export var toBeMocked = _toBeMocked;
export var _$mock = {
    get toBeMocked () {
        return toBeMocked;
    },
    set toBeMocked (mock){
        toBeMocked = mock;
    }
};
