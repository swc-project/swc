function foo(arg1) {
    return arg1.cb(null);
}
var arg = {
    cb: function(x) {
        return '';
    }
};
foo(arg), foo({
    cb: function(x, y) {
        return '';
    }
}), foo({
    cb: function(x, y) {
        return '';
    }
}), foo(arg), foo({
    cb: function(x) {
        return '';
    }
}), foo({
    cb: function(x) {
        return '';
    }
}), foo({
    cb: function() {
        return '';
    }
});
