class List {
}
class MyList {
}
function foo(x) {
}
function foo2(x) {
}
function other() {
    function foo3(x) {
    }
    function foo4(x) {
    }
    function foo5(x) {
        return null;
    }
    var list;
    var myList;
    var r = foo5(list);
    var r2 = foo5(myList);
}
