use std::path::PathBuf;

use swc_ecma_parser::{parse_file_as_script, Syntax};
use testing::NormalizedOutput;

use super::for_each_id_ref_in_member_obj;

/// Check object aliases directly, before optimizer passes can remove
/// assignments.
#[testing::fixture("tests/fixture/**/member-objects.js")]
fn member_object_aliases(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load member objects");
        let script = parse_file_as_script(
            &fm,
            Syntax::default(),
            Default::default(),
            None,
            &mut vec![],
        )
        .map_err(|err| err.into_diagnostic(&handler).emit())?;

        let mut output = String::new();
        for stmt in &script.body {
            let member = stmt
                .as_expr()
                .and_then(|stmt| stmt.expr.as_member())
                .expect("fixture statements must be member expressions");
            let mut first = true;
            for_each_id_ref_in_member_obj(&member.obj, &mut |id| {
                if !first {
                    output.push_str(", ");
                }
                first = false;
                output.push_str(&id.sym);
            });
            output.push('\n');
        }
        NormalizedOutput::from(output)
            .compare_to_file(input.with_extension("ids"))
            .unwrap();
        Ok(())
    })
    .unwrap();
}
