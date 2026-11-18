let n, r;
function e(n) {
    return n + 1;
}
async function o(n) {
    return n + 1;
}
function* t(n) {
    yield n + 1;
}
globalThis.render = function() {
    return function(n = e) {
        return n;
    }();
}, console.log("sync", render() === render()), globalThis.render = function() {
    return function(n = o) {
        return n;
    }();
}, console.log("async", render() === render()), globalThis.render = function() {
    return function(n = t) {
        return n;
    }();
}, console.log("generator", render() === render()), n = (n)=>n + 1, globalThis.render = function() {
    return function(r = n) {
        return r;
    }();
}, console.log("arrow", render() === render()), r = async (n)=>n + 1, globalThis.render = function() {
    return function(n = r) {
        return n;
    }();
}, console.log("asyncArrow", render() === render());
