function _toBeMocked__2() {
    return "I am the original function";
}
export var toBeMocked__2 = _toBeMocked__2;
export var mock__2 = {
    get toBeMocked () {
        return toBeMocked__2;
    },
    set toBeMocked (mock__5){
        toBeMocked__2 = mock__5;
    }
};
