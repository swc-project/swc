//! Tests copied from deno

fn transform_dts_test(source: &str, expected: &str) {
    let specifier = Url::parse("file:///mod.ts").unwrap();

    let loader = MemoryLoader::new(
        vec![(
            specifier.to_string(),
            Source::Module {
                specifier: specifier.to_string(),
                maybe_headers: None,
                content: source.to_string(),
            },
        )],
        vec![],
    );
    let analyzer = CapturingModuleAnalyzer::default();
    let mut graph = ModuleGraph::new(GraphKind::All);
    graph.build(
        vec![specifier.clone()],
        &loader,
        BuildOptions {
            module_analyzer: &analyzer,
            ..Default::default()
        },
    );

    let root_sym = RootSymbol::new(&graph, &analyzer);

    let module_info = root_sym
        .module_from_specifier(&specifier)
        .unwrap()
        .esm()
        .unwrap();

    let parsed_source = module_info.source();
    let module = parsed_source.module().to_owned();

    let mut transformer = FastCheckDtsTransformer::new(parsed_source.text_info_lazy(), &specifier);
    let module = transformer.transform(module).unwrap();

    let comments = parsed_source.comments().as_single_threaded();

    let source_map = SourceMap::single(specifier, parsed_source.text().to_string());

    let EmittedSourceText { text: actual, .. } = emit(
        &deno_ast::swc::ast::Program::Module(module),
        &comments,
        &source_map,
        &EmitOptions {
            remove_comments: false,
            source_map: deno_ast::SourceMapOption::None,
            source_map_file: None,
            inline_sources: false,
        },
    )
    .unwrap()
    .into_string()
    .unwrap();

    assert_eq!(actual.trim(), expected.trim());
}

#[test]
fn dts_function_test() {
    transform_dts_test(
        r#"export function foo(a: number): number {
  return {};
}"#,
        "export declare function foo(a: number): number;",
    );
    transform_dts_test(
        r#"export function foo(a: string): number;
export function foo(a: any): number {
  return {};
}"#,
        r#"export declare function foo(a: string): number;"#,
    );
    transform_dts_test(
        r#"export function foo(a = 2): number {
  return 2;
}"#,
        r#"export declare function foo(a?: number): number;"#,
    );
    transform_dts_test(
        r#"export function foo(a: string = 2): number {
  return 2;
}"#,
        r#"export declare function foo(a?: string): number;"#,
    );
    transform_dts_test(
        r#"export function foo([a, b] = [1, 2]): number {
  return 2;
}"#,
        r#"export declare function foo([a, b]?: [number, number]): number;"#,
    );
    transform_dts_test(
        r#"export function foo({a, b} = { a: 1, b: 2 }): number {
  return 2;
}"#,
        r#"export declare function foo({ a, b }?: {
  a: number;
  b: number;
}): number;"#,
    );
}

#[test]
fn dts_class_decl_test() {
    transform_dts_test(
        r#"export class Foo {
  a: number = 2;
  static b: number = 1;
  #b: number = 3;
  constructor(value: string) {
    return 42;
  }
  foo(): string {
    return "abc";
  }
  #bar(): number {
    return 2
  }
  get asdf(): number {

  }
  set asdf(value: number) {

  }

  static {

  }
}"#,
        r#"export declare class Foo {
  a: number;
  static b: number;
  constructor(value: string);
  foo(): string;
  get asdf(): number;
  set asdf(value: number);
}"#,
    );
}

#[test]
fn dts_class_decl_rest_test() {
    transform_dts_test(
        r#"export class Foo {
  constructor(...args: string[]) {}
}"#,
        r#"export declare class Foo {
  constructor(...args: string[]);
}"#,
    );
}

#[test]
fn dts_class_decl_overloads_test() {
    transform_dts_test(
        r#"export class Foo {
  constructor(arg: string);
  constructor(arg: number);
  constructor(arg: any) {}
}"#,
        r#"export declare class Foo {
  constructor(arg: string);
  constructor(arg: number);
}"#,
    );

    transform_dts_test(
        r#"export class Foo {
  foo(arg: string);
  foo(arg: number);
  foo(arg: any) {}
}"#,
        r#"export declare class Foo {
  foo(arg: string);
  foo(arg: number);
}"#,
    );

    transform_dts_test(
        r#"export class Foo {
  constructor(arg: string);
  constructor(arg: number);
  constructor(arg: any) {}

  bar(arg: number): number {
    return 2
  }

  foo(arg: string);
  foo(arg: number);
  foo(arg: any) {}
}"#,
        r#"export declare class Foo {
  constructor(arg: string);
  constructor(arg: number);
  bar(arg: number): number;
  foo(arg: string);
  foo(arg: number);
}"#,
    );
}

