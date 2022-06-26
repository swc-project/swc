let a = ({ w: a = console.log("side effect") , x: b , y: c  })=>{
    console.log(b);
};
a({
    x: 4,
    y: 5,
    z: 6
});
