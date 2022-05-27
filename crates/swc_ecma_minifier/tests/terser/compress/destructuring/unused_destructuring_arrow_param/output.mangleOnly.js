let a = ({ w: b = console.log("side effect") , x: a , y: c  })=>{
    console.log(a);
};
a({
    x: 4,
    y: 5,
    z: 6
});
