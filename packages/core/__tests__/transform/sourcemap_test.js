const swc = require("../../"),
    validate = require("sourcemap-validator"),
    sourceMap = require("source-map");
const path = require("path");

const muiDefaultPropsProvider = `import PropTypes from "prop-types";

const DefaultPropsProvider = {};

DefaultPropsProvider.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run \`pnpm proptypes\`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node,
};

export { DefaultPropsProvider };
`;

it("should handle sourcemap correctly", async () => {
    const raw = `
class Foo extends Array {
}
console.log('foo')
    `;
    const out = swc.transformSync(raw, {
        filename: "input.js",
        sourceMaps: true,
    });

    expect(out.map).toBeTruthy();
    validate(out.code, out.map, { "input.js": raw });

    // await sourceMap.SourceMapConsumer.with(JSON.parse(out.map), null, async (consumer) => {
    //     consumer.eachMapping((mapping) => {
    //         console.log(mapping);
    //     });
    // });

    // // Dump output and sourcemap to file
    // // https://sokra.github.io/source-map-visualization/#custom

    // const fs = require('fs');
    // fs.writeFileSync('./test.js', out.code);
    // fs.writeFileSync('./test.map', out.map);
});

it("should handle sourcemap correctly when parse module", async () => {
    const raw = `
class Foo extends Array {
}
console.log('foo')
    `;
    const out1 = swc.transformSync(raw, {
        filename: "input.js",
        sourceMaps: true,
        plugin: swc.plugins([(m) => m]),
    });

    expect(out1.map).toBeTruthy();
    expect(JSON.parse(out1.map).sources).toEqual(["input.js"]);
    validate(out1.code, out1.map, { "input.js": raw });

    const out2 = swc.transformSync(raw, {
        sourceMaps: true,
        inlineSourcesContent: true,
        plugin: swc.plugins([(m) => m]),
    });

    expect(out2.map).toBeTruthy();
    expect(JSON.parse(out2.map).sources).toEqual(["<anon>"]);
    validate(out2.code, out2.map, { "input.js": raw });
});

it("should keep source context for plugin sourcemaps with multibyte comments", () => {
    const filename = "DefaultPropsProvider.mjs";
    const out = swc.transformSync(muiDefaultPropsProvider, {
        filename,
        sourceMaps: true,
        plugin: (m) => ({ ...m }),
    });

    expect(out.map).toBeTruthy();
    expect(JSON.parse(out.map).sources).toEqual([filename]);
    validate(out.code, out.map, { [filename]: muiDefaultPropsProvider });
});

it("should keep source context for print(parse()) sourcemaps", () => {
    const filename = "DefaultPropsProvider.mjs";
    const program = swc.parseSync(
        muiDefaultPropsProvider,
        { syntax: "ecmascript" },
        filename
    );
    const out = swc.printSync(program, {
        filename,
        sourceMaps: true,
    });

    expect(out.map).toBeTruthy();
    expect(JSON.parse(out.map).sources).toEqual([filename]);
    expect(JSON.stringify(program)).not.toContain("sourceContext");
    validate(out.code, out.map, { [filename]: muiDefaultPropsProvider });
});

it("should isolate async plugin source contexts", async () => {
    const inputs = [
        muiDefaultPropsProvider,
        `const emoji = "🙂";\nexport { emoji };\n`,
    ];

    const outputs = await Promise.all(
        Array.from({ length: 24 }, (_, index) => {
            const filename = `input-${index}.mjs`;

            return swc.transform(inputs[index % inputs.length], {
                filename,
                sourceMaps: true,
                plugin: (m) => ({ ...m }),
            });
        })
    );

    outputs.forEach((out, index) => {
        const filename = `input-${index}.mjs`;

        expect(out.map).toBeTruthy();
        expect(JSON.parse(out.map).sources).toEqual([filename]);
        validate(out.code, out.map, {
            [filename]: inputs[index % inputs.length],
        });
    });
});

it("should handle input sourcemap correctly", async () => {
    const raw = `class Foo extends Array {}`;
    const out1 = swc.transformSync(raw, {
        filename: "input1.js",
        jsc: {
            externalHelpers: true,
            target: "es2016",
        },
        module: {
            type: "commonjs",
        },
        sourceMaps: true,
        inlineSourcesContent: true,
    });

    expect(out1.map).toBeTruthy();
    validate(out1.code, out1.map, { "input.js": raw });
    console.log(out1.code);

    const out2 = swc.transformSync(out1.code, {
        filename: "input2.js",
        jsc: {
            externalHelpers: true,
            target: "es3",
        },
        module: {
            type: "commonjs",
        },
        sourceMaps: true,
        inlineSourcesContent: true,
    });

    console.log(out2.code);
    expect(out2.map).toBeTruthy();
    validate(out2.code, out2.map, { "input2.js": out1.code });
    validate(out2.code, out2.map, { "input.js": raw });

    // await sourceMap.SourceMapConsumer.with(JSON.parse(out1.map), null, async (consumer1) => {
    //     await sourceMap.SourceMapConsumer.with(JSON.parse(out2.map), null, async (consumer2) => {
    //         consumer1.eachMapping((mapping) => {
    //             // console.log(mapping);
    //         });

    //         consumer2.eachMapping((mapping) => {
    //             // console.log(mapping);
    //         });
    //     });
    // });
});

describe("sourceMaps: true in .swcrc", () => {
    it(`should be respected`, async () => {
        const out = await swc.transformFile(
            path.join(__dirname, "..", "..", "tests", "issue-2120", "input.js")
        );

        expect(out.map).toBeTruthy();
    });

    it(`should be ignored if 'sourceMaps: false' is passed`, async () => {
        const out = await swc.transformFile(
            path.join(__dirname, "..", "..", "tests", "issue-2120", "input.js"),
            { sourceMaps: false }
        );

        expect(out.map).toBeUndefined();
    });

    it(`should have names `, async () => {
        const out = await swc.transformFile(
            path.join(__dirname, "..", "..", "tests", "issue-2120", "input.js")
        );

        expect(out.map).toBeTruthy();
        expect(JSON.parse(out.map).names).toEqual(["Foo", "Array", "console", "log"]);
    });
});
