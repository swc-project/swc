function _toBeMocked__2() {
    return "I am the original function";
}
export var toBeMocked__2 = _toBeMocked__2;
var _$mock__7 = {
    get toBeMocked () {
        return toBeMocked__2;
    },
    set toBeMocked (mock__5){
        toBeMocked__2 = mock__5;
    }
};
export { _$mock__7 as mock__2 };
