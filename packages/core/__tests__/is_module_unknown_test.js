const swc = require("../");

it("should detect script", () => {
    const script = swc.parseSync(`const fs = require('fs');`, {
        isModule: "unknown",
    });
    expect(script.type).toBe("Script");
});

it("should default to isModule: true", () => {
    const script = swc.parseSync(`foo;`, {});
    expect(script.type).toBe("Module");
});

it("should detect module", () => {
    const script = swc.parseSync(`import fs from "fs";`, {
        isModule: "unknown",
    });
    expect(script.type).toBe("Module");
});
