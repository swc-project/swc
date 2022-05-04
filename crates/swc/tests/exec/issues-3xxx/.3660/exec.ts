// Adding a type to Set breaks the

const { Test } = require("mocha");

// variable on the next line
function Test1({
    var1 = new Set<number>(),
    var2 = "123", // <- this variable is renamed to `var21`
    var3 = "456",
}) {
    console.log(var1, var2, var3); // <- here `var2` is used
}

// Placing the Set on the last line works
function Test2({ var2 = "123", var3 = "456", var1 = new Set<number>() }) {
    console.log(var1, var2, var3);
}

// Removing the type from Set also works
function Test3({ var1 = new Set(), var2 = "123", var3 = "456" }) {
    console.log(var1, var2, var3);
}

Test1({});
Test1({});

Test2({});
Test2({});

Test3({});
Test3({});
