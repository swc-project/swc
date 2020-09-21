// Repro from #13285

function updateIds2<T extends { [x: string]: string }, K extends keyof T>(
    obj: T,
    key: K,
    stringMap: { [oldId: string]: string }
) {
    var x = obj[key];
    stringMap[x]; // Should be OK.
}

// Repro from #13514

declare function head<T extends Array<any>>(list: T): T[0];
