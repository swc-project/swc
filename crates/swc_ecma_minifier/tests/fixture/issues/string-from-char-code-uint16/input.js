console.log([
    String.fromCharCode(65.9),
    String.fromCharCode(-1),
    String.fromCharCode(-65535.9),
    String.fromCharCode(65536),
    String.fromCharCode(65537),
    String.fromCharCode(NaN),
    String.fromCharCode(Infinity),
    String.fromCharCode(-Infinity),
    String.fromCharCode(4294967361),
    String.fromCharCode(-4294967231),
].map((value) => value.charCodeAt(0)).join(","));
