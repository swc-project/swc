let swc = import("../pkg/es_ast_viewer_node");

describe("parse", () => {
    beforeAll(async () => {
        swc = await swc;
        await swc.default();
    });

    it("should return AST and tokens", () => {
        const result = swc.parse("const foo = 1;");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        // First element should be the AST
        expect(result[0]).toMatch(/Module|Script/);
        expect(result[0]).toContain("Stmt");
        // Second element should be the tokens
        expect(result[1]).toContain("TokenAndSpan");
    });

    it("should parse TypeScript code with type annotations", () => {
        const result = swc.parse("const foo: number = 1;", "test.ts");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        // AST should contain TypeScript nodes
        expect(result[0]).toMatch(/Module|Script/);
        expect(result[0]).toContain("TsTypeAnn");
        // Should have tokens
        expect(result[1]).toContain("TokenAndSpan");
    });

    it("should parse JSX code", () => {
        const result = swc.parse("<div>Hello</div>", "test.jsx");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        // AST should contain JSX nodes
        expect(result[0]).toContain("JSXElement");
        expect(result[0]).toContain("JSXOpeningElement");
        expect(result[0]).toContain("JSXClosingElement");
        // Should have tokens
        expect(result[1]).toBeDefined();
    });

    it("should parse TSX code", () => {
        const result = swc.parse("<div>{foo as string}</div>", "test.tsx");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("JSXElement");
        expect(result[0]).toContain("TsAsExpr");
        expect(result[1]).toBeDefined();
    });

    it("should detect module type from .mjs extension", () => {
        const result = swc.parse("export const foo = 1;", "test.mjs");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("Module");
        expect(result[0]).toContain("ExportDecl");
    });

    it("should detect script mode from .cjs extension", () => {
        const result = swc.parse("const foo = 1;", "test.cjs");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toMatch(/Module|Script/);
    });

    it("should parse arrow functions", () => {
        const result = swc.parse("const fn = () => 42;");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("ArrowExpr");
        // Check for arrow token
        expect(result[1]).toContain("=>");
    });

    it("should parse async/await", () => {
        const result = swc.parse("async function foo() { await bar(); }");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("AwaitExpr");
        expect(result[0]).toContain("FnDecl");
        // Tokens should be present
        expect(result[1]).toContain("TokenAndSpan");
    });

    it("should parse class declarations", () => {
        const result = swc.parse("class Foo { constructor() {} }");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("ClassDecl");
        expect(result[0]).toContain("Constructor");
        // Check for class keyword in tokens
        expect(result[1]).toContain("class");
    });

    it("should parse template literals", () => {
        const result = swc.parse("`Hello ${name}!`");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("Tpl");
        // Check for template tokens
        expect(result[1]).toContain("`");
    });

    it("should handle syntax errors gracefully", () => {
        expect(() => {
            swc.parse("const foo = {");
        }).toThrow();
    });

    it("should parse TypeScript interfaces", () => {
        const result = swc.parse("interface Foo { bar: string; }", "test.ts");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("TsInterfaceDecl");
        expect(result[0]).toContain("TsPropertySignature");
    });

    it("should parse TypeScript enums", () => {
        const result = swc.parse("enum Color { Red, Green, Blue }", "test.ts");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("TsEnumDecl");
        expect(result[0]).toContain("TsEnumMember");
    });

    it("should parse TypeScript type aliases", () => {
        const result = swc.parse("type Foo = string | number;", "test.ts");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("TsTypeAliasDecl");
        expect(result[0]).toContain("TsUnionType");
    });

    it("should parse import statements", () => {
        const result = swc.parse("import { foo } from './bar';");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("ImportDecl");
        expect(result[0]).toContain("ImportNamedSpecifier");
    });

    it("should parse export statements", () => {
        const result = swc.parse("export const foo = 1;");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("ExportDecl");
        expect(result[0]).toContain("VarDecl");
    });

    it("should parse object destructuring", () => {
        const result = swc.parse("const { foo, bar } = obj;");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("ObjectPat");
        expect(result[0]).toContain("Pat");
    });

    it("should parse array destructuring", () => {
        const result = swc.parse("const [a, b] = arr;");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("ArrayPat");
    });

    it("should parse spread operators", () => {
        const result = swc.parse("const foo = { ...bar };");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("SpreadElement");
        // Check for spread token
        expect(result[1]).toContain("...");
    });

    it("should parse optional chaining", () => {
        const result = swc.parse("foo?.bar?.baz");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("OptChainExpr");
        expect(result[0]).toContain("MemberExpr");
    });

    it("should parse nullish coalescing", () => {
        const result = swc.parse("foo ?? bar");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("BinExpr");
        expect(result[0]).toContain('op: "??"');
        // Check for nullish coalescing token
        expect(result[1]).toContain("??");
    });

    it("should parse BigInt literals", () => {
        const result = swc.parse("const big = 123n;");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("BigInt");
        // Check for BigInt token
        expect(result[1]).toContain("<bigint literal>");
    });

    it("should parse private class fields", () => {
        const result = swc.parse("class Foo { #private = 1; }");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("PrivateProp");
        expect(result[0]).toContain("PrivateName");
    });

    it("should parse dynamic imports", () => {
        const result = swc.parse("import('./module').then(m => m.default)");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("CallExpr");
        expect(result[0]).toContain("Import");
        expect(result[0]).toContain("ArrowExpr");
    });

    it("should detect .d.ts files", () => {
        const result = swc.parse("declare module 'foo' {}", "test.d.ts");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0]).toContain("TsModuleDecl");
        expect(result[0]).toContain("TsModuleBlock");
    });
});

