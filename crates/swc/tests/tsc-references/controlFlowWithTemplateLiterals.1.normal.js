//// [controlFlowWithTemplateLiterals.ts]
if (typeof envVar === "string") {
    envVar.slice(0);
}
if ("test" in obj) {
    obj.test.slice(0);
}
