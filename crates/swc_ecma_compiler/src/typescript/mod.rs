use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod annotations;
mod class;
mod diagnostics;
mod r#enum;
mod module;
mod namespace;
mod options;
mod rewrite_extensions;

use annotations::TypeScriptAnnotations;
use module::TypeScriptModule;
use namespace::TypeScriptNamespace;
pub use options::{RewriteExtensionsMode, TypeScriptOptions};
use r#enum::TypeScriptEnum;
use rewrite_extensions::TypeScriptRewriteExtensions;

/// [Preset TypeScript](https://babeljs.io/docs/babel-preset-typescript)
///
/// This preset includes the following plugins:
///
/// * [transform-typescript](https://babeljs.io/docs/babel-plugin-transform-typescript)
///
/// This plugin adds support for the types syntax used by the TypeScript
/// programming language. However, this plugin does not add the ability to
/// type-check the JavaScript passed to it. For that, you will need to install
/// and set up TypeScript.
///
/// Note that although the TypeScript compiler tsc actively supports certain
/// JavaScript proposals such as optional chaining (?.), nullish coalescing (??)
/// and class properties (this.#x), this preset does not include these features
/// because they are not the types syntax available in TypeScript only.
/// We recommend using preset-env with preset-typescript if you want to
/// transpile these features.
///
/// This plugin is included in `preset-typescript`.
///
/// ## Example
///
/// In:  `const x: number = 0;`
/// Out: `const x = 0;`
pub struct TypeScript<'a, 'ctx> {
    ctx: &'ctx TransformCtx,

    annotations: TypeScriptAnnotations<'a>,
    r#enum: TypeScriptEnum,
    namespace: TypeScriptNamespace<'a>,
    module: TypeScriptModule<'a>,
    rewrite_extensions: Option<TypeScriptRewriteExtensions>,
    // Options
    remove_class_fields_without_initializer: bool,
}

impl<'a, 'ctx> TypeScript<'a, 'ctx> {
    pub fn new(options: &TypeScriptOptions, ctx: &'ctx TransformCtx) -> Self {
        Self {
            ctx,
            annotations: TypeScriptAnnotations::new(options, ctx),
            r#enum: TypeScriptEnum::new(),
            namespace: TypeScriptNamespace::new(options, ctx),
            module: TypeScriptModule::new(options.only_remove_type_imports, ctx),
            rewrite_extensions: TypeScriptRewriteExtensions::new(options),
            remove_class_fields_without_initializer: !options.allow_declare_fields
                || options.remove_class_fields_without_initializer,
        }
    }
}

impl<'a> VisitMutHook<TraverseCtx<'a>> for TypeScript<'a, '_> {
    fn enter_program(&mut self, program: &mut Program, ctx: &mut TraverseCtx<'a>) {
        // TypeScript definition files (.d.ts) are handled by clearing the program body
        // This check would need to be done externally based on file extension
        // For now, we skip this check and just handle normal TypeScript transformations

        // Convert source type to JavaScript
        match program {
            Program::Module(_) => {
                // Module is already JavaScript compatible
                self.namespace.enter_program(program, ctx);
            }
            Program::Script(_) => {
                // Script is already JavaScript compatible
                self.namespace.enter_program(program, ctx);
            }
        }
    }

    fn exit_program(&mut self, program: &mut Program, ctx: &mut TraverseCtx<'a>) {
        self.annotations.exit_program(program, ctx);
        self.module.exit_program(program, ctx);
        // Note: In SWC, scoping/binding deletion is handled differently
        // ctx.scoping.delete_typescript_bindings() is not available
    }

    fn enter_arrow_expr(&mut self, expr: &mut ArrowExpr, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_arrow_function_expression(expr, ctx);
    }

    fn enter_var_declarator(&mut self, decl: &mut VarDeclarator, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_variable_declarator(decl, ctx);
    }

    fn enter_pat(&mut self, pat: &mut Pat, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_binding_pattern(pat, ctx);
    }

    fn enter_call_expr(&mut self, expr: &mut CallExpr, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_call_expression(expr, ctx);
    }

    fn enter_opt_chain_expr(&mut self, expr: &mut OptChainExpr, ctx: &mut TraverseCtx<'a>) {
        self.annotations
            .enter_optional_chaining_expression(expr, ctx);
    }

    fn enter_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_class(class, ctx);

