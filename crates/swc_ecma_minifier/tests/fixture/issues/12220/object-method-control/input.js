function F() {
    return (function() {
        return {
            method() { return new.target; },
            get value() { return new.target; },
            set value(value) { console.log(new.target === undefined); }
        };
    })();
}
var obj = new F();
console.log(obj.method() === undefined && obj.value === undefined);
obj.value = 1;
