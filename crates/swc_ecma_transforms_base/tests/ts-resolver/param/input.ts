function Test1({
    var1 = new Set<number>(),
    var2 = "123", // <- this variable is renamed to `var21`
    var3 = "456",
}) {
    console.log(var1, var2, var3); // <- here `var2` is used
}
