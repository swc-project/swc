mod common;

use common::{assert_snapshot, fixture_inputs, run_fixture};

#[test]
fn transform_fixtures() {
    for input in fixture_inputs() {
        let result = run_fixture(&input);
        assert_snapshot(&input.with_file_name("output.js"), &result.output);
    }
}
