mod common;

use common::{assert_snapshot, fixture_inputs, run_fixture};

#[test]
fn codegen_fixtures() {
    for input in fixture_inputs() {
        let generated = run_fixture(&input);
        assert_snapshot(&input.with_file_name("output.js"), &generated.pretty);
        assert_snapshot(&input.with_file_name("output.min.js"), &generated.minified);
    }
}
