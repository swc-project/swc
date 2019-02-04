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
#[derive(Default, Clone, Copy)]
pub struct ReservedWord;

impl Fold<Ident> for ReservedWord {
    fn fold(&mut self, i: Ident) -> Ident {
        fold_ident(i)
    }
}

macro_rules! noop {
    ($T:tt) => {
        impl Fold<$T> for ReservedWord {
            fn fold(&mut self, node: $T) -> $T {
                node
            }
        }
    };
}
noop!(PropName);
noop!(ExportSpecifier);

impl Fold<ImportSpecific> for ReservedWord {
    fn fold(&mut self, s: ImportSpecific) -> ImportSpecific {
        if s.imported.is_some() {
            ImportSpecific {
                local: s.local.fold_with(self),
                ..s
            }
        } else {
            ImportSpecific {
                imported: s.imported.fold_with(self),
                ..s
            }
        }
    }
}

impl Fold<MemberExpr> for ReservedWord {
    fn fold(&mut self, e: MemberExpr) -> MemberExpr {
        if e.computed {
            MemberExpr {
                obj: e.obj.fold_with(self),
                prop: e.prop.fold_with(self),
                ..e
            }
        } else {
            MemberExpr {
                obj: e.obj.fold_with(self),
                ..e
            }
        }
    }
}

fn fold_ident(i: Ident) -> Ident {
    if i.is_reserved_for_es3() {
        return Ident {
            sym: format!("_{}", i.sym).into(),
            ..i
        };
    }

    i
}

#[cfg(test)]
mod tests {
    use super::*;

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test!(
                ::swc_ecma_parser::Syntax::default(),
                |_, _| ReservedWord,
                $name,
                $src,
                $src
            );
        };
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_, _| ReservedWord,
        babel_issue_6477,
        r#"
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;
  else if (byte >> 5 === 0x06) return 2;
  else if (byte >> 4 === 0x0E) return 3;
  else if (byte >> 3 === 0x1E) return 4;
  return -1;
}
"#,
        r#"
function utf8CheckByte(_byte) {
  if (_byte <= 0x7F) return 0;
  else if (_byte >> 5 === 0x06) return 2;
  else if (_byte >> 4 === 0x0E) return 3;
  else if (_byte >> 3 === 0x1E) return 4;
  return -1;
}
"#
    );

    identical!(export_as_default, "export { Foo as default }");
}
