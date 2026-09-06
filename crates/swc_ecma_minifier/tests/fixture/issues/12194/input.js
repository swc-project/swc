const events = [];
const value = {
    get current() {
        events.push("get");
        return 0;
    },
    set current(value) {
        events.push("set");
    },
};

console.log(value.current === void (value.current = 1));
console.log(value.current === !(value.current = 1));
console.log(value.current === 0);
console.log(value.current === void 0);
console.log(value.current === !0);
console.log(events.join(","));
