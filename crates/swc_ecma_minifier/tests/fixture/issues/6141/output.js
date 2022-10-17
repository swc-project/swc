!function foo(obj) {
    if (obj) {
        for(const key in obj){
            const element = obj[key];
            element && foo(element.children);
        }
        return !0;
    }
    return !1;
}();
