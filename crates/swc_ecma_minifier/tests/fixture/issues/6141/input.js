(function foo(obj) {
    if (obj) {
        for (const key in obj) {
            const element = obj[key];

            if (element && foo(element.children)) {
                // do something
            }
        }

        return true;
    }
    return false;
})()