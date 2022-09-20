//// [interfaceDoesNotDependOnBaseTypes.ts]
var x;
if ("string" != typeof x) {
    x.push("");
    x.push([
        ""
    ]);
}
