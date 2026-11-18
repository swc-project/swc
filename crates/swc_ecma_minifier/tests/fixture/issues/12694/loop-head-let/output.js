var arr = [
    1,
    2
];
for(let i = 0; i < arr.length; i++)!function() {
    for(let j = 0; j < arr[i]; j++)console.log(i, j);
}();
