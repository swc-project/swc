use super::Context;
use crate::ast::{
    common::Decorator as BabelDecorator,
    class::{
        ClassBody, ClassBodyEl, ClassProperty, ClassPrivateProperty, ClassPrivateMethod,
        ClassMethod as BabelClassMethod, ClassMethodKind, ClassDeclaration,
    },
    expr::ClassExpression,
};
use crate::convert::Babelify;
use swc_ecma_ast::{
    Class, ClassMember, ClassProp, PrivateProp, Decorator, PrivateMethod, ClassMethod, MethodKind,
    Constructor,
};
use serde_json::value::Value;
use std::any::type_name_of_val;

impl Babelify for Class {
    type Output = ClassExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ClassExpression {
            base: ctx.base(self.span),
            decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
            body: ClassBody::from_swc(self.body, ctx),
            super_class: self.super_class.map(|expr| Box::new(expr.babelify(ctx).into())),
            type_parameters: self.type_params.map(|param| param.babelify(ctx).into()),
            super_type_parameters: self.super_type_params.map(|param| param.babelify(ctx).into()),
            implements: Some(self.implements.iter().map(|imp| imp.clone().babelify(ctx).into()).collect()),
            id: Default::default(),
            mixins: Default::default(),
        }
    }
}

impl From<ClassExpression> for ClassDeclaration {
    fn from(expr: ClassExpression) -> Self {
        ClassDeclaration {
            base: expr.base,
            id: expr.id.unwrap(),
            super_class: expr.super_class.map(|s| *s),
            body: expr.body,
            decorators: expr.decorators,
            is_abstract: Default::default(),
            declare: Default::default(),
            implements: expr.implements,
            mixins: expr.mixins,
            super_type_parameters: expr.super_type_parameters,
            type_parameters: expr.type_parameters,
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
            _ => panic!("illegal conversion: Cannot convert {} to ClassBodyEl (in impl Babelify for ClassMember)", type_name_of_val(&self)),
        }
    }
}

impl ClassBody {
    fn from_swc(members: Vec<ClassMember>, ctx: &Context) -> Self {
        let spans = members.iter().map(|mem| {
            match mem {
                ClassMember::Constructor(c) => c.span,
                ClassMember::Method(m) => m.span,
                ClassMember::PrivateMethod(m) => m.span,
                ClassMember::ClassProp(p) => p.span,
                ClassMember::PrivateProp(p) => p.span,
                ClassMember::TsIndexSignature(s) => s.span,
                ClassMember::Empty(e) => e.span,
            }
        }).collect();
        ClassBody {
            base: ctx.base_reduce(spans),
            body: members.iter().map(|mem| mem.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for ClassProp {
    type Output = ClassProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ClassProperty {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx).into(),
            value: self.value.map(|val| val.babelify(ctx).into()),
            type_annotation: self.type_ann.map(|ann| ann.babelify(ctx).into()),
            is_static: Some(self.is_static),
            decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
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
            value: self.value.map(|expr| expr.babelify(ctx).into()),
            type_annotation: self.type_ann.map(|ann| ann.babelify(ctx).into()),
            static_any: Value::Bool(self.is_static),
            decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
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
            params: self.function.params.iter().map(|param| param.clone().babelify(ctx)).collect(),
            body: self.function.body.unwrap().babelify(ctx), // TODO(dwoznicki): unwrap()?
            generator: Some(self.function.is_generator),
            is_async: Some(self.function.is_async),
            decorators: Some(self.function.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
            type_parameters: self.function.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self.function.return_type.map(|t| t.babelify(ctx).into()),
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
            params: self.function.params.iter().map(|param| param.clone().babelify(ctx)).collect(),
            body: self.function.body.unwrap().babelify(ctx), // TODO(dwoznicki): unwrap()?
            generator: Some(self.function.is_generator),
            is_async: Some(self.function.is_async),
            decorators: Some(self.function.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
            type_parameters: self.function.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self.function.return_type.map(|t| t.babelify(ctx).into()),
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
            params: self.params.iter().map(|param| param.clone().babelify(ctx)).collect(),
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
            expression: self.expr.babelify(ctx).into(),
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

