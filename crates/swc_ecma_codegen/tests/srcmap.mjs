import { minify } from "terser";

try {
    const code = process.argv[1];

    const output = await minify(code, {
        sourceMap: {
            filename: 'input.js',
            url: 'output.js.map',
            includeSources: true,
        },
        compress: false,
        mangle: false,
    });

    console.log(JSON.stringify({
        code: output.code,
        map: output.map,
    }))
} catch (e) {
    // Ignore syntax error
    if (e.toString().includes("SyntaxError")) {
        console.log(JSON.stringify({
            code: '',
            map: '{}',
        }));
    } else {
        throw e;
    }
}