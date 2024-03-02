function run(flag, output = "a output") {
    "b" === flag && (output = "b output"), console.log(output);
}
run("a"), run("b");
