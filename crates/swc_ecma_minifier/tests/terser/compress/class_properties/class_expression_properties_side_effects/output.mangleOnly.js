global.side = ()=>{
    console.log("PASS");
};
(class {
    static foo = side();
    [side()]() {}
    [side()] = 4;
});
