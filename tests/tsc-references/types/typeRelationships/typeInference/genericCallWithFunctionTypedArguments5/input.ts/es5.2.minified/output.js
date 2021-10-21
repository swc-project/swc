function foo(arg) {
    return arg.cb(null);
}
var arg1 = {
    cb: function(x) {
        return "";
    }
};
foo(arg1), foo({
    cb: function(x, y) {
        return "";
    }
}), foo({
    cb: function(x, y) {
        return "";
    }
}), foo(arg1), foo({
    cb: function(x) {
        return "";
    }
}), foo({
    cb: function(x) {
        return "";
    }
}), foo({
    cb: function() {
        return "";
    }
});
