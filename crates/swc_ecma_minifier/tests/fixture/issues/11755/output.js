function f() {
    100 === ((id)=>(data)=>data[(({ id, configIndex })=>`${id}-${configIndex}`)({
                id,
                configIndex: 0
            })])("item-1")({
        "item-1-0": 100
    }) ? console.log("Test PASSED!") : console.log("Test FAILED!");
}
f(), f();
