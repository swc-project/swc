//! babel: `@babel/plugin-transform-reserved-words`
//!
//! Some words were reserved in ES3 as potential future keywords but were not
//! reserved in ES5 and later. This plugin, to be used when targeting ES3
//! environments, renames variables from that set of words.
//!
//! # Input
//! ```js
//! var abstract = 1;
//! var x = abstract + 1;
//! ```
//!
//! # Output
//! ```js
//! var _abstract = 1;
//! var x = _abstract + 1;
//! ```

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

/// Context for tracking when to skip identifier transformation.
#[derive(Default)]
pub struct ReservedWordContext {
    /// Skip transforming identifiers when inside these contexts
    skip_depth: u32,
    /// Skip transforming identifiers in named exports with source
    in_named_export_with_src: bool,
    /// Skip transforming the `imported` field in import specifiers
    skip_imported: bool,
    /// Track how many ModuleExportNames we've seen in the current export
    /// specifier to skip the exported (second one) but not the orig (first
    /// one)
    export_specifier_module_export_name_count: u32,
    /// Whether we're in an export specifier with a reserved orig
    in_reserved_export_specifier: bool,
}

impl AsMut<ReservedWordContext> for ReservedWordContext {
    fn as_mut(&mut self) -> &mut ReservedWordContext {
        self
    }
}

/// babel: `@babel/plugin-transform-reserved-words`
pub fn reserved_words(preserve_import: bool) -> impl Pass {
    visit_mut_pass(VisitMutWithHook {
        hook: ReservedWordHook { preserve_import },
        context: ReservedWordContext::default(),
    })
}

struct ReservedWordHook {
    pub preserve_import: bool,
}

impl<C: AsMut<ReservedWordContext>> VisitMutHook<C> for ReservedWordHook {
    // Skip transforming identifiers in member expression properties
    fn enter_member_prop(&mut self, _n: &mut MemberProp, ctx: &mut C) {
        ctx.as_mut().skip_depth += 1;
    }

    fn exit_member_prop(&mut self, _n: &mut MemberProp, ctx: &mut C) {
        ctx.as_mut().skip_depth -= 1;
    }

    // Skip transforming identifiers in property names
    fn enter_prop_name(&mut self, _n: &mut PropName, ctx: &mut C) {
        ctx.as_mut().skip_depth += 1;
    }

    fn exit_prop_name(&mut self, _n: &mut PropName, ctx: &mut C) {
        ctx.as_mut().skip_depth -= 1;
    }

    // Track when we're in a named export with source (re-export)
    fn enter_named_export(&mut self, n: &mut NamedExport, ctx: &mut C) {
        if n.src.is_some() {
            ctx.as_mut().in_named_export_with_src = true;
            ctx.as_mut().skip_depth += 1;
        }
    }

    fn exit_named_export(&mut self, n: &mut NamedExport, ctx: &mut C) {
        if n.src.is_some() {
            ctx.as_mut().in_named_export_with_src = false;
            ctx.as_mut().skip_depth -= 1;
        }
    }

