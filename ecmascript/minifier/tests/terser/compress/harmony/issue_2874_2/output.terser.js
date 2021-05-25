(function () {
    let keys = [];
    [2, 1, 0]
        .map((value) => {
            return (
                keys.push(value),
                (letters = ["A", "B", "C"]),
                (key = keys.shift()),
                () => console.log(letters[key] + key)
            );
            var letters, key;
        })
        .map((fn) => fn());
})();
