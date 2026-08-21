use swc_common::Spanned;
use swc_ecma_ast::{
    ClassMember, ComputedPropName, Expr, Function, Key, MemberExpr, MemberProp, MethodKind,
    ParamOrTsParamProp, PropName, TsExprWithTypeArgs, TsFunction, TsMethod,
};
use swc_ecma_utils::prop_name_to_expr;
use swc_estree_ast::{
    ClassBody, ClassBodyEl, ClassImpl, ClassMethodKind, TSDeclareMethod, TSDeclareMethodKey,
    TSEntityName, TSExpressionWithTypeArguments, TSQualifiedName,
};

use super::Context;
use crate::swcify::{
    function::{swcify_function_params, SwcifiedFunctionParams},
    stmt::swcify_function_body,
    Swcify,
};

impl Swcify for ClassBody {
    type Output = Vec<ClassMember>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        self.body.swcify(ctx)
    }
}

impl Swcify for ClassBodyEl {
    type Output = ClassMember;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ClassBodyEl::Method(v) => v.swcify(ctx),
            ClassBodyEl::PrivateMethod(v) => v.swcify(ctx).into(),
            ClassBodyEl::TSMethod(v) => v.swcify(ctx),
            ClassBodyEl::Prop(v) => v.swcify(ctx).into(),
            ClassBodyEl::PrivateProp(v) => v.swcify(ctx).into(),
            _ => {
                unimplemented!("swcify: {:?}", self)
            }
        }
    }
}

impl Swcify for TSDeclareMethodKey {
    type Output = Key;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            TSDeclareMethodKey::Private(key) => Key::Private(key.swcify(ctx)),
            TSDeclareMethodKey::Public(key) => Key::Public(key.swcify(ctx)),
        }
    }
}

fn swcify_ts_declare_method_key(key: TSDeclareMethodKey, computed: bool, ctx: &Context) -> Key {
    match key {
        TSDeclareMethodKey::Private(key) => Key::Private(key.swcify(ctx)),
        TSDeclareMethodKey::Public(key) => {
            let key = key.swcify(ctx);
            if !computed {
                return Key::Public(key);
            }

            let expr = prop_name_to_expr(key);
            Key::Public(PropName::Computed(ComputedPropName {
                span: expr.span(),
                expr: Box::new(expr),
            }))
        }
    }
}

impl Swcify for swc_estree_ast::ClassMethod {
    type Output = swc_ecma_ast::ClassMember;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self.kind.unwrap_or(ClassMethodKind::Method) {
            ClassMethodKind::Get | ClassMethodKind::Set | ClassMethodKind::Method => {
                let SwcifiedFunctionParams { this_param, params } =
                    swcify_function_params(self.params, ctx);

                swc_ecma_ast::ClassMethod {
                    span: ctx.span(&self.base),
                    key: self.key.swcify(ctx),
                    function: Function {
                        this_param,
                        params,
                        decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                        span: ctx.span(&self.base),
                        body: swcify_function_body(self.body, ctx),
                        is_generator: self.generator.unwrap_or_default(),
                        is_async: self.is_async.unwrap_or_default(),
                        type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                        return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
                        ..Default::default()
                    }
                    .into(),
                    kind: self
                        .kind
                        .map(|kind| match kind {
                            ClassMethodKind::Get => MethodKind::Getter,
                            ClassMethodKind::Set => MethodKind::Setter,
                            ClassMethodKind::Method => MethodKind::Getter,
                            ClassMethodKind::Constructor => {
                                unreachable!()
                            }
                        })
                        .unwrap_or(MethodKind::Method),
                    is_static: self.is_static.unwrap_or_default(),
                    accessibility: self.accessibility.swcify(ctx),
                    is_abstract: self.is_abstract.unwrap_or_default(),
                    is_optional: self.optional.unwrap_or_default(),
                    is_override: false,
                }
                .into()
            }
            ClassMethodKind::Constructor => swc_ecma_ast::Constructor {
                span: ctx.span(&self.base),
                key: self.key.swcify(ctx),
                params: self
                    .params
                    .into_iter()
                    .map(|v| v.swcify(ctx))
                    .map(ParamOrTsParamProp::Param)
                    .collect(),
                body: Some(swcify_function_body(self.body, ctx)),
                accessibility: self.accessibility.swcify(ctx),
                is_optional: self.optional.unwrap_or_default(),
                ..Default::default()
            }
            .into(),
        }
    }
}

impl Swcify for TSDeclareMethod {
    type Output = ClassMember;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let kind = self.kind.unwrap_or(ClassMethodKind::Method);
        let computed = self.computed.unwrap_or_default();

