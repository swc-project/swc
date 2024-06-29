export default function t(t) {
    var e = t, n = [];
    return {
        getState: function() {
            return e;
        },
        setState: function(t) {
            e = t, n.forEach(function(t) {
                return t();
            });
        },
        subscribe: function(t) {
            return n.push(t), function() {
                n.splice(n.indexOf(t), 1);
            };
        }
    };
}
export { t as default };