describe("AST and Tokens structure", () => {
    it("should return formatted debug output for AST", () => {
        const result = swc.parse("const x = 1;");
        const ast = result[0];

        // AST should be a formatted debug string
        expect(typeof ast).toBe("string");
        expect(ast).toContain("body:");
        expect(ast).toContain("VarDecl");
        expect(ast).toContain("VarDeclarator");
    });

    it("should return formatted debug output for tokens", () => {
        const result = swc.parse("const x = 1;");
        const tokens = result[1];

        // Tokens should be a formatted debug array string
        expect(typeof tokens).toBe("string");
        expect(tokens).toContain("[");
        expect(tokens).toContain("]");
    });

    it("should include span information in AST", () => {
        const result = swc.parse("const x = 1;");
        const ast = result[0];

        // Should contain span information in format like "span: 1..13"
        expect(ast).toMatch(/span: \d+\.\.\d+/);
    });

    it("should parse and return both AST and tokens for complex code", () => {
        const code = `
            class Component extends React.Component {
                render() {
                    return <div>Hello</div>;
                }
            }
        `;
        const result = swc.parse(code, "component.jsx");

        expect(result).toHaveLength(2);

        // Check AST
        const ast = result[0];
        expect(ast).toContain("ClassDecl");
        expect(ast).toContain("ClassMethod");
        expect(ast).toContain("JSXElement");

        // Check tokens
        const tokens = result[1];
        expect(tokens).toBeDefined();
        expect(typeof tokens).toBe("string");
    });

    it("should handle multiline code correctly", () => {
        const code = `
            function add(a, b) {
                return a + b;
            }

            const result = add(1, 2);
        `;
        const result = swc.parse(code);

        expect(result).toHaveLength(2);
        expect(result[0]).toContain("FnDecl");
        expect(result[0]).toContain("VarDecl");
        expect(result[0]).toContain("CallExpr");
    });
});

describe("File type detection", () => {
    it("should detect TypeScript from .ts extension", () => {
        const result = swc.parse("const x = 1", "file.ts");
        expect(result[0]).toMatch(/Module|Script/);
    });

    it("should detect TypeScript from .mts extension", () => {
        const result = swc.parse("export const x = 1", "file.mts");
        expect(result[0]).toContain("Module");
    });

    it("should detect TypeScript from .cts extension", () => {
        const result = swc.parse("const x = 1", "file.cts");
        expect(result[0]).toContain("Script");
    });

    it("should detect declaration files from .d.ts extension", () => {
        const result = swc.parse("declare const x: number", "file.d.ts");
        expect(result[0]).toContain("VarDecl");
        expect(result[0]).toContain("declare: true");
    });
});

describe("version", () => {
    it("should return a version string", () => {
        const version = swc.version();
        expect(version).toBeDefined();
        expect(typeof version).toBe("string");
        expect(version).toMatch(/^\d+\.\d+\.\d+/);
    });
});
