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
        }, 
    ];
    function n(e) {
        var n = [];
        for(var r = 0; r < e.length; r++){
            var a = e[r];
            var u = t(a.eventName);
            n.push(u);
        }
        var l, o;
        return n;
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
