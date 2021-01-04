use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

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
pub fn reserved_words(preserve_import: bool) -> impl Fold {
    ReservedWord { preserve_import }
}
struct ReservedWord {
    pub preserve_import: bool,
}

impl Fold for ReservedWord {
    noop_fold_type!();

    fn fold_export_specifier(&mut self, n: ExportSpecifier) -> ExportSpecifier {
        n
    }

    fn fold_ident(&mut self, i: Ident) -> Ident {
        fold_ident(self.preserve_import, i)
    }

    fn fold_import_named_specifier(&mut self, s: ImportNamedSpecifier) -> ImportNamedSpecifier {
        if s.imported.is_some() {
            ImportNamedSpecifier {
                local: s.local.fold_with(self),
                ..s
            }
        } else {
            ImportNamedSpecifier {
                imported: s.imported.fold_with(self),
                ..s
            }
        }
    }

    fn fold_member_expr(&mut self, e: MemberExpr) -> MemberExpr {
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

    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        n
    }
}

fn fold_ident(preserve_import: bool, i: Ident) -> Ident {
    if preserve_import && i.sym == *"import" {
        return i;
    }

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
    use swc_ecma_transforms_testing::test;

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test!(
                ::swc_ecma_parser::Syntax::default(),
                |_| ReservedWord {
                    preserve_import: false
                },
                $name,
                $src,
                $src
            );
        };
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| ReservedWord {
            preserve_import: false
        },
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
