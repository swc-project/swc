use copyless::BoxHelper;
use serde_json::value::Value;
use swc_ecma_ast::{
    Class, ClassMember, ClassMethod, ClassProp, Constructor, Decorator, MethodKind, PrivateMethod,
    PrivateProp, StaticBlock,
};
use swc_estree_ast::{
    ClassBody, ClassBodyEl, ClassExpression, ClassMethod as BabelClassMethod, ClassMethodKind,
    ClassPrivateMethod, ClassPrivateProperty, ClassProperty, Decorator as BabelDecorator,
    StaticBlock as BabelStaticBlock,
};

use crate::babelify::{
    extract_class_body_span, function::babelify_function_params, Babelify, Context,
};

impl Babelify for Class {
    type Output = ClassExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let mut body_base = ctx.base(extract_class_body_span(&self, ctx));
        let mut members = Vec::with_capacity(self.body.len());
        for m in self.body {
            match m {
                ClassMember::Empty(empty) => {
                    let empty_base = ctx.base(empty.span);
                    body_base.inner_comments.extend(empty_base.leading_comments);
                    body_base
                        .inner_comments
                        .extend(empty_base.trailing_comments);
                }
                other => members.push(other),
            }
        }
        let body = ClassBody {
            base: body_base,
            body: members.babelify(ctx),
        };

        ClassExpression {
            base: ctx.base(self.span),
            decorators: Some(self.decorators.babelify(ctx)),
            body,
            super_class: self
                .super_class
                .map(|expr| Box::alloc().init(expr.babelify(ctx).into())),
            type_parameters: self.type_params.map(|param| param.babelify(ctx).into()),
            super_type_parameters: self
                .super_type_params
                .map(|param| param.babelify(ctx).into()),
            implements: Some(
                self.implements
                    .into_iter()
                    .map(|imp| imp.babelify(ctx).into())
                    .collect(),
            ),
            id: Default::default(),
            mixins: Default::default(),
        }
    }
}

impl Babelify for ClassMember {
    type Output = ClassBodyEl;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ClassMember::Constructor(c) => ClassBodyEl::Method(c.babelify(ctx)),
            ClassMember::Method(m) => ClassBodyEl::Method(m.babelify(ctx)),
            ClassMember::PrivateMethod(m) => ClassBodyEl::PrivateMethod(m.babelify(ctx)),
            ClassMember::ClassProp(p) => ClassBodyEl::Prop(p.babelify(ctx)),
            ClassMember::PrivateProp(p) => ClassBodyEl::PrivateProp(p.babelify(ctx)),
            ClassMember::TsIndexSignature(s) => ClassBodyEl::TSIndex(s.babelify(ctx)),
            ClassMember::Empty(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ClassBodyEl",
                &self
            ),
            ClassMember::StaticBlock(s) => ClassBodyEl::StaticBlock(s.babelify(ctx)),
            ClassMember::AutoAccessor(..) => todo!("auto accessor"),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl Babelify for ClassProp {
    type Output = ClassProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let computed = Some(self.key.is_computed());

        ClassProperty {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx),
            value: self
                .value
                .map(|val| Box::alloc().init(val.babelify(ctx).into())),
            type_annotation: self
                .type_ann
                .map(|ann| Box::alloc().init(ann.babelify(ctx).into())),
            is_static: Some(self.is_static),
            decorators: Some(self.decorators.babelify(ctx)),
            computed,
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            is_abstract: Some(self.is_abstract),
            optional: Some(self.is_optional),
            readonly: Some(self.readonly),
            declare: Some(self.declare),
            definite: Some(self.definite),
        }
    }
}

impl Babelify for PrivateProp {
    type Output = ClassPrivateProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ClassPrivateProperty {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx),
            value: self
                .value
                .map(|expr| Box::alloc().init(expr.babelify(ctx).into())),
            type_annotation: self
                .type_ann
                .map(|ann| Box::alloc().init(ann.babelify(ctx).into())),
            computed: false,
            static_any: Value::Bool(self.is_static),
            decorators: Some(self.decorators.babelify(ctx)),
        }
    }
}

impl Babelify for ClassMethod {
    type Output = BabelClassMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let computed = Some(self.key.is_computed());

        let params = babelify_function_params(self.function.this_param, self.function.params, ctx);

