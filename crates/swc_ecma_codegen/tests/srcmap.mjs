import { minify } from "terser";

try {
    const code = process.argv[1];

    const output = await minify(code, { sourceMap: true, });

    console.log(JSON.stringify({
        code: output.code,
        map: output.map,
    }))
} catch (e) {
    // Ignore syntax error
    if (e instanceof SyntaxError) {
        console.log(JSON.stringify({
            code: '',
            map: {},
        }));
    } else {
        throw e;
    }
}