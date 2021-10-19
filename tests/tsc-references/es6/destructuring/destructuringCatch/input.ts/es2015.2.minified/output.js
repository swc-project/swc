try {
    throw [
        0,
        1
    ];
} catch ([a, b]) {
}
try {
    throw {
        a: 0,
        b: 1
    };
} catch ({ a: a1 , b: b1  }) {
}
try {
    throw [
        {
            x: [
                0
            ],
            z: 1
        }
    ];
} catch ([{ x: [y] , z  }]) {
}
try {
} catch ([a2]) {
}
