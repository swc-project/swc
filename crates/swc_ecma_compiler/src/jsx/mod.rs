use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{
    context::{TransformCtx, TraverseCtx},
    es2018::ObjectRestSpreadOptions,
};

mod comments;
mod diagnostics;
mod display_name;
mod jsx_impl;
mod jsx_self;
mod jsx_source;
mod options;
mod refresh;
use display_name::ReactDisplayName;
use jsx_impl::JsxImpl;
use jsx_self::JsxSelf;
pub use options::{JsxOptions, JsxRuntime, ReactRefreshOptions};
use refresh::ReactRefresh;

/// [Preset React](https://babel.dev/docs/babel-preset-react)
///
/// This preset includes the following plugins:
///
/// * [plugin-transform-react-jsx](https://babeljs.io/docs/babel-plugin-transform-react-jsx)
/// * [plugin-transform-react-jsx-self](https://babeljs.io/docs/babel-plugin-transform-react-jsx-self)
/// * [plugin-transform-react-jsx-source](https://babel.dev/docs/babel-plugin-transform-react-jsx-source)
/// * [plugin-transform-react-display-name](https://babeljs.io/docs/babel-plugin-transform-react-display-name)
pub struct Jsx<'a> {
    implementation: JsxImpl<'a>,
    display_name: ReactDisplayName<'a>,
    refresh: ReactRefresh<'a>,
    enable_jsx_plugin: bool,
    display_name_plugin: bool,
    self_plugin: bool,
    source_plugin: bool,
    refresh_plugin: bool,
}

// Constructors
impl<'a> Jsx<'a> {
    pub fn new(
        mut options: JsxOptions,
        object_rest_spread_options: Option<ObjectRestSpreadOptions>,
        ctx: &'a TransformCtx,
    ) -> Self {
        if options.jsx_plugin || options.development {
            options.conform();
        }
        let JsxOptions {
            jsx_plugin,
            display_name_plugin,
            jsx_self_plugin,
            jsx_source_plugin,
            ..
        } = options;
        let refresh = options.refresh.clone();
        Self {
            implementation: JsxImpl::new(options, object_rest_spread_options, ctx),
            display_name: ReactDisplayName::new(ctx),
            enable_jsx_plugin: jsx_plugin,
            display_name_plugin,
            self_plugin: jsx_self_plugin,
            source_plugin: jsx_source_plugin,
            refresh_plugin: refresh.is_some(),
            refresh: ReactRefresh::new(&refresh.unwrap_or_default(), ctx),
        }
    }
}

impl<'a> VisitMutHook<TraverseCtx<'a>> for Jsx<'a> {
    fn enter_program(&mut self, program: &mut Program, ctx: &mut TraverseCtx<'a>) {
        if self.refresh_plugin {
            self.refresh.enter_program(program, ctx);
        }
    }

    fn exit_program(&mut self, program: &mut Program, ctx: &mut TraverseCtx<'a>) {
        if self.refresh_plugin {
            self.refresh.exit_program(program, ctx);
        }
        if self.enable_jsx_plugin {
            self.implementation.exit_program(program, ctx);
        } else if self.source_plugin {
            self.implementation.jsx_source.exit_program(program, ctx);
        }
    }

    fn enter_call_expr(&mut self, call_expr: &mut CallExpr, ctx: &mut TraverseCtx<'a>) {
        if self.display_name_plugin {
            self.display_name.enter_call_expr(call_expr, ctx);
        }

        if self.refresh_plugin {
            self.refresh.enter_call_expr(call_expr, ctx);
        }
    }

    fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if !self.enable_jsx_plugin {
            if self.self_plugin && JsxSelf::can_add_self_attribute(ctx) {
                self.implementation
                    .jsx_self
                    .enter_jsx_opening_element(elem, ctx);
            }
            if self.source_plugin {
                self.implementation
                    .jsx_source
                    .enter_jsx_opening_element(elem, ctx);
            }
        }
    }

    fn exit_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx<'a>) {
        if self.enable_jsx_plugin {
            self.implementation.exit_expr(expr, ctx);
        }
        if self.refresh_plugin {
            self.refresh.exit_expr(expr, ctx);
        }
    }

    fn exit_function(&mut self, func: &mut Function, ctx: &mut TraverseCtx<'a>) {
        if self.refresh_plugin {
            self.refresh.exit_function(func, ctx);
        }
    }
}
