//// [file.tsx]
define([
    "require"
], function(require) {
    var defaultObj, obj = {
        yy: 10,
        yy1: "hello"
    }, obj1 = {
        yy: !0
    };
    <OneThing/>, <OneThing {...obj}/>, <OneThing {...{}}/>, <OneThing {...obj1} {...obj}/>, <OneThing {...obj1} yy={42} {...{
        yy1: "hi"
    }}/>, <OneThing {...obj1} {...{
        yy: 10000,
        yy1: "true"
    }}/>, <OneThing {...defaultObj} yy {...obj}/>, <OneThing ignore-prop={100}/>, <OneThing {...{
        "ignore-prop": 200
    }}/>, <OneThing {...{
        yy: 500,
        "ignore-prop": "hello"
    }} yy1="boo"/>;
});
