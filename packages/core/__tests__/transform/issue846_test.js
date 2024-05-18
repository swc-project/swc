const swc = require("../../");

it("should handle es2019", () => {
    expect(
        swc
            .transformSync(
                `class SomeClass {
  someMethod() {}
}

class OtherClass extends SomeClass {
  anotherMethod() {
    super.someMethod()
  }
}`,
                {
                    jsc: {
                        parser: {
                            syntax: "ecmascript",
                        },
                        target: "es2019",
                    },
                }
            )
            .code.trim()
    ).toContain(`class `);
});
