use crate::{Context, Babelify};
use swc_babel_ast::{
    JSXMemberExprObject, JSXMemberExpression, JSXNamespacedName as BabelJSXNamespacedName,
    JSXEmptyExpression, JSXExpressionContainer, JSXExprContainerExpr,
    JSXSpreadChild as BabelJSXSpreadChild, JSXElementName as BabelJSXElementName,
    JSXOpeningElement as BabelJSXOpeningElement, JSXOpeningElAttr, JSXAttribute,
    JSXAttrName as BabelJSXAttrName, JSXAttrVal, JSXElement as BabelJSXElement,
    JSXClosingElement as BabelJSXClosingElement, JSXElementChild as BabelJSXElementChild,
    JSXText as BabelJSXText, JSXFragment as BabelJSXFragment,
    JSXOpeningFragment as BabelJSXOpeningFragment, JSXClosingFragment as BabelJSXClosingFragment,
};

use swc_ecma_ast::{
    JSXObject, JSXMemberExpr, JSXNamespacedName, JSXEmptyExpr, JSXExprContainer, JSXExpr,
    JSXSpreadChild, JSXElementName, JSXOpeningElement, JSXAttrOrSpread, JSXAttr, JSXAttrName,
    JSXAttrValue, Lit, JSXElement, JSXClosingElement, JSXElementChild, JSXText, JSXFragment,
    JSXOpeningFragment, JSXClosingFragment,
};
use swc_common::Spanned;
use std::any::type_name_of_val;

impl Babelify for JSXObject {
    type Output = JSXMemberExprObject;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXObject::JSXMemberExpr(e) => JSXMemberExprObject::Expr(e.babelify(ctx)),
            JSXObject::Ident(i) => JSXMemberExprObject::Id(i.babelify(ctx).into()),
        }
    }
}

impl Babelify for JSXMemberExpr {
    type Output = JSXMemberExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        JSXMemberExpression {
            base: ctx.base(self.span()),
            object: Box::new(self.obj.babelify(ctx)),
            property: self.prop.babelify(ctx).into(),
        }
    }
}

impl Babelify for JSXNamespacedName {
    type Output = BabelJSXNamespacedName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXNamespacedName {
            base: ctx.base(self.span()),
            namespace: self.ns.babelify(ctx).into(),
            name: self.name.babelify(ctx).into(),
        }
    }
}

impl Babelify for JSXEmptyExpr {
    type Output = JSXEmptyExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        JSXEmptyExpression {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for JSXExprContainer {
    type Output = JSXExpressionContainer;

    fn babelify(self, ctx: &Context) -> Self::Output {
        JSXExpressionContainer {
            base: ctx.base(self.span),
            expression: self.expr.babelify(ctx),
        }
    }
}

impl Babelify for JSXExpr {
    type Output = JSXExprContainerExpr;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXExpr::JSXEmptyExpr(e) => JSXExprContainerExpr::Empty(e.babelify(ctx)),
            JSXExpr::Expr(e) => JSXExprContainerExpr::Expr(Box::new(e.babelify(ctx).into())),
        }
    }
}

impl Babelify for JSXSpreadChild {
    type Output = BabelJSXSpreadChild;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXSpreadChild {
            base: ctx.base(self.span),
            expression: Box::new(self.expr.babelify(ctx).into()),
        }
    }
}

impl Babelify for JSXElementName {
    type Output = BabelJSXElementName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXElementName::Ident(i) => BabelJSXElementName::Id(i.babelify(ctx).into()),
            JSXElementName::JSXMemberExpr(e) => BabelJSXElementName::Expr(e.babelify(ctx)),
            JSXElementName::JSXNamespacedName(n) => BabelJSXElementName::Name(n.babelify(ctx)),
        }
    }
}

impl Babelify for JSXOpeningElement {
    type Output = BabelJSXOpeningElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXOpeningElement {
            base: ctx.base(self.span),
            name: self.name.babelify(ctx),
            attributes: self.attrs.iter().map(|attr| attr.clone().babelify(ctx)).collect(),
            self_closing: self.self_closing,
            type_parameters: self.type_args.map(|arg| arg.babelify(ctx).into()),
        }
    }
}

