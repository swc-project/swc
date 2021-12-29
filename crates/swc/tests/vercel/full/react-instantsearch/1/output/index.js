export default function a(a) {
    var b = a, c = [];
    return {
        getState: function() {
            return b;
        },
        setState: function(a) {
            b = a, c.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return c.push(a), function() {
                c.splice(c.indexOf(a), 1);
            };
        }
    };
};
