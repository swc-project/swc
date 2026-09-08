use swc_common::{Span, Spanned};
use swc_ecma_ast::{BindingIdent, Param, TsThisParam};
use swc_estree_ast::Param as BabelParam;

use super::{Context, Swcify};

/// Function parameters converted to SWC's split type-only/runtime
/// representation.
pub(super) struct SwcifiedFunctionParams {
    /// TypeScript-only `this` parameter.
    pub this_param: Option<Box<TsThisParam>>,
    /// Parameters present in the emitted JavaScript function.
    pub params: Vec<Param>,
}

/// Builds a `this` parameter while preserving its token and full annotation
/// spans.
fn ts_this_param_from_binding_ident(this_span: Span, ident: BindingIdent) -> TsThisParam {
    TsThisParam {
        span: ident.span(),
        this_span,
        type_ann: ident.type_ann,
    }
}

/// Converts ESTree parameters and separates a valid leading TypeScript `this`
/// parameter.
pub(super) fn swcify_function_params(
    params: Vec<BabelParam>,
    ctx: &Context,
) -> SwcifiedFunctionParams {
    let mut params = params.into_iter();
    let first = params.next();
    let mut output = Vec::with_capacity(params.len() + usize::from(first.is_some()));

    let this_param = match first {
        Some(BabelParam::Id(ident))
            if ident.name == "this"
                && !ident.optional.unwrap_or_default()
                && ident.decorators.as_ref().map_or(true, Vec::is_empty) =>
        {
            let this_span = ctx.span(&ident.base);
            let ident = ident.swcify(ctx);
            Some(Box::new(ts_this_param_from_binding_ident(this_span, ident)))
        }
        Some(param) => {
            output.push(param.swcify(ctx));
            None
        }
        None => None,
    };

    output.extend(params.map(|param| param.swcify(ctx)));

    SwcifiedFunctionParams {
        this_param,
        params: output,
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{BytePos, Span};
    use swc_ecma_ast::{BindingIdent, Ident, TsKeywordType, TsKeywordTypeKind, TsType, TsTypeAnn};

    use super::ts_this_param_from_binding_ident;

    #[test]
    fn builds_full_span_from_binding_ident() {
        let this_span = Span::new(BytePos(10), BytePos(14));
        let type_ann_span = Span::new(BytePos(14), BytePos(23));
        let ident = BindingIdent {
            id: Ident::new_no_ctxt("this".into(), this_span),
            type_ann: Some(Box::new(TsTypeAnn {
                span: type_ann_span,
                type_ann: Box::new(TsType::TsKeywordType(TsKeywordType {
                    span: type_ann_span,
                    kind: TsKeywordTypeKind::TsStringKeyword,
                })),
            })),
        };

        let this_param = ts_this_param_from_binding_ident(this_span, ident);

        assert_eq!(this_param.this_span, this_span);
        assert_eq!(
            this_param.span,
            Span::new(this_span.lo(), type_ann_span.hi())
        );
    }
}
