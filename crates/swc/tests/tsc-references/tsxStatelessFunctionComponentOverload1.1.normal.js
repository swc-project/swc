//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
    // OK
    var c1 = <OneThing yxx='ok'/>;
    var c2 = <OneThing yy={100} yy1="hello"/>;
    var c3 = <OneThing yxx="hello" ignore-prop/>;
    var c4 = <OneThing data="hello" data-prop/>;
    var c5 = <OneThing yxx1='ok'>Hello</OneThing>;
    // OK
    var d1 = <TestingOneThing y1 extra-data/>;
    var d2 = <TestingOneThing extra-data="hello"/>;
    var d3 = <TestingOneThing extra-data="hello" yy="hihi"/>;
    var d4 = <TestingOneThing extra-data="hello" yy={9} direction={10}/>;
    var d5 = <TestingOneThing extra-data="hello" yy="hello" name="Bob"/>;
    // OK
    var e1 = <TestingOptional/>;
    var e3 = <TestingOptional y1="hello"/>;
    var e4 = <TestingOptional y1="hello" y2={1000}/>;
    var e5 = <TestingOptional y1 y3/>;
    var e6 = <TestingOptional y1 y3 y2={10}/>;
    var e2 = <TestingOptional y1 y3 extra-prop/>;
});
