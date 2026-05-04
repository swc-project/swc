var pos, lst;
function other() {
    return pos = 100, [
        1,
        2,
        3
    ];
}
function test() {
    var result = 0;
    for(lst = other(), pos = 1; pos <= lst.length; pos++)result++;
    return result;
}
console.log(test());
