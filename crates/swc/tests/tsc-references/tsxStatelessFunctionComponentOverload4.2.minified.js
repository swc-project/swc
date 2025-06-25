//// [file.tsx]
define([
    "require"
], function(require) {
    var obj2, obj = {
        yy: 10,
        yy1: "hello"
    };
    <OneThing extraProp/>, <OneThing yy={10}/>, <OneThing {...obj} yy1/>, <OneThing {...obj} {...{
        extra: "extra attr"
    }}/>, <OneThing {...obj} y1={10000}/>, <OneThing {...obj} {...{
        yy: !0
    }}/>, <OneThing {...obj2} {...{
        extra: "extra attr"
    }}/>, <OneThing {...obj2} yy/>, <TestingOneThing extra-data/>, <TestingOneThing yy="hello" direction="left"/>, <TestingOptional y1 y3="hello"/>, <TestingOptional y1="hello" y2={1000} y3/>, <TestingOptional y1="hello" y2={1000} children="hi"/>, <TestingOptional y1="hello" y2={1000}>Hi</TestingOptional>;
});
