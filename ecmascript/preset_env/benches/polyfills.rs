#![feature(test)]
extern crate test;

use swc_common::{FileName, Mark};
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_preset_env::{preset_env, Config};
use swc_ecma_visit::FoldWith;
use test::Bencher;

fn run(b: &mut Bencher, src: &str, config: Config) {
    b.bytes = src.len() as _;

    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        let mut parser = Parser::new(Syntax::default(), StringInput::from(&*fm), None);
        let module = parser
            .parse_module()
            .map_err(|e| e.into_diagnostic(&handler).emit())
            .unwrap();

        for e in parser.take_errors() {
            e.into_diagnostic(&handler).emit()
        }

        let mut folder = preset_env(Mark::fresh(Mark::root()), config);

        b.iter(|| test::black_box(module.clone().fold_with(&mut folder)));
        Ok(())
    });
}

#[bench]
fn usage_builtin_type(b: &mut Bencher) {
    const SOURCE: &str = r#"
// From a length
var float32 = new Float32Array(2);
float32[0] = 42;
console.log(float32[0]); // 42
console.log(float32.length); // 2
console.log(float32.BYTES_PER_ELEMENT); // 4

// From an array
var arr = new Float32Array([21,31]);
console.log(arr[1]); // 31

// From another TypedArray
var x = new Float32Array([21, 31]);
var y = new Float32Array(x);
console.log(y[0]); // 21

// From an ArrayBuffer
var buffer = new ArrayBuffer(16);
var z = new Float32Array(buffer, 0, 4);

// From an iterable 
var iterable = function*(){ yield* [1,2,3]; }(); 
var float32 = new Float32Array(iterable); 
// Float32Array[1, 2, 3]
"#;

    run(b, SOURCE, Default::default())
}

#[bench]
fn usage_property(b: &mut Bencher) {
    const SOURCE: &str = r#"
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
"#;

    run(b, SOURCE, Default::default())
}
