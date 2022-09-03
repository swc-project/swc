//// [for-of43.ts]
var array = [
    {
        x: "",
        y: 0
    }
];
for (var { x: a = "" , y: b = !0  } of array);
