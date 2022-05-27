const a = {
    fn: function() {
        return this;
    }
};
let b = {
    fn: function() {
        return this;
    }
};
var c = {
    fn: function() {
        return this;
    }
};
console.log(a.fn(), b.fn(), c.fn());
