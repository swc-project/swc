var t, e;
function getX(t) {
    return document.getElementById('eid').getAttribute(t);
}
console.log((t = getX('data-x'), getX(7) + t)), console.log((e = getX('data-y'), getX(7) + e));
