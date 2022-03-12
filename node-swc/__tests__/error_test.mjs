import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as swc from '../..';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

it("should report good error", () => {
  expect(() => {
    swc.transformFileSync(__dirname + "/../tests/error/simple.js");
  }).toThrow("failed to process input file");
});

it("should report good error (handler)", () => {
  expect(() => {
    swc.transformFileSync(__dirname + "/../tests/legacy/octal.js");
  }).toThrow("console.log(00017)");
});