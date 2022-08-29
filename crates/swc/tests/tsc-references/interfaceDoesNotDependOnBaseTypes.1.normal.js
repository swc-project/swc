//// [interfaceDoesNotDependOnBaseTypes.ts]
var x;
if (typeof x !== "string") {
    x.push("");
    x.push([
        ""
    ]);
}
