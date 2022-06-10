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
    function b(b) {
        var d = [];
        for(var a = 0; a < b.length; a++){
            var e = b[a];
            var f = c(e.eventName);
            d.push(f);
        }
        var g, h;
        return d;
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
