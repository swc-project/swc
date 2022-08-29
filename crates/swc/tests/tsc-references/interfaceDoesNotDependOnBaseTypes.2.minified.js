//// [interfaceDoesNotDependOnBaseTypes.ts]
var x;
"string" != typeof x && (x.push(""), x.push([
    ""
]));
