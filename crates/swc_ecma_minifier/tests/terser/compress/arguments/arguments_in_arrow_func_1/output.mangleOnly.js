(function($, a) {
    console.log(arguments[0], $, arguments[1], arguments[3], a, arguments[2]);
})("bar", 42, false);
(function($, a) {
    (()=>{
        console.log(arguments[0], $, arguments[1], arguments[3], a, arguments[2]);
    })(10, 20, 30, 40);
})("bar", 42, false);
