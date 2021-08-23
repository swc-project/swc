use crate::babelify::{Babelify, Context};
use copyless::BoxHelper;
use swc_babel_ast::{
    JSXAttrName as BabelJSXAttrName, JSXAttrVal, JSXAttribute,
    JSXClosingElement as BabelJSXClosingElement, JSXClosingFragment as BabelJSXClosingFragment,
    JSXElement as BabelJSXElement, JSXElementChild as BabelJSXElementChild,
    JSXElementName as BabelJSXElementName, JSXEmptyExpression, JSXExprContainerExpr,
    JSXExpressionContainer, JSXFragment as BabelJSXFragment, JSXMemberExprObject,
    JSXMemberExpression, JSXNamespacedName as BabelJSXNamespacedName, JSXOpeningElAttr,
    JSXOpeningElement as BabelJSXOpeningElement, JSXOpeningFragment as BabelJSXOpeningFragment,
    JSXSpreadAttribute, JSXSpreadChild as BabelJSXSpreadChild, JSXText as BabelJSXText,
};
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::{
    JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXClosingElement, JSXClosingFragment,
    JSXElement, JSXElementChild, JSXElementName, JSXEmptyExpr, JSXExpr, JSXExprContainer,
    JSXFragment, JSXMemberExpr, JSXNamespacedName, JSXObject, JSXOpeningElement,
    JSXOpeningFragment, JSXSpreadChild, JSXText, Lit,
};

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
            object: Box::alloc().init(self.obj.babelify(ctx)),
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
            JSXExpr::Expr(e) => {
                JSXExprContainerExpr::Expr(Box::alloc().init(e.babelify(ctx).into()))
            }
        }
    }
}

impl Babelify for JSXSpreadChild {
    type Output = BabelJSXSpreadChild;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXSpreadChild {
            base: ctx.base(self.span),
            expression: Box::alloc().init(self.expr.babelify(ctx).into()),
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
            attributes: self.attrs.babelify(ctx),
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
            JSXAttrOrSpread::SpreadElement(spread) => {
                // For JSX spread elements, babel includes the curly braces, and swc
                // does not. So we extend the span to include the braces here.
                let span = extend_spread_span_to_braces(spread.span(), ctx);
                JSXOpeningElAttr::Spread(JSXSpreadAttribute {
                    base: ctx.base(span),
                    argument: Box::alloc().init(spread.expr.babelify(ctx).into()),
                })
            }
        }
    }
}

fn extend_spread_span_to_braces(sp: Span, ctx: &Context) -> Span {
    let mut span = sp;
    let _ = ctx.cm.with_span_to_prev_source(sp, |prev_source| {
        let mut num_chars = 0;
        for c in prev_source.chars().rev() {
            num_chars += 1;
            if c == '{' {
                span = span.with_lo(span.lo - BytePos(num_chars));
            } else if !c.is_whitespace() {
                break;
            }
        }
    });

    let _ = ctx.cm.with_span_to_next_source(sp, |next_source| {
        let mut num_chars = 0;
        for c in next_source.chars() {
            num_chars += 1;
            if c == '}' {
                span = span.with_hi(span.hi + BytePos(num_chars));
            } else if !c.is_whitespace() {
                break;
            }
        }
    });

    span
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
                // TODO(dwoznicki): Babel only seems to accept string literals here. Is taht
                // right?
                match lit {
                    Lit::Str(s) => JSXAttrVal::String(s.babelify(ctx)),
                    _ => panic!(
                        "illegal conversion: Cannot convert {:?} to JsxAttrVal::Lit",
                        &lit
                    ),
                }
            }
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
            value: self.value,
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
            children: self.children.babelify(ctx),
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
            children: self.children.babelify(ctx),
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
