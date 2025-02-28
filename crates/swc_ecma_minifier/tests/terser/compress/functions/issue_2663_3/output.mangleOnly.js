(function() {
    var e = [
        {
            type: 0,
            target: null,
            eventName: "ngSubmit",
            propName: null
        },
        {
            type: 0,
            target: null,
            eventName: "submit",
            propName: null
        },
        {
            type: 0,
            target: null,
            eventName: "reset",
            propName: null
        }
    ];
    function n(n) {
        var e = [];
        for(var r = 0; r < n.length; r++){
            var u = n[r];
            var a = t(u.eventName);
            e.push(a);
        }
        var l, o;
        return e;
    }
    function t(e) {
        return function() {
            return console.log(e);
        };
    }
    n(e).forEach(function(e) {
        return e();
    });
})();
