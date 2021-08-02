use super::Pure;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::contains_this_expr;

impl Pure<'_> {
    pub(super) fn optimize_arrow_method_prop(&mut self, p: &mut Prop) {
        if self.options.ecma < EsVersion::Es2015 {
            return;
        }

        if !self.options.unsafe_methods && !self.options.arrows {
            return;
        }

        match p {
            Prop::KeyValue(kv) => {
                //
                if contains_this_expr(&kv.value) {
                    return;
                }

                match &mut *kv.value {
                    Expr::Arrow(
                        m
                        @
                        ArrowExpr {
                            body: BlockStmtOrExpr::BlockStmt(..),
                            ..
                        },
                    ) => {
                        self.modified_node = true;

                        *p = Prop::Method(MethodProp {
                            key: kv.key.take(),
                            function: Function {
                                params: m
                                    .params
                                    .take()
                                    .into_iter()
                                    .map(|pat| Param {
                                        span: pat.span(),
                                        decorators: Default::default(),
                                        pat,
                                    })
                                    .collect(),
                                decorators: Default::default(),
                                span: m.span,
                                body: m.body.take().block_stmt(),
                                is_generator: m.is_generator,
                                is_async: m.is_async,
                                type_params: Default::default(),
                                return_type: Default::default(),
                            },
                        });
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
