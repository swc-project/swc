function startAsync(options) {
    setTimeout(options.onDone, 0);
    return 3;
}

function handleClick(type) {
    switch (type) {
        case "async": {
            const asyncId = startAsync({
                onDone: () => {
                    console.info(asyncId);
                },
            });
            break;
        }
    }
    console.info("after");
}

handleClick("async");
