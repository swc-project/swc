function func1(arg1, arg2) {
    return getX(arg1) + arg2
}
function getX(x) {
    const v = document.getElementById('eid').getAttribute(x)
    return v
}
console.log(func1(7, getX('data-x')))
console.log(func1(7, getX('data-y')))

