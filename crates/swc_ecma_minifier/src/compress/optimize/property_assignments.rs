use swc_ecma_ast::{Expr, Lit, MemberExpr, MemberProp};

use super::Optimizer;
use crate::option::PureGetterOption;

/// Receivers whose identity cannot escape while their assignment target is
/// evaluated. This deliberately does not follow identifiers or arbitrary
/// members.
enum FreshReceiver {
    RegExp,
    Prototype,
}

impl Optimizer<'_> {
    /// Whether an unused simple assignment can retain only its RHS evaluation.
    pub(super) fn can_drop_property_assignment(&self, member: &MemberExpr) -> bool {
        if !self.options.side_effects
            || self.options.pure_getters != PureGetterOption::Bool(true)
            || !self.options.pristine_globals
        {
            return false;
        }

        let Some(key) = static_key(&member.prop) else {
            // Keeping a computed expression alone would lose ToPropertyKey.
            return false;
        };
        if key == "__proto__" {
            return false;
        }

        let receiver = match member.obj.unwrap_parens() {
            Expr::Lit(Lit::Regex(..)) => FreshReceiver::RegExp,
            Expr::Member(prototype) if static_key(&prototype.prop) == Some("prototype") => {
                match prototype.obj.unwrap_parens() {
                    Expr::Fn(function)
                        if !function.function.is_async
                            && !function.function.is_generator
                            && function.function.decorators.is_empty() => {}
                    Expr::Class(class)
                        if class.class.super_class.is_none()
                            && class.class.decorators.is_empty()
                            && class.class.body.is_empty() => {}
                    _ => return false,
                }
                FreshReceiver::Prototype
            }
            _ => return false,
        };

        // With pristine built-ins, an ordinary function's fresh prototype and
        // an empty base class's fresh prototype have no accessors. RegExp's
        // inherited getter-only properties still reject writes in strict mode.
        // Pure getters do not make those writes, or the assignment's RHS, pure.
        match receiver {
            FreshReceiver::RegExp => !matches!(
                key,
                "dotAll"
                    | "flags"
                    | "global"
                    | "hasIndices"
                    | "ignoreCase"
                    | "multiline"
                    | "source"
                    | "sticky"
                    | "unicode"
                    | "unicodeSets"
            ),
            FreshReceiver::Prototype => true,
        }
    }
}

/// Borrow a key only when evaluating it cannot execute code or coerce an
/// object.
fn static_key(prop: &MemberProp) -> Option<&str> {
    match prop {
        MemberProp::Ident(ident) => Some(&ident.sym),
        MemberProp::Computed(computed) => match computed.expr.unwrap_parens() {
            Expr::Lit(Lit::Str(string)) => string.value.as_str(),
            _ => None,
        },
        _ => None,
    }
}