        match kind {
            ClassMethodKind::Constructor => swc_ecma_ast::Constructor {
                span: ctx.span(&self.base),
                key: match self.key.swcify(ctx) {
                    Key::Public(key) => key,
                    Key::Private(_) => {
                        unreachable!("TypeScript constructors cannot have private names")
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                },
                params: self
                    .params
                    .into_iter()
                    .map(|param| param.swcify(ctx))
                    .map(ParamOrTsParamProp::Param)
                    .collect(),
                body: None,
                accessibility: self.accessibility.swcify(ctx),
                is_optional: self.optional.unwrap_or_default(),
                ..Default::default()
            }
            .into(),
            kind => {
                let SwcifiedFunctionParams { this_param, params } =
                    swcify_function_params(self.params, ctx);

                TsMethod {
                    span: ctx.span(&self.base),
                    key: swcify_ts_declare_method_key(self.key, computed, ctx),
                    function: Box::new(TsFunction {
                        this_param,
                        params,
                        decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                        span: ctx.span(&self.base),
                        is_generator: self.generator.unwrap_or_default(),
                        is_async: self.is_async.unwrap_or_default(),
                        type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                        return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
                        ..Default::default()
                    }),
                    kind: match kind {
                        ClassMethodKind::Get => MethodKind::Getter,
                        ClassMethodKind::Set => MethodKind::Setter,
                        ClassMethodKind::Method => MethodKind::Method,
                        ClassMethodKind::Constructor => unreachable!(),
                    },
                    is_static: self.is_static.unwrap_or_default(),
                    accessibility: self.accessibility.swcify(ctx),
                    is_abstract: self.is_abstract.unwrap_or_default(),
                    is_optional: self.optional.unwrap_or_default(),
                    is_override: self.is_override.unwrap_or_default(),
                }
                .into()
            }
        }
    }
}

impl Swcify for swc_estree_ast::ClassPrivateMethod {
    type Output = swc_ecma_ast::PrivateMethod;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let SwcifiedFunctionParams { this_param, params } =
            swcify_function_params(self.params, ctx);

        swc_ecma_ast::PrivateMethod {
            span: ctx.span(&self.base),
            key: self.key.swcify(ctx),
            function: Function {
                this_param,
                params,
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                span: ctx.span(&self.base),
                body: swcify_function_body(self.body, ctx),
                is_generator: self.generator.unwrap_or_default(),
                is_async: self.is_async.unwrap_or_default(),
                type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
                ..Default::default()
            }
            .into(),
            kind: match self.kind.unwrap_or(ClassMethodKind::Method) {
                ClassMethodKind::Get => MethodKind::Getter,
                ClassMethodKind::Set => MethodKind::Setter,
                ClassMethodKind::Method => MethodKind::Getter,
                ClassMethodKind::Constructor => {
                    unreachable!()
                }
            },
            is_static: self.is_static.unwrap_or_default(),
            accessibility: self.accessibility.swcify(ctx),
            is_abstract: self.is_abstract.unwrap_or_default(),
            is_optional: self.optional.unwrap_or_default(),
            is_override: false,
        }
    }
}

impl Swcify for swc_estree_ast::ClassProperty {
    type Output = swc_ecma_ast::ClassProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let key = self.key.swcify(ctx);

        swc_ecma_ast::ClassProp {
            span: ctx.span(&self.base),
            key,
            value: self.value.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx).flatten().map(Box::new),
            is_static: self.is_static.unwrap_or(false),
            decorators: self.decorators.swcify(ctx).unwrap_or_default(),
            accessibility: self.accessibility.swcify(ctx),
            is_abstract: self.is_abstract.unwrap_or_default(),
            is_optional: self.optional.unwrap_or_default(),
            is_override: false,
            readonly: self.readonly.unwrap_or_default(),
            declare: self.declare.unwrap_or_default(),
            definite: self.definite.unwrap_or_default(),
        }
    }
}

impl Swcify for swc_estree_ast::ClassPrivateProperty {
    type Output = swc_ecma_ast::PrivateProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateProp {
            span: ctx.span(&self.base),
            key: self.key.swcify(ctx),
            value: self.value.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx).flatten().map(Box::new),
            is_static: false,
            decorators: Default::default(),
            accessibility: Default::default(),
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
            ctxt: Default::default(),
        }
    }
}

impl Swcify for ClassImpl {
    type Output = TsExprWithTypeArgs;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ClassImpl::TSExpr(v) => v.swcify(ctx),
            ClassImpl::Implements(_) => {
                unreachable!()
            }
        }
    }
}

impl Swcify for TSExpressionWithTypeArguments {
    type Output = TsExprWithTypeArgs;

    fn swcify(self, ctx: &Context) -> Self::Output {
        // The reason why we have special logic for converting `TSEntityName` here,
        // instead of updating or using logic of `TSEntityName`,
        // is that `TSEntityName` can be used somewhere,
        // if we change its conversion logic, it will break.
        fn swcify_expr(expr: TSEntityName, ctx: &Context) -> Box<Expr> {
            match expr {
                TSEntityName::Id(v) => v.swcify(ctx).into(),
                TSEntityName::Qualified(v) => swcify_qualified_name(v, ctx),
            }
        }
        fn swcify_qualified_name(qualified_name: TSQualifiedName, ctx: &Context) -> Box<Expr> {
            MemberExpr {
                obj: swcify_expr(*qualified_name.left, ctx),
                prop: MemberProp::Ident(qualified_name.right.swcify(ctx).into()),
                span: ctx.span(&qualified_name.base),
            }
            .into()
        }

        TsExprWithTypeArgs {
            span: ctx.span(&self.base),
            expr: swcify_expr(self.expression, ctx),
            type_args: self.type_parameters.swcify(ctx).map(Box::new),
        }
    }
}