#[test]
fn dts_class_decl_prop_test() {
    transform_dts_test(
        r#"export class Foo { private a!: string }"#,
        r#"export declare class Foo {
  private a: string;
}"#,
    );

    transform_dts_test(
        r#"export class Foo { declare a: string }"#,
        r#"export declare class Foo {
  a: string;
}"#,
    );
}

#[test]
fn dts_class_decl_prop_infer_test() {
    transform_dts_test(
        r#"export class Foo { foo = (a: string): string => ({} as any) }"#,
        r#"export declare class Foo {
  foo: (a: string) => string;
}"#,
    );
    transform_dts_test(
        r#"export class Foo { foo = function(a: string): void {} }"#,
        r#"export declare class Foo {
  foo: (a: string) => void;
}"#,
    );
}

#[test]
fn dts_var_decl_test() {
    transform_dts_test(
        r#"export const foo: number = 42;"#,
        "export declare const foo: number;",
    );

    transform_dts_test(
        r#"export var foo: number = 42;"#,
        "export declare var foo: number;",
    );

    transform_dts_test(
        r#"export let foo: number = 42;"#,
        "export declare let foo: number;",
    );

    // Default to any if it cannot be determined
    transform_dts_test(
        r#"export const foo = adsf.b;"#,
        "export declare const foo: any;",
    );
    transform_dts_test(r#"export let foo;"#, "export declare let foo: any;");
}

#[test]
fn dts_global_declare() {
    transform_dts_test(
        r#"declare global {
  interface String {
    fancyFormat(opts: StringFormatOptions): string;
  }
}"#,
        r#"declare global {
  interface String {
    fancyFormat(opts: StringFormatOptions): string;
  }
}"#,
    );
}

#[test]
fn dts_inference() {
    transform_dts_test(
        r#"export const foo = null as string as number;"#,
        "export declare const foo: number;",
    );
}

#[test]
fn dts_as_const() {
    transform_dts_test(
        r#"export const foo = [1, 2] as const;"#,
        "export declare const foo: readonly [1, 2];",
    );
    transform_dts_test(
        r#"export const foo = [1, ,2] as const;"#,
        "export declare const foo: readonly [1, any, 2];",
    );

    transform_dts_test(
        r#"export const foo = { str: "bar", bool: true, bool2: false, num: 42,   nullish: null } as const;"#,
        r#"export declare const foo: {
  readonly str: "bar";
  readonly bool: true;
  readonly bool2: false;
  readonly num: 42;
  readonly nullish: null;
};"#,
    );

    transform_dts_test(
        r#"export const foo = { str: [1, 2] as const } as const;"#,
        r#"export declare const foo: {
  readonly str: readonly [1, 2];
};"#,
    );

    // TODO: Requires type resolving
    transform_dts_test(
        r#"export const foo = { bar } as const;"#,
        r#"export declare const foo: {
};"#,
    );
}

#[test]
fn dts_literal_inference_ann() {
    transform_dts_test(
        r#"export const foo: number = "abc";"#,
        "export declare const foo: number;",
    );
    transform_dts_test(
        r#"export let foo: number = "abc";"#,
        "export declare let foo: number;",
    );
    transform_dts_test(
        r#"export var foo: number = "abc";"#,
        "export declare var foo: number;",
    );
}

#[test]
fn dts_literal_inference() {
    transform_dts_test(
        r#"export const foo = 42;"#,
        "export declare const foo: number;",
    );
    transform_dts_test(
        r#"export const foo = "foo";"#,
        "export declare const foo: string;",
    );
    transform_dts_test(
        r#"export const foo = true;"#,
        "export declare const foo: boolean;",
    );
    transform_dts_test(
        r#"export const foo = false;"#,
        "export declare const foo: boolean;",
    );
    transform_dts_test(
        r#"export const foo = null;"#,
        "export declare const foo: null;",
    );
    transform_dts_test(
        r#"export let foo = undefined;"#,
        "export declare let foo: any;",
    );
    transform_dts_test(
        r#"export let foo = 10n;"#,
        "export declare let foo: bigint;",
    );
    transform_dts_test(
        r#"export let foo = /foo/;"#,
        "export declare let foo: RegExp;",
    );
}

