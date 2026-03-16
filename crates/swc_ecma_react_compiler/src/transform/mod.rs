/// React function kind used by compile selection and lowering.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ReactFunctionType {
    Component,
    Hook,
    Other,
}

/// Placeholder for upstream anonymous-function naming transform.
pub fn name_anonymous_functions() {
    // No-op placeholder for parity with pipeline staging.
}
