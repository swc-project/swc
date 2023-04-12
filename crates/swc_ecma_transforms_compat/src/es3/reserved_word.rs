use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

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
pub fn reserved_words(preserve_import: bool) -> impl VisitMut + Fold {
    as_folder(ReservedWord { preserve_import })
}
struct ReservedWord {
    pub preserve_import: bool,
}

#[swc_trace]
impl VisitMut for ReservedWord {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut extra_exports = vec![];

        n.iter_mut().for_each(|module_item| {
            if let Some((ident, decl)) = match module_item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. })) => {
                    let ident = decl
                        .as_fn_decl()
                        .filter(|fn_decl| fn_decl.ident.is_reserved_in_es3())
                        .map(|fn_decl| fn_decl.ident.clone());

                    ident.map(|ident| (ident, decl.take()))
                }
                _ => None,
            } {
                *module_item = ModuleItem::Stmt(decl.into());

                let mut orig = ident.clone();
                orig.visit_mut_with(self);

                extra_exports.push(
                    ExportNamedSpecifier {
                        span: DUMMY_SP,
                        orig: orig.into(),
                        exported: Some(ident.into()),
                        is_type_only: false,
                    }
                    .into(),
                );
            }

            module_item.visit_mut_with(self);
        });

        if !extra_exports.is_empty() {
            let module_item = ModuleItem::ModuleDecl(
                NamedExport {
                    span: DUMMY_SP,
                    specifiers: extra_exports,
                    src: None,
                    type_only: false,
                    asserts: None,
                }
                .into(),
            );

            n.push(module_item);
        }
    }

    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if matches!(&n.orig, ModuleExportName::Ident(ident) if ident.is_reserved_in_es3()) {
            n.exported.get_or_insert_with(|| n.orig.clone());
            n.orig.visit_mut_with(self);
        }
    }

    fn visit_mut_named_export(&mut self, n: &mut NamedExport) {
        if n.src.is_none() {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if self.preserve_import && i.sym == *"import" {
            return;
        }

        if i.is_reserved_in_es3() {
            i.sym = format!("_{}", i.sym).into()
        }
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        if s.local.is_reserved_in_es3() {
            s.imported.get_or_insert_with(|| s.local.clone().into());
            s.local.visit_mut_with(self);
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if let MemberProp::Computed(c) = &mut e.prop {
            c.visit_mut_with(self);
        }
    }

    fn visit_mut_prop_name(&mut self, _: &mut PropName) {}
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test!(
                ::swc_ecma_parser::Syntax::default(),
                |_| reserved_words(false),
                $name,
                $src,
                $src
            );
        };
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| reserved_words(false),
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

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| reserved_words(false),
        issue_7164,
        r#"
        import { int } from './a.js'
        console.log(int)
        export { int };
        "#,
        r#"
        import { int as _int } from './a.js';
        console.log(_int);
        export { _int as int };
        "#
    );

    test!(
        Default::default(),
        |_| reserved_words(false),
        issue_7237,
        r#"
        export function char() {
            console.log("char====char");
            return "";
        }
        "#,
        r#"
        function _char() {
            console.log("char====char");
            return "";
        }
        export { _char as char };
        "#
    );
}
