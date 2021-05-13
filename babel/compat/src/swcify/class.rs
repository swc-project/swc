use super::Context;
use crate::swcify::Swcify;
use swc_babel_ast::ClassBody;
use swc_babel_ast::ClassBodyEl;
use swc_babel_ast::ClassMethodKind;
use swc_ecma_ast::ClassMember;
use swc_ecma_ast::Function;
use swc_ecma_ast::MethodKind;

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
            ClassBodyEl::Prop(v) => v.swcify(ctx).into(),
            ClassBodyEl::PrivateProp(v) => v.swcify(ctx).into(),
            ClassBodyEl::TSMethod(v) => v.swcify(ctx).into(),
            ClassBodyEl::TSIndex(v) => v.swcify(ctx).into(),
        }
    }
}

impl Swcify for swc_babel_ast::ClassMethod {
    type Output = swc_ecma_ast::ClassMember;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self.kind.unwrap_or(ClassMethodKind::Method) {
            ClassMethodKind::Get | ClassMethodKind::Set | ClassMethodKind::Method => {
                swc_ecma_ast::ClassMethod {
                    span: ctx.span(&self.base),
                    key: self.key.swcify(ctx),
                    function: (),
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
                params: self.params.swcify(ctx),
                body: self.body.swcify(ctx),
                accessibility: self.accessibility.swcify(ctx),
                is_optional: self.optional.unwrap_or_default(),
            }
            .into(),
        }
    }
}

impl Swcify for swc_babel_ast::ClassPrivateMethod {
    type Output = swc_ecma_ast::PrivateMethod;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateMethod {
            span: ctx.span(&self.base),
            key: self.key.swcify(ctx),
            function: Function {
                params: self.params.swcify(ctx),
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
                is_generator: self.generator.unwrap_or_default(),
                is_async: self.is_async.unwrap_or_default(),
                type_params: self.type_parameters.swcify(ctx).flatten(),
                return_type: self.return_type.swcify(ctx).flatten(),
            },
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

impl Swcify for swc_babel_ast::ClassProperty {
    type Output = swc_ecma_ast::ClassProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let key = self.key.swcify(ctx);
        let computed = key.is_computed();

        swc_ecma_ast::ClassProp {
            span: ctx.span(&self.base),
            key,
            value: self.value.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx).flatten(),
            is_static: self.is_static.unwrap_or(false),
            decorators: (),
            computed,
            accessibility: (),
            is_abstract: (),
            is_optional: (),
            is_override: (),
            readonly: (),
            declare: (),
            definite: (),
        }
    }
}

impl Swcify for swc_babel_ast::ClassPrivateProperty {
    type Output = swc_ecma_ast::PrivateProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateProp {
            span: ctx.span(&self.base),
            key: self.key.swcify(ctx),
            value: self.value.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx).flatten(),
            is_static: false,
            decorators: Default::default(),
            computed: false,
            accessibility: Default::default(),
            is_abstract: false,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        }
    }
}