#[test]
fn dts_fn_expr() {
    transform_dts_test(
        r#"export let foo = function add(a: number, b: number): number {
  return a + b;
}"#,
        "export declare let foo: (a: number, b: number) => number;",
    );
    transform_dts_test(
        r#"export let foo = function add<T>([a, b]: T): void {}"#,
        "export declare let foo: <T>([a, b]: T) => void;",
    );
    transform_dts_test(
        r#"export let foo = function add<T>({a, b}: T): void {}"#,
        "export declare let foo: <T>({ a, b }: T) => void;",
    );
    transform_dts_test(
        r#"export let foo = function add(a = 2): void {}"#,
        "export declare let foo: (a: number) => void;",
    );
    transform_dts_test(
        r#"export let foo = function add(...params: any[]): void {}"#,
        "export declare let foo: (...params: any[]) => void;",
    );
}

#[test]
fn dts_fn_arrow_expr() {
    transform_dts_test(
        r#"export let foo = (a: number, b: number): number => {
  return a + b;
}"#,
        "export declare let foo: (a: number, b: number) => number;",
    );
    transform_dts_test(
        r#"export let foo = <T>([a, b]: T): void => {}"#,
        "export declare let foo: <T>([a, b]: T) => void;",
    );
    transform_dts_test(
        r#"export let foo = <T>({a, b}: T): void => {}"#,
        "export declare let foo: <T>({ a, b }: T) => void;",
    );
    transform_dts_test(
        r#"export let foo = (a = 2): void => {}"#,
        "export declare let foo: (a: number) => void;",
    );

    transform_dts_test(
        r#"export let foo = (...params: any[]): void => {}"#,
        "export declare let foo: (...params: any[]) => void;",
    );
}

#[test]
fn dts_type_export() {
    transform_dts_test(r#"interface Foo {}"#, "interface Foo {\n}");
    transform_dts_test(r#"type Foo = number;"#, "type Foo = number;");

    transform_dts_test(r#"export interface Foo {}"#, "export interface Foo {\n}");
    transform_dts_test(r#"export type Foo = number;"#, "export type Foo = number;");
}

#[test]
fn dts_enum_export() {
    transform_dts_test(
        r#"export enum Foo { A, B }"#,
        "export declare enum Foo {\n  A,\n  B\n}",
    );
    transform_dts_test(
        r#"export const enum Foo { A, B }"#,
        "export declare const enum Foo {\n  A,\n  B\n}",
    );

    transform_dts_test(
        r#"export enum Foo { A = "foo", B = "bar" }"#,
        r#"export declare enum Foo {
  A = "foo",
  B = "bar"
}"#,
    );

    // TODO: Enum rules https://www.typescriptlang.org/docs/handbook/enums.html
}

#[test]
fn dts_default_export() {
    transform_dts_test(
        r#"export default function(a: number, b: number): number {};"#,
        "export default function(a: number, b: number): number;",
    );
    transform_dts_test(
        r#"export default function(a: number, b: number): number;
export default function(a: number, b: number): any {
  return foo
};"#,
        "export default function(a: number, b: number): number;",
    );
    transform_dts_test(
        r#"export default class {foo = 2};"#,
        r#"export default class {
  foo: number;
}"#,
    );
    transform_dts_test(
        r#"export default 42;"#,
        r#"declare const _dts_1: number;
export default _dts_1;"#,
    );
    // TODO
    //     transform_dts_test(
    //       r#"const a: number = 42; export default a;"#,
    //       r#"declare const a: number;
    // export default a;"#,
    //     )
    //     ;
}

#[test]
fn dts_default_export_named() {
    transform_dts_test(
        r#"export { foo, bar } from "foo";"#,
        r#"export { foo, bar } from "foo";"#,
    );
}

#[test]
fn dts_default_export_all() {
    transform_dts_test(
        r#"export * as foo from "foo";"#,
        r#"export * as foo from "foo";"#,
    );
}

#[test]
fn dts_imports() {
    transform_dts_test(
        r#"import { foo } from "bar";export const foobar = foo;"#,
        r#"import { foo } from "bar";
export declare const foobar: any;"#,
    );
}