        BabelClassMethod {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx),
            kind: Some(self.kind.babelify(ctx)),
            is_static: Some(self.is_static),
            access: self.accessibility.map(|access| access.babelify(ctx)),
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            is_abstract: Some(self.is_abstract),
            optional: Some(self.is_optional),
            params,
            body: self.function.body.unwrap().babelify(ctx),
            generator: Some(self.function.is_generator),
            is_async: Some(self.function.is_async),
            decorators: Some(self.function.decorators.babelify(ctx)),
            type_parameters: self.function.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self
                .function
                .return_type
                .map(|t| Box::alloc().init(t.babelify(ctx).into())),
            computed,
        }
    }
}

impl Babelify for PrivateMethod {
    type Output = ClassPrivateMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let params = babelify_function_params(self.function.this_param, self.function.params, ctx);

        ClassPrivateMethod {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx),
            kind: Some(self.kind.babelify(ctx)),
            is_static: Some(self.is_static),
            access: self.accessibility.map(|access| access.babelify(ctx)),
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            is_abstract: Some(self.is_abstract),
            optional: Some(self.is_optional),
            params,
            body: self.function.body.unwrap().babelify(ctx),
            generator: Some(self.function.is_generator),
            is_async: Some(self.function.is_async),
            decorators: Some(self.function.decorators.babelify(ctx)),
            type_parameters: self.function.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self
                .function
                .return_type
                .map(|t| Box::alloc().init(t.babelify(ctx).into())),
            computed: Some(false),
        }
    }
}

impl Babelify for Constructor {
    type Output = BabelClassMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let computed = Some(self.key.is_computed());

        BabelClassMethod {
            base: ctx.base(self.span),
            kind: Some(ClassMethodKind::Constructor),
            key: self.key.babelify(ctx),
            params: self.params.babelify(ctx),
            body: self.body.unwrap().babelify(ctx),
            access: self.accessibility.map(|access| access.babelify(ctx)),
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            optional: Some(self.is_optional),
            computed,
            is_static: Some(false),
            generator: Some(false),
            is_async: Some(false),
            is_abstract: Default::default(),
            decorators: Default::default(),
            return_type: Default::default(),
            type_parameters: Default::default(),
        }
    }
}

impl Babelify for Decorator {
    type Output = BabelDecorator;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelDecorator {
            base: ctx.base(self.span),
            expression: Box::alloc().init(self.expr.babelify(ctx).into()),
        }
    }
}

impl Babelify for MethodKind {
    type Output = ClassMethodKind;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            MethodKind::Method => ClassMethodKind::Method,
            MethodKind::Getter => ClassMethodKind::Get,
            MethodKind::Setter => ClassMethodKind::Set,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl Babelify for StaticBlock {
    type Output = BabelStaticBlock;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelStaticBlock {
            base: ctx.base(self.span),
            body: self.body.stmts.babelify(ctx),
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::{
        comments::{Comment, CommentKind, Comments},
        sync::Lrc,
        BytePos, FileName, SourceMap, Span, SyntaxContext, DUMMY_SP,
    };
    use swc_ecma_ast::{Class, ClassMember, ClassProp, EmptyStmt, IdentName, PropName};
    use swc_node_comments::SwcComments;

    use crate::babelify::{Babelify, Context};

    #[test]
    fn test_class_with_empty_member() {
        let cm = Lrc::new(SourceMap::default());
        let fm = cm.new_source_file(Lrc::new(FileName::Anon), ";");
        let comments = SwcComments::default();
        let empty_span = Span::new(BytePos(1), BytePos(2));
        comments.add_leading(
            empty_span.lo,
            Comment {
                kind: CommentKind::Block,
                span: DUMMY_SP,
                text: atom!(" empty stmt comment "),
            },
        );
        let ctx = Context { fm, cm, comments };

        let class = Class {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            decorators: vec![],
            body: vec![
                ClassMember::Empty(EmptyStmt { span: empty_span }),
                ClassMember::ClassProp(ClassProp {
                    span: DUMMY_SP,
                    key: PropName::Ident(IdentName {
                        span: DUMMY_SP,
                        sym: atom!("x"),
                    }),
                    value: None,
                    type_ann: None,
                    is_static: false,
                    decorators: vec![],
                    accessibility: None,
                    is_abstract: false,
                    is_override: false,
                    is_optional: false,
                    readonly: false,
                    declare: false,
                    definite: false,
                }),
            ],
            super_class: None,
            is_abstract: false,
            type_params: None,
            super_type_params: None,
            implements: vec![],
        };
        let class_expr = class.babelify(&ctx);
        assert_eq!(class_expr.body.body.len(), 1);
        assert_eq!(class_expr.body.base.inner_comments.len(), 1);
    }
}
