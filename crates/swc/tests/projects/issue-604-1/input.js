let functions = [];
for (let i = 0; i < 10; i++) {
    functions.push(function() {
        console.log(i);
    });
}
functions[0]();
functions[7]();