impl Babelify for JSXAttrOrSpread {
    type Output = JSXOpeningElAttr;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXAttrOrSpread::JSXAttr(a) => JSXOpeningElAttr::Attr(a.babelify(ctx)),
            JSXAttrOrSpread::SpreadElement(s) => JSXOpeningElAttr::Spread(s.babelify(ctx).into()),
        }
    }
}

impl Babelify for JSXClosingElement {
    type Output = BabelJSXClosingElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXClosingElement {
            base: ctx.base(self.span),
            name: self.name.babelify(ctx),
        }
    }
}

impl Babelify for JSXAttr {
    type Output = JSXAttribute;
    
    fn babelify(self, ctx: &Context) -> Self::Output {
        JSXAttribute {
            base: ctx.base(self.span),
            name: self.name.babelify(ctx),
            value: self.value.map(|val| val.babelify(ctx)),
        }
    }
}

impl Babelify for JSXAttrName {
    type Output = BabelJSXAttrName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXAttrName::Ident(i) => BabelJSXAttrName::Id(i.babelify(ctx).into()),
            JSXAttrName::JSXNamespacedName(n) => BabelJSXAttrName::Name(n.babelify(ctx)),
        }
    }
}

impl Babelify for JSXAttrValue {
    type Output = JSXAttrVal;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXAttrValue::Lit(lit) => {
                // TODO(dwoznicki): Babel only seems to accept string literals here. Is taht right?
                match lit {
                    Lit::Str(s) => JSXAttrVal::String(s.babelify(ctx)),
                    _ => panic!("illegal conversion: Cannot convert {} to JsxAttrVal::Lit (in impl Babelify for JSXAttrValue)", type_name_of_val(&lit)),
                }
            },
            JSXAttrValue::JSXExprContainer(e) => JSXAttrVal::Expr(e.babelify(ctx)),
            JSXAttrValue::JSXElement(e) => JSXAttrVal::Element(e.babelify(ctx)),
            JSXAttrValue::JSXFragment(f) => JSXAttrVal::Fragment(f.babelify(ctx)),
        }
    }
}

impl Babelify for JSXText {
    type Output = BabelJSXText;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXText {
            base: ctx.base(self.span),
            value: self.value.to_string(),
        }
    }
}

impl Babelify for JSXElement {
    type Output = BabelJSXElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let self_closing = self.closing != None;
        BabelJSXElement {
            base: ctx.base(self.span),
            opening_element: self.opening.babelify(ctx),
            closing_element: self.closing.map(|el| el.babelify(ctx)),
            children: self.children.iter().map(|el| el.clone().babelify(ctx)).collect(),
            self_closing: Some(self_closing),
        }
    }
}

impl Babelify for JSXElementChild {
    type Output = BabelJSXElementChild;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXElementChild::JSXText(t) => BabelJSXElementChild::Text(t.babelify(ctx)),
            JSXElementChild::JSXExprContainer(e) => BabelJSXElementChild::Expr(e.babelify(ctx)),
            JSXElementChild::JSXSpreadChild(s) => BabelJSXElementChild::Spread(s.babelify(ctx)),
            JSXElementChild::JSXElement(e) => BabelJSXElementChild::Element(e.babelify(ctx)),
            JSXElementChild::JSXFragment(f) => BabelJSXElementChild::Fragment(f.babelify(ctx)),
        }
    }
}

impl Babelify for JSXFragment {
    type Output = BabelJSXFragment;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXFragment {
            base: ctx.base(self.span),
            opening_fragment: self.opening.babelify(ctx),
            closing_fragment: self.closing.babelify(ctx),
            children: self.children.iter().map(|el| el.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for JSXOpeningFragment {
    type Output = BabelJSXOpeningFragment;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXOpeningFragment {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for JSXClosingFragment {
    type Output = BabelJSXClosingFragment;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXClosingFragment {
            base: ctx.base(self.span),
        }
    }
}

