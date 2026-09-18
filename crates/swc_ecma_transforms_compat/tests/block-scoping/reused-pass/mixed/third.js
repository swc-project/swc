var value = 3;
{
    let value = 4;
    console.log(() => value);
}
for (let x = 0; x < 2; x++) {
    let local = x;
    for (let i = 0, read = () => i;;) break;
    console.log(eval("() => local"));
}
