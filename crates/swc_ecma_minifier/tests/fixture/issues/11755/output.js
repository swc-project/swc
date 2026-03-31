function f() {
    100 === ({
        "item-1-0": 100
    })[(({ id, configIndex })=>`${id}-${configIndex}`)({
        id: "item-1",
        configIndex: 0
    })] ? console.log("Test PASSED!") : console.log("Test FAILED!");
}
f(), f();
