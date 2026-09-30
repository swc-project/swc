function F() {
    return function() {
        return ()=>()=>new.target;
    }();
}
console.log(void 0 === new F()()());
