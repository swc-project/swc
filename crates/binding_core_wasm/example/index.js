let settings = 
{
    "jsc": {
        "target": "es2016",
      "parser": {
        "syntax": "ecmascript",
        "jsx": true,
        "dynamicImport": false,
        "numericSeparator": false,
        "privateMethod": false,
        "functionBind": false,
        "exportDefaultFrom": false,
        "exportNamespaceFrom": false,
        "decorators": false,
        "decoratorsBeforeExport": false,
        "topLevelAwait": false,
        "importMeta": false
      }
    }
  };

let code = `
let a = 1;
let b = {
    c: {
        d: 1
    }

};
console.log(b?.c?.d);

let MyComponent = () => {
    return (<div a={10}>
        <p>Hello World!</p>
    </div>);
}
`;

const swc = import("./pkg/wasm.js");
swc.then(swc => {
    console.log("SWC Loaded", swc);
    let result = swc.transformSync(code, settings);
    console.log("result from transformSync", result);
    console.log(result.code);
    document.getElementById("result").innerHTML = "<xmp>" + result.code + "</xmp>";
    document.getElementById("source").innerHTML = "<xmp>" + code + "</xmp>";
});