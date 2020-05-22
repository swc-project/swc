const swc = require("../../../");

it("should work asynchronously", async () => {
  const m = await swc.parse(`class Foo {}`);

  expect(m.type).toBe(`Module`);
  expect(m.body).toHaveLength(1);
  expect(m.body[0].type).toBe(`ClassDeclaration`);
});

it("can work synchronously", () => {
  const m = swc.parseSync(`class Foo {}`);

  expect(m.type).toBe(`Module`);
  expect(m.body).toHaveLength(1);
  expect(m.body[0].type).toBe(`ClassDeclaration`);
});

it("can be emit code back asynchronously", async () => {
  const m = await swc.parse(`class Foo {}`);
  const out = await swc.print(m);

  expect(out.code.trim().replace("\n", "")).toBe(`class Foo {}`);
});

it("can be emit code back synchronously", async () => {
  const m = await swc.parseSync(`class Foo {}`);
  const out = swc.printSync(m);

  expect(out.code.trim().replace("\n", "")).toBe(`class Foo {}`);
});
