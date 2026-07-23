console.log([
    (9007199254740991).toString(3),
    (9007199254740994).toString(3),
    (-9007199254740994).toString(3),
    (1e20).toString(36),
    (-1e20).toString(36),
    (2 ** 127).toString(16),
    (-(2 ** 127)).toString(16),
    (2 ** 128).toString(16),
    (-(2 ** 128)).toString(16),
].join(","));
