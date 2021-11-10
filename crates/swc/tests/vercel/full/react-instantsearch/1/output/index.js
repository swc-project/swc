export default function a(b) {
    var c = b, d = [];
    return {
        getState: function() {
            return c;
        },
        setState: function(a) {
            c = a, d.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return d.push(a), function() {
                d.splice(d.indexOf(a), 1);
            };
        }
    };
};
