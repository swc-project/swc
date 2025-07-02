//// [file.tsx]
define([
    "require"
], function(require) {
    <OneThing yxx='ok'/>, <OneThing yy={100} yy1="hello"/>, <OneThing yxx="hello" ignore-prop/>, <OneThing data="hello" data-prop/>, <OneThing yxx1='ok'>Hello</OneThing>, <TestingOneThing y1 extra-data/>, <TestingOneThing extra-data="hello"/>, <TestingOneThing extra-data="hello" yy="hihi"/>, <TestingOneThing extra-data="hello" yy={9} direction={10}/>, <TestingOneThing extra-data="hello" yy="hello" name="Bob"/>, <TestingOptional/>, <TestingOptional y1="hello"/>, <TestingOptional y1="hello" y2={1000}/>, <TestingOptional y1 y3/>, <TestingOptional y1 y3 y2={10}/>, <TestingOptional y1 y3 extra-prop/>;
});
