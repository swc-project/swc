import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as swc from '..';

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work", () => {
  expect(() => {
    swc.transformFileSync(__dirname + "/../tests/error/simple.js");
  }).toThrow("jsc");
});

it("should report good error", () => {
  expect(() => {
    swc.transformFileSync(__dirname + "/../tests/error/simple.js");
  }).toThrow("failed to deserialize .swcrc (json) file");
});

it("should report good error (handler)", () => {
  expect(() => {
    swc.transformFileSync(__dirname + "/../tests/legacy/octal.js");
  }).toThrow("console.log(00017)");
});