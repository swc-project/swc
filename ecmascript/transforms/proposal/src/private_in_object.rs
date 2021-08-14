use std::borrow::Cow;
use swc_common::pass::CompilerPass;
use swc_ecma_transforms_base::pass::JsPass;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl JsPass {
    as_folder(PrivateInObject {})
}

struct PrivateInObject {}

impl CompilerPass for PrivateInObject {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("private-in-object")
    }
}

impl VisitMut for PrivateInObject {
    noop_visit_mut_type!();
}

#[cfg(test)]
mod tests {
    use super::private_in_object;
    use std::path::PathBuf;
    use swc_ecma_transforms_testing::test_fixture;

    #[testing::fixture("tests/private-in-object/**/input.js")]
    fn fixture(input: PathBuf) {
        let parent = input.parent().unwrap();
        let output = parent.join("output.js");
        test_fixture(
            Default::default(),
            &|_| private_in_object(),
            &input,
            &output,
        )
    }

    #[testing::fixture("tests/private-in-object/**/exec.js")]
    fn exec(input: PathBuf) {}
}
