console.log([
    "correct",
    {
        "-Infinity": "correct",
        "-inf": "wrong"
    }[-1 / 0],
    "correct",
    "correct",
    "correct",
    "correct",
    "correct",
    "correct",
    "correct",
    "correct",
    "correct",
    "correct",
    void 0,
    "c",
    void 0
].map(String).join(","));
