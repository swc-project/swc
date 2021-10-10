export default function createStore(a) {
    var b = a, c = [];
    return {
        getState: function() {
            return b;
        },
        setState: function(d) {
            b = d, c.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(f) {
            return c.push(f), function() {
                c.splice(c.indexOf(f), 1);
            };
        }
    };
};
