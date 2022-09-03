//// [a.js]
var my = my ?? {};
my.method = function(n) {
    return n + 1;
}, my.number = 1, my.object = {}, my.predicate = my.predicate ?? {}, my.predicate.query = function() {
    var me = this;
    me.property = !1;
};
var q = new my.predicate.query();
my.predicate.query.another = function() {
    return 1;
}, my.predicate.query.result = 'none', my.predicate.sort = my.predicate.sort ?? function(first, second) {
    return first > second ? first : second;
}, my.predicate.type = class {
    m() {
        return 101;
    }
};
var min = window.min ?? {};
min.nest = this.min.nest ?? function() {}, min.nest.other = self.min.nest.other ?? class {
}, min.property = global.min.property ?? {};
