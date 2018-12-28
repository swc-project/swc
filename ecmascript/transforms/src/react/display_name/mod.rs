use ast::Module;
use swc_common::Fold;

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-display-name`
///
/// Add displayName to React.createClass calls
pub fn display_name() -> impl Fold<Module> {
    DisplayName
}

struct DisplayName;
