export default function t(t) {
    var n = t, e = [];
    return {
        getState: function() {
            return n;
        },
        setState: function(t) {
            n = t, e.forEach(function(t) {
                return t();
            });
        },
        subscribe: function(t) {
            return e.push(t), function() {
                e.splice(e.indexOf(t), 1);
            };
        }
    };
};
