const swc = require("../../");

it("should work", () => {
  expect(() => {
    swc.transformFileSync(__dirname + "/../tests/error/simple.js");
  }).toThrow("jsc");
});


it("should work", () => {
  expect(() => {
    const filename = 'index.ts';

    const code = `
export async function getDependency(): Promise<any> {
  return import('./dep').then(({dependency}) => dependency);
}
`

    const options = {
      jsc: {
        parser: {
          syntax: 'typescript',
          dynamicImport: true
        },
        externalHelpers: true,
        target: 'esnext'
      },
      sourceMaps: true,
      filename
    }

    swc.transformSync(code, options)
  }).toThrow("unknown variant `esnext`");
});
