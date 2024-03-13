d(() => {
    var obj = {
        key: "some string",
    };

    var b = () => {
        switch (a) {
            default:
                break;
        }
        return obj.key;
    };
    return () => b;
});