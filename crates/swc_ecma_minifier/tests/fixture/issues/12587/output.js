!// A string in parentheses is not a directive, so these functions stay sloppy.
function() {
    var bootstrap;
    bootstrap = {
        Collapse: {
            getInstance: (c)=>({
                    hide: ()=>console.log("hide", c)
                })
        }
    }, Array.from([
        "a",
        "b"
    ]).forEach(function(childCollapse) {
        (childCollapseInstance = bootstrap.Collapse.getInstance(childCollapse)).hide();
    });
}(), console.log(singleQuotes = 1), console.log(nested = 1), console.log(secondInPrologue = 1), console.log(function() {
    return this === globalThis;
}()), console.log(({
    method: ()=>(function() {
            return this === globalThis;
        })()
}).method()), console.log(function() {
    return this === globalThis;
}()), // A real directive stays a directive.
function() {
    "use strict";
    try {
        strictWrite = 1, console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
}(), function() {
    'use strict';
    try {
        strictWriteSingleQuotes = 1, console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
}(), function() {
    "use strict";
    try {
        strictWriteSecond = 1, console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
}();
