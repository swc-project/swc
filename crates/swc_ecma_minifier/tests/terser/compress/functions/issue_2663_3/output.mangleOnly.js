(function() {
    var a = [
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
    function b(a) {
        var b = [];
        for(var d = 0; d < a.length; d++){
            var e = a[d];
            var f = c(e.eventName);
            b.push(f);
        }
        var g, h;
        return b;
    }
    function c(a) {
        return function() {
            return console.log(a);
        };
    }
    b(a).forEach(function(a) {
        return a();
    });
})();
