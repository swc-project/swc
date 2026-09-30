function F() {
    return {
        method () {
            return new.target;
        },
        get value () {
            return new.target;
        },
        set value (value){
            console.log(new.target === void 0);
        }
    };
}
var obj = new F();
console.log(void 0 === obj.method() && void 0 === obj.value);
obj.value = 1;
