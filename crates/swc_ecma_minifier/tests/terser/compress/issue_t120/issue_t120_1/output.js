function foo(node) {
    for(; function(obj) {
        var i = obj.data;
        return i && i.a != i.b;
    }(node);)node = node.data;
    return node;
}
var x = {
    a: 1,
    b: 2,
    data: {
        a: "hello"
    }
};
console.log(foo(x).a, foo({
    a: "world"
}).a);
