var obj = {
    value: 7
};
(function(c) {
    c++, c = 0, console.log(this.value, this.value + c);
}).call(obj, 1);
