use super::Pure;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ExprExt, Type, Value::Known};

impl Pure<'_> {
    pub(super) fn drop_useless_addition_of_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(BinExpr {
                op: op!(bin, "+"),
                left,
                right,
                ..
            }) => {
                let lt = left.get_type();
                let rt = right.get_type();
                if let Known(Type::Str) = lt {
                    if let Known(Type::Str) = rt {
                        match &**left {
                            Expr::Lit(Lit::Str(Str {
                                value: js_word!(""),
                                ..
                            })) => {
                                log::debug!(
                                    "strings: Dropping empty string literal (in lhs) because it \
                                     does not changes type"
                                );

                                *e = *right.take();
                                return;
                            }
                            _ => {}
                        }

                        match &**right {
                            Expr::Lit(Lit::Str(Str {
                                value: js_word!(""),
                                ..
                            })) => {
                                log::debug!(
                                    "strings: Dropping empty string literal (in rhs) because it \
                                     does not changes type"
                                );

                                *e = *left.take();
                                return;
                            }
                            _ => {}
                        }
                    }
                }
            }
            _ => {}
        }
    }
}
