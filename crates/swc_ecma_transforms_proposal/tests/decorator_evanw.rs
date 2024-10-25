use std::{fs, path::PathBuf};

use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_proposal::decorator_2022_03::decorator_2022_03;
use swc_ecma_transforms_testing::exec_tr;

const HELPERS: &str = r###"
function assertEq(callback, expected) {
    let details;
    try {
        let x = callback();
        if (x === expected)
            return true;
        details = `  Expected: ${prettyPrint(expected)}\n  Observed: ${prettyPrint(x)}`;
    }
    catch (error) {
        details = `  Throws: ${error}`;
    }
    const code = callback.toString().replace(/^\(\) => /, '').replace(/\s+/g, ' ');
    console.log(`❌\n  Code: ${code}\n${details}\n`);
    return false;
}
function assertThrows(callback, expected) {
    let details;
    try {
        let x = callback();
        details = `  Expected: throws instanceof ${expected.name}\n  Observed: returns ${prettyPrint(x)}`;
    }
    catch (error) {
        if (error instanceof expected)
            return true;
        details = `  Expected: throws instanceof ${expected.name}\n  Observed: throws ${error}`;
    }
    const code = callback.toString().replace(/^\(\) => /, '').replace(/\s+/g, ' ');
    console.log(`❌\n  Code: ${code}\n${details}\n`);
    return false;
}
"###;

// TODO: Unignore tests
#[testing::fixture(
    "tests/decorator-evanw-split/*.js",
    exclude(
        "Decorator-list-evaluation-await-class-statement.js",
        "Decorator-list-evaluation-Inner-private-name-class-statement.js",
        "Decorator-list-evaluation-Inner-private-name-class-expression.js"
    )
)]
fn fixture(input: PathBuf) {
    let code = fs::read_to_string(&input).unwrap();

    let code = format!(
        "{HELPERS}
    
    
    {code}"
    );

    exec_tr(
        &input.file_name().unwrap().to_string_lossy(),
        Syntax::Es(EsSyntax {
            decorators: true,
            auto_accessors: true,
            ..Default::default()
        }),
        |_| decorator_2022_03(),
        &code,
    );
}
