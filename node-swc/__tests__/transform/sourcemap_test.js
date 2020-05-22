const swc = require('../../../'),
    validate = require('sourcemap-validator'),
    sourceMap = require('source-map');

it('should handle sourcemap correctly', async () => {
    const raw = `
class Foo extends Array {
}
console.log('foo')
    `;
    const out = swc.transformSync(raw, {
        filename: 'input.js',
        sourceMaps: true
    });


    expect(out.map).toBeTruthy();
    validate(out.code, out.map, {'input.js': raw});

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

})

it('should handle input sourcemap correctly', async () => {
    const raw = `class Foo extends Array {}`;
    const out1 = swc.transformSync(raw, {
        filename: 'input1.js',
        jsc: {
            externalHelpers: true,
            target: 'es2016',
        },
        module: {
            type: 'commonjs'
        },
        sourceMaps: true
    });

    expect(out1.map).toBeTruthy();
    validate(out1.code, out1.map, {'input.js': raw});
    console.log(out1.code);

    const out2 = swc.transformSync(out1.code, {
        filename: 'input2.js',
        jsc: {
            externalHelpers: true,
            target: 'es3',
        },
        module: {
            type: 'commonjs'
        },
        sourceMaps: true,
    });

    console.log(out2.code);
    expect(out2.map).toBeTruthy();
    validate(out2.code, out2.map, {'input2.js': out1.code});
    validate(out2.code, out2.map, {'input.js': raw});

    await sourceMap.SourceMapConsumer.with(JSON.parse(out1.map), null, async (consumer1) => {
        await sourceMap.SourceMapConsumer.with(JSON.parse(out2.map), null, async (consumer2) => {
            consumer1.eachMapping((mapping) => {
                // console.log(mapping);
            });

            consumer2.eachMapping((mapping) => {
                // console.log(mapping);
            });
        });
    });

})