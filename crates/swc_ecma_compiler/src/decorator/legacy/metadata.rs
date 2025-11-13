/// Emitting decorator metadata.
///
/// This plugin is used to emit decorator metadata for legacy decorators by
/// the `__metadata` helper.
///
/// ## Example
///
/// Input:
/// ```ts
/// class Demo {
///   @LogMethod
///   public foo(bar: number) {}
///
///   @Prop
///   prop: string = "hello";
/// }
/// ```
///
/// Output:
/// ```js
/// class Demo {
///   foo(bar) {}
///   prop = "hello";
/// }
/// babelHelpers.decorate([
///   LogMethod,
///   babelHelpers.decorateParam(0, babelHelpers.decorateMetadata("design:type", Function)),
///   babelHelpers.decorateParam(0, babelHelpers.decorateMetadata("design:paramtypes", [Number])),
///   babelHelpers.decorateParam(0, babelHelpers.decorateMetadata("design:returntype", void 0))
/// ], Demo.prototype, "foo", null);
/// babelHelpers.decorate([Prop, babelHelpers.decorateMetadata("design:type", String)], Demo.prototype, "prop", void 0);
/// ```
///
/// ## Implementation
///
/// Implementation based on https://github.com/microsoft/TypeScript/blob/d85767abfd83880cea17cea70f9913e9c4496dcc/src/compiler/transformers/ts.ts#L1119-L1136
///
/// ## Limitations
///
/// ### Compared to TypeScript
///
/// We are lacking a kind of type inference ability that TypeScript has, so we
/// are not able to determine the exactly type of the type reference.
///
/// ### Compared to SWC
///
/// SWC also has the above limitation, considering that SWC has been adopted in [NestJS](https://docs.nestjs.com/recipes/swc#jest--swc),
/// so the limitation may not be a problem. In addition, SWC provides additional
/// support for inferring enum members, which we currently do not have. We
/// haven't dived into how NestJS uses it, so we don't know if it matters, thus
/// we may leave it until we receive feedback.
///
/// ## References
/// * TypeScript's [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

pub struct LegacyDecoratorMetadata<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> LegacyDecoratorMetadata<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        LegacyDecoratorMetadata { ctx }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for LegacyDecoratorMetadata<'_, '_> {
    #[inline]
    fn exit_program(&mut self, _program: &mut Program, _ctx: &mut TraverseCtx) {
        // TODO: Implement
    }

    #[inline]
    fn enter_stmt(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // TODO: Implement
    }

    fn enter_class(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx) {
        // TODO: Implement
    }

    fn enter_class_method(&mut self, _node: &mut ClassMethod, _ctx: &mut TraverseCtx) {
        // TODO: Implement
    }

    #[inline]
    fn enter_class_prop(&mut self, _prop: &mut ClassProp, _ctx: &mut TraverseCtx) {
        // TODO: Implement
    }

    #[inline]
    fn enter_auto_accessor(&mut self, _prop: &mut AutoAccessor, _ctx: &mut TraverseCtx) {
        // TODO: Implement
    }
}
