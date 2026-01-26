!function foo(obj) {
    if (obj) {
        for(let key in obj){
            let element = obj[key];
            element && foo(element.children);
        }
        return !0;
    }
    return !1;
}();
