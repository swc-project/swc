function startAsync(options) {
    setTimeout(options.onDone, 0);
    return 3;
}

function handleClick(type) {
    switch (type) {
        case "sync":
            console.info("sync");
            break;
        case "async":
        default: {
            const asyncId = startAsync({
                onDone: () => {
                    console.info(asyncId);
                },
            });
        }
    }
    console.info("after");
}

handleClick("async");
handleClick("sync");
