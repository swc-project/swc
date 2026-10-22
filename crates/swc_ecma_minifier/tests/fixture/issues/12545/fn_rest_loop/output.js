!function(...lines) {
    for(let i = 0; i < 3; i++)console.log(lines.shift());
}("a", "b", "c");