    // Handle import specifiers specially - set imported before the ident is visited
    fn enter_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier, ctx: &mut C) {
        // Preserve the original imported name if the local is reserved
        if s.local.is_reserved_in_es3() && s.imported.is_none() {
            s.imported = Some(s.local.clone().into());
        }
        // Mark that we should skip the imported field (the ModuleExportName)
        ctx.as_mut().skip_imported = true;
    }

    fn exit_import_named_specifier(&mut self, _s: &mut ImportNamedSpecifier, ctx: &mut C) {
        ctx.as_mut().skip_imported = false;
    }

    // Handle export specifiers specially - set exported before the ident is visited
    fn enter_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier, ctx: &mut C) {
        // Don't transform in re-exports
        if ctx.as_mut().in_named_export_with_src {
            return;
        }

        // Check if orig is reserved
        let orig_is_reserved =
            matches!(&n.orig, ModuleExportName::Ident(ident) if ident.is_reserved_in_es3());

        // Check if exported is reserved (for specifiers we created in
        // enter_module_items)
        let exported_is_reserved = matches!(
            &n.exported,
            Some(ModuleExportName::Ident(ident)) if ident.is_reserved_in_es3()
        );

        if orig_is_reserved {
            if n.exported.is_none() {
                n.exported = Some(n.orig.clone());
            }
        }

        // If either orig or exported contains a reserved word, we need to skip the
        // exported field
        if orig_is_reserved || exported_is_reserved {
            let c = ctx.as_mut();
            c.in_reserved_export_specifier = true;
            c.export_specifier_module_export_name_count = 0;
        }
    }

    fn exit_export_named_specifier(&mut self, _n: &mut ExportNamedSpecifier, ctx: &mut C) {
        // Reset state
        let c = ctx.as_mut();
        c.in_reserved_export_specifier = false;
        c.export_specifier_module_export_name_count = 0;
    }

    // Track ModuleExportName visits within export specifiers to skip the second one
    // (exported)
    fn enter_module_export_name(&mut self, _n: &mut ModuleExportName, ctx: &mut C) {
        let c = ctx.as_mut();

        // Handle import specifiers - skip the imported field
        if c.skip_imported {
            c.skip_depth += 1;
            return;
        }

        // Handle export specifiers - skip the second ModuleExportName (exported)
        if c.in_reserved_export_specifier {
            c.export_specifier_module_export_name_count += 1;
            // The second ModuleExportName is the exported field - skip it
            if c.export_specifier_module_export_name_count == 2 {
                c.skip_depth += 1;
            }
        }
    }

    fn exit_module_export_name(&mut self, _n: &mut ModuleExportName, ctx: &mut C) {
        let c = ctx.as_mut();

        // Handle import specifiers
        if c.skip_imported {
            c.skip_depth -= 1;
            return;
        }

        // Handle export specifiers - only decrement if we incremented
        if c.in_reserved_export_specifier && c.export_specifier_module_export_name_count == 2 {
            c.skip_depth -= 1;
        }
    }

    fn exit_ident(&mut self, i: &mut Ident, ctx: &mut C) {
        let ctx = ctx.as_mut();

        // Skip if we're in a context where identifiers shouldn't be transformed
        if ctx.skip_depth > 0 {
            return;
        }

        if self.preserve_import && i.sym == *"import" {
            return;
        }

        if i.is_reserved_in_es3() {
            i.sym = format!("_{}", i.sym).into()
        }
    }

    // Use enter_module_items to process BEFORE children are visited
    fn enter_module_items(&mut self, n: &mut Vec<ModuleItem>, _ctx: &mut C) {
        let mut extra_exports = Vec::new();

        for module_item in n.iter_mut() {
            match module_item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: decl @ Decl::Fn(..) | decl @ Decl::Class(..),
                    ..
                })) => {
                    let ident = match decl {
                        Decl::Class(d) => d.ident.clone(),
                        Decl::Fn(d) => d.ident.clone(),
                        _ => {
                            unreachable!()
                        }
                    };

                    if ident.is_reserved_in_es3() {
                        // Take the declaration out and make it a regular statement
                        let new_decl = decl.take();
                        *module_item = new_decl.into();

                        // Create the renamed identifier
                        let mut orig = ident.clone();
                        rename_reserved_ident(&mut orig, self.preserve_import);

                        // Add an export with the original name as the exported name
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
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(var),
                    ..
                })) => {
                    // Check if any variable name is a reserved word
                    let has_reserved = var.decls.iter().any(|v| {
                        if let Pat::Ident(i) = &v.name {
                            i.sym.is_reserved_in_es3()
                        } else {
                            false
                        }
                    });

                    if has_reserved {
                        for v in &var.decls {
                            let ident = Ident::from(v.name.clone().expect_ident());

                            if ident.is_reserved_in_es3() {
                                let mut orig = ident.clone();
                                rename_reserved_ident(&mut orig, self.preserve_import);

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
                        }

                        *module_item = var.take().into();
                    }
                }

                _ => {}
            }
        }

        if !extra_exports.is_empty() {
            let module_item = NamedExport {
                span: DUMMY_SP,
                specifiers: extra_exports,
                src: None,
                type_only: false,
                with: None,
            }
            .into();

            n.push(module_item);
        }
    }
}

/// Renames an identifier if it's a reserved word in ES3.
fn rename_reserved_ident(i: &mut Ident, preserve_import: bool) {
    if preserve_import && i.sym == *"import" {
        return;
    }

    if i.is_reserved_in_es3() {
        i.sym = format!("_{}", i.sym).into()
    }
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
        "#
    );

    // Issue #10266: Reserved words inside exported variable initializers should
    // be transformed
    test!(
        Default::default(),
        |_| reserved_words(false),
        issue_10266,
        r#"
        import { boolean } from 'yup';
        export const foo = boolean();
        "#
    );

    // Test that non-reserved exported variables still have their initializers
    // visited
    test!(
        Default::default(),
        |_| reserved_words(false),
        issue_10266_non_reserved_export,
        r#"
        import { boolean } from 'yup';
        export const normalName = someFn(boolean());
        "#
    );
}
