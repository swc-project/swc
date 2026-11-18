let r = "";
for (let i = 0; i < 3; i++) {
    (() => i++)();
    r += i;
}
console.log(r);
