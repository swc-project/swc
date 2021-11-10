use crate::babelify::{extract_class_body_span, Babelify, Context};
use copyless::BoxHelper;
use serde_json::value::Value;
use swc_babel_ast::{
    ClassBody, ClassBodyEl, ClassExpression, ClassMethod as BabelClassMethod, ClassMethodKind,
    ClassPrivateMethod, ClassPrivateProperty, ClassProperty, Decorator as BabelDecorator,
    StaticBlock as BabelStaticBlock,
};
use swc_ecma_ast::{
    Class, ClassMember, ClassMethod, ClassProp, Constructor, Decorator, MethodKind, PrivateMethod,
    PrivateProp, StaticBlock,
};

impl Babelify for Class {
    type Output = ClassExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let body = ClassBody {
            base: ctx.base(extract_class_body_span(&self, &ctx)),
            body: self.body.babelify(ctx),
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
        }
    }
}

impl Babelify for ClassProp {
    type Output = ClassProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ClassProperty {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx).into(),
            value: self
                .value
                .map(|val| Box::alloc().init(val.babelify(ctx).into())),
            type_annotation: self
                .type_ann
                .map(|ann| Box::alloc().init(ann.babelify(ctx).into())),
            is_static: Some(self.is_static),
            decorators: Some(self.decorators.babelify(ctx)),
            computed: Some(self.computed),
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
            static_any: Value::Bool(self.is_static),
            decorators: Some(self.decorators.babelify(ctx)),
        }
    }
}

impl Babelify for ClassMethod {
    type Output = BabelClassMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelClassMethod {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx).into(),
            kind: Some(self.kind.babelify(ctx)),
            is_static: Some(self.is_static),
            access: self.accessibility.map(|access| access.babelify(ctx)),
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            is_abstract: Some(self.is_abstract),
            optional: Some(self.is_optional),
            params: self.function.params.babelify(ctx),
            body: self.function.body.unwrap().babelify(ctx),
            generator: Some(self.function.is_generator),
            is_async: Some(self.function.is_async),
            decorators: Some(self.function.decorators.babelify(ctx)),
            type_parameters: self.function.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self
                .function
                .return_type
                .map(|t| Box::alloc().init(t.babelify(ctx).into())),
            computed: Default::default(),
        }
    }
}

impl Babelify for PrivateMethod {
    type Output = ClassPrivateMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ClassPrivateMethod {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx),
            kind: Some(self.kind.babelify(ctx)),
            is_static: Some(self.is_static),
            access: self.accessibility.map(|access| access.babelify(ctx)),
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            is_abstract: Some(self.is_abstract),
            optional: Some(self.is_optional),
            params: self.function.params.babelify(ctx),
            body: self.function.body.unwrap().babelify(ctx),
            generator: Some(self.function.is_generator),
            is_async: Some(self.function.is_async),
            decorators: Some(self.function.decorators.babelify(ctx)),
            type_parameters: self.function.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self
                .function
                .return_type
                .map(|t| Box::alloc().init(t.babelify(ctx).into())),
            computed: Default::default(),
        }
    }
}

impl Babelify for Constructor {
    type Output = BabelClassMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelClassMethod {
            base: ctx.base(self.span),
            kind: Some(ClassMethodKind::Constructor),
            key: self.key.babelify(ctx).into(),
            params: self.params.babelify(ctx),
            body: self.body.unwrap().babelify(ctx),
            access: self.accessibility.map(|access| access.babelify(ctx)),
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            optional: Some(self.is_optional),
            computed: Default::default(),
            is_static: Default::default(),
            generator: Default::default(),
            is_async: Default::default(),
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
