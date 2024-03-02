function run(flag, output = "a output") {
    if (flag === "b") {
        output = "b output";
    }

    console.log(output);
}

run("a");
run("b");
