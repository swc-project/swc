function F() {
    return function() {
        return (target = new.target)=>target;
    }();
}
console.log(void 0 === new F()());
