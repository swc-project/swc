//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    var obj2;
    // OK
    var two1 = <ZeroThingOrTwoThing/>;
    var two2 = <ZeroThingOrTwoThing yy={100} yy1="hello"/>;
    var two3 = <ZeroThingOrTwoThing {...obj2}/>; // it is just any so we allow it to pass through
    var two4 = <ZeroThingOrTwoThing yy={1000} {...obj2}/>; // it is just any so we allow it to pass through
    var two5 = <ZeroThingOrTwoThing {...obj2} yy={1000}/>; // it is just any so we allow it to pass through
    // OK
    var three1 = <ThreeThing yy={99} yy1="hello world"/>;
    var three2 = <ThreeThing y2="Bye"/>;
    var three3 = <ThreeThing {...obj2} y2={10}/>; // it is just any so we allow it to pass through
});
