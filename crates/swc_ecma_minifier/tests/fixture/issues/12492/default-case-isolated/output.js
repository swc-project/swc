function startAsync(options) {
    setTimeout(options.onDone, 0);
    return 3;
}
function handleClick(type) {
    if ("sync" === type) console.info("sync");
    else {
        const asyncId = startAsync({
            onDone: ()=>{
                console.info(asyncId);
            }
        });
    }
    console.info("after");
}
handleClick("async");
handleClick("sync");
