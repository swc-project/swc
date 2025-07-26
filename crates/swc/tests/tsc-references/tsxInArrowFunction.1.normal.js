//// [tsxInArrowFunction.tsx]
// didn't work
<div>{function() {
    return <div text="wat"/>;
}}</div>;
// didn't work
<div>{function(x) {
    return <div text="wat"/>;
}}</div>;
// worked
<div>{function() {
    return <div text="wat"/>;
}}</div>;
// worked (!)
<div>{function() {
    return <div text="wat"></div>;
}}</div>;
