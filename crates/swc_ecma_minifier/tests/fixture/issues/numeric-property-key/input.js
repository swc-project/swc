console.log([
    ({
        Infinity: "correct",
        inf: "wrong",
    })[Infinity],
    ({
        "-Infinity": "correct",
        "-inf": "wrong",
    })[-Infinity],
    ({
        0: "correct",
        "-0": "wrong",
    })[-0],
    ({
        1e21: "correct",
    })["1e+21"],
    ({
        Infinity: "wrong",
        inf: "correct",
    })["inf"],
    ({
        "-Infinity": "wrong",
        "-inf": "correct",
    })["-inf"],
    ({
        0: "wrong",
        "-0": "correct",
    })["-0"],
    ({
        1: "wrong",
        "01": "correct",
    })["01"],
    ({
        1: "wrong",
        "+1": "correct",
    })["+1"],
    ({
        1: "wrong",
        "1.0": "correct",
    })["1.0"],
    ({
        1e21: "wrong",
        "1000000000000000000000": "correct",
    })["1000000000000000000000"],
    ["correct"]["0"],
    ["zero", "wrong"]["01"],
    "correct"["0"],
    "wrong"["01"],
].map(String).join(","));
