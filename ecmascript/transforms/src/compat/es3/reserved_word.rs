use ast::*;
use swc_common::{Fold, FoldWith};

/// babel: `@babel/plugin-transform-reserved-words`
///
/// Some words were reserved in ES3 as potential future keywords but were not
/// reserved in ES5 and later. This plugin, to be used when targeting ES3
/// environments, renames variables from that set of words.
///
/// # Input
/// ```js
/// var abstract = 1;
/// var x = abstract + 1;
/// ```
///
/// # Output
/// ```js
/// var _abstract = 1;
/// var x = _abstract + 1;
/// ```
#[derive(Debug, Clone, Copy, Default)]
pub struct ReservedWord;

impl Fold<Expr> for ReservedWord {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        e
    }
}
