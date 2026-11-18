var pos, lst;

function other() {
    pos = 100;
    return [1, 2, 3];
}

function test() {
    var result = 0;
    lst = other();
    for (pos = 1; pos <= lst.length; pos++) {
        result++;
    }
    return result;
}

console.log(test());