        // Avoid converting class fields when class-properties plugin is enabled, that
        // plugin has covered all this transformation does.
        if !self.ctx.is_class_properties_plugin_enabled
            && self.ctx.assumptions.set_public_class_fields
        {
            self.transform_class_fields(class, ctx);
        }
    }

    fn exit_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx<'a>) {
        self.annotations.exit_class(class, ctx);

        // Avoid converting class fields when class-properties plugin is enabled, that
        // plugin has covered all this transformation does.
        if !self.ctx.is_class_properties_plugin_enabled {
            self.transform_class_on_exit(class, ctx);
        }
    }

    fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_expression(expr, ctx);
    }

    fn enter_simple_assign_target(
        &mut self,
        target: &mut SimpleAssignTarget,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.annotations.enter_simple_assignment_target(target, ctx);
    }

    fn enter_assign_target(&mut self, target: &mut AssignTarget, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_assignment_target(target, ctx);
    }

    fn enter_param(&mut self, param: &mut Param, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_formal_parameter(param, ctx);
    }

    fn exit_function(&mut self, func: &mut Function, ctx: &mut TraverseCtx<'a>) {
        self.annotations.exit_function(func, ctx);
    }

    fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.annotations.enter_jsx_opening_element(elem, ctx);
    }

    fn enter_class_method(&mut self, method: &mut ClassMethod, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_class_method(method, ctx);
        if self.ctx.is_class_properties_plugin_enabled
            || !self.ctx.assumptions.set_public_class_fields
        {
            Self::transform_class_constructor(method, ctx);
        }
    }

    fn enter_new_expr(&mut self, expr: &mut NewExpr, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_new_expression(expr, ctx);
    }

    fn enter_class_prop(&mut self, prop: &mut ClassProp, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_class_prop(prop, ctx);
    }

    fn enter_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx<'a>) {
        self.r#enum.enter_statement(stmt, ctx);
    }

    fn exit_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx<'a>) {
        self.annotations.exit_statement(stmt, ctx);
    }

    fn enter_if_stmt(&mut self, stmt: &mut IfStmt, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_if_statement(stmt, ctx);
    }

    fn enter_while_stmt(&mut self, stmt: &mut WhileStmt, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_while_statement(stmt, ctx);
    }

    fn enter_do_while_stmt(&mut self, stmt: &mut DoWhileStmt, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_do_while_statement(stmt, ctx);
    }

    fn enter_for_stmt(&mut self, stmt: &mut ForStmt, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_for_statement(stmt, ctx);
    }

    fn enter_for_in_stmt(&mut self, stmt: &mut ForInStmt, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_for_in_statement(stmt, ctx);
    }

    fn enter_for_of_stmt(&mut self, stmt: &mut ForOfStmt, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_for_of_statement(stmt, ctx);
    }

    fn enter_tagged_tpl(&mut self, expr: &mut TaggedTpl, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_tagged_template_expression(expr, ctx);
    }

    fn enter_jsx_element(&mut self, elem: &mut JSXElement, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_jsx_element(elem, ctx);
    }

    fn enter_jsx_fragment(&mut self, elem: &mut JSXFragment, ctx: &mut TraverseCtx<'a>) {
        self.annotations.enter_jsx_fragment(elem, ctx);
    }

    fn enter_ts_export_assignment(
        &mut self,
        node: &mut TsExportAssignment,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(stmt) = self.module.enter_ts_export_assignment(node, ctx) {
            // TODO: Need to replace the module item with the transformed statement
            // This requires access to the parent context which isn't available here
            let _ = stmt;
        }
    }

    fn enter_ts_import_equals_decl(
        &mut self,
        node: &mut TsImportEqualsDecl,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(decl) = self.module.enter_ts_import_equals_decl(node, ctx) {
            // TODO: Need to replace the module item with the transformed declaration
            // This requires access to the parent context which isn't available here
            let _ = decl;
        }
    }

    fn enter_import_decl(&mut self, node: &mut ImportDecl, ctx: &mut TraverseCtx<'a>) {
        if let Some(rewrite_extensions) = &mut self.rewrite_extensions {
            rewrite_extensions.enter_import_decl(node, ctx);
        }
    }

    fn enter_export_all(&mut self, node: &mut ExportAll, ctx: &mut TraverseCtx<'a>) {
        if let Some(rewrite_extensions) = &mut self.rewrite_extensions {
            rewrite_extensions.enter_export_all(node, ctx);
        }
    }

    fn enter_named_export(&mut self, node: &mut NamedExport, ctx: &mut TraverseCtx<'a>) {
        if let Some(rewrite_extensions) = &mut self.rewrite_extensions {
            rewrite_extensions.enter_named_export(node, ctx);
        }
    }
}
