(function () {
    let letters = ["A", "B", "C"];
    return [2, 1, 0].map((key) => {
        return (value = letters[key] + key), () => console.log(value);
        var value;
    });
})().map((fn) => fn());
