var Inner = function() {
};
Inner.prototype = {
    m: function() {
    },
    i: 1
}, Inner.prototype.j = 2, Inner.prototype.k;
var inner = new Inner();
inner.m(), inner.i, inner.j, inner.k;
