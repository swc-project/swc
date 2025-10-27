function getX(t) {
    return document.getElementById('eid').getAttribute(t);
}
console.log((getX('data-x'), getX(7) + 7)), console.log((getX('data-y'), getX(7) + 7));
