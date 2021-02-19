use swc_atoms::js_word;
use swc_ecma_ast::*;

/// We want to use React.createElement, even in the case of
/// jsx, for <div {...props} key={key} /> to distinguish it
/// from <div key={key} {...props} />. This is an intermediary
/// step while we deprecate key spread from props. Afterwards,
/// we will stop using createElement in the transform.
pub(super) fn should_use_create_element(attrs: &[JSXAttrOrSpread]) -> bool {
    let mut seen_prop_spread = false;
    for attr in attrs {
        if seen_prop_spread
            && match attr {
                JSXAttrOrSpread::JSXAttr(attr) => match &attr.name {
                    JSXAttrName::Ident(i) => i.sym == js_word!("key"),
                    JSXAttrName::JSXNamespacedName(_) => false,
                },
                _ => false,
            }
        {
            return true;
        }

        match attr {
            JSXAttrOrSpread::SpreadElement(_) => {
                seen_prop_spread = true;
            }
            _ => {}
        }
    }

    false
}
