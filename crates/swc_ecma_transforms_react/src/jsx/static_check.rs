use swc_ecma_ast::*;

/// We want to use React.createElement, even in the case of
/// jsx, for <div {...props} key={key} /> to distinguish it
/// from <div key={key} {...props} />. This is an intermediary
/// step while we deprecate key spread from props. Afterwards,
/// we will stop using createElement in the transform.
pub(super) fn should_use_create_element(attrs: &[JSXAttrOrSpread]) -> bool {
    let mut seen_spread = false;
    for attr in attrs {
        match attr {
            JSXAttrOrSpread::JSXAttr(JSXAttr {
                name: JSXAttrName::Ident(IdentName { sym, .. }),
                ..
            }) if seen_spread && sym == "key" => {
                return true;
            }
            JSXAttrOrSpread::SpreadElement(..) => {
                seen_spread = true;
            }
            _ => {}
        }
    }

    false
}
