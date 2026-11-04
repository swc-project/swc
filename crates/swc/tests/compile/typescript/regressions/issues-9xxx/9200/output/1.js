let count = 0;
for(var a = 1 || (2 in {}) in {
    x: 1
})count++;
console.log(count);
