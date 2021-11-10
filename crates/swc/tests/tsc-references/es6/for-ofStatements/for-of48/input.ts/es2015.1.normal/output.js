//@target: ES6
var x, y;
var array = [
    {
        x: "",
        y: true
    }
];
var E1;
(function(E) {
    E[E["x"] = 0] = "x";
})(E1 || (E1 = {
}));
for ({ x , y =E1.x  } of array){
    x;
    y;
}
