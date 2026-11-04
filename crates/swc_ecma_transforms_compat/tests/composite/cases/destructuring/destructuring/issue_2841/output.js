function foo(a, b) {
    var ref;
    ref = Array.prototype.slice.call(arguments), a = ref[0], b = ref[1], restParam = ref.slice(2), ref;
}
