function startAsync(options) {
    setTimeout(options.onDone, 0);
    return 3;
}

function handleClick(type) {
    switch (type) {
        case "async": {
            let asyncId = startAsync({
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
