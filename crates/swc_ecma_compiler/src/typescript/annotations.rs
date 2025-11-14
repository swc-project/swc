use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use crate::{context::TraverseCtx, TypeScriptOptions};

/// TypeScript annotations transformer
///
/// Removes TypeScript-specific syntax including type annotations, interfaces,
/// type aliases, and other type-only constructs. Also manages parameter
/// properties and definite assignment assertions.
pub struct TypeScriptAnnotations {
    // Options
    only_remove_type_imports: bool,

    /// Assignments to be added to the constructor body
    assignments: Vec<Assignment>,
    has_super_call: bool,

    has_jsx_element: bool,
    has_jsx_fragment: bool,
    jsx_element_import_name: String,
    jsx_fragment_import_name: String,
}

impl TypeScriptAnnotations {
    pub fn new(options: &TypeScriptOptions) -> Self {
        let jsx_element_import_name = if options.jsx_pragma.contains('.') {
            options
                .jsx_pragma
                .split('.')
                .next()
                .map(String::from)
                .unwrap()
        } else {
            options.jsx_pragma.to_string()
        };

        let jsx_fragment_import_name = if options.jsx_pragma_frag.contains('.') {
            options
                .jsx_pragma_frag
                .split('.')
                .next()
                .map(String::from)
                .unwrap()
        } else {
            options.jsx_pragma_frag.to_string()
        };

        Self {
            only_remove_type_imports: options.only_remove_type_imports,
            has_super_call: false,
            assignments: vec![],
            has_jsx_element: false,
            has_jsx_fragment: false,
            jsx_element_import_name,
            jsx_fragment_import_name,
        }
    }
}

impl TypeScriptAnnotations {
    pub fn exit_program(&mut self, program: &mut Program, ctx: &mut TraverseCtx) {
        // Only process Module programs, not Script
        let Program::Module(module) = program else {
            return;
        };

        let mut no_modules_remaining = true;
        let mut some_modules_deleted = false;

        module.body.retain_mut(|item| {
            let need_retain = match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(decl)) if decl.src.is_none() => {
                    // export declaration without source
                    if decl.type_only {
                        false
                    } else if decl.specifiers.is_empty() {
                        // `export {}` - Keep the export declaration
                        true
                    } else {
                        decl.specifiers.retain(Self::can_retain_export_specifier);
                        // Keep the export declaration if there are still specifiers after removing
                        // type exports
                        !decl.specifiers.is_empty()
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(decl)) => !decl.type_only,
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(_decl)) => {
                    // Keep all non-TS default exports
                    true
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(_)) => true,
                ModuleItem::ModuleDecl(ModuleDecl::Import(decl)) => {
                    if decl.type_only {
                        false
                    } else if decl.specifiers.is_empty() {
                        // import 'mod' - keep it
                        true
                    } else {
                        // Check each specifier
                        if self.only_remove_type_imports {
                            // Only remove specifiers that are explicitly marked as type-only
                            true
                        } else {
                            // In SWC, we don't have semantic analysis yet,
                            // so we keep all imports unless they're marked type-only
                            true
                        }
                    }
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(_)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(_)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(_)))
                | ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(_))) => false,
                _ => return true,
            };

            if need_retain {
                no_modules_remaining = false;
            } else {
                some_modules_deleted = true;
            }

            need_retain
        });

        // Determine if we still have import/export statements, otherwise we
        // need to inject an empty statement (`export {}`) so that the file is
        // still considered a module
        if no_modules_remaining && some_modules_deleted && ctx.module_imports.is_empty() {
            let export_decl = ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                span: DUMMY_SP,
                specifiers: vec![],
                src: None,
                type_only: false,
                with: None,
            }));
            module.body.push(export_decl);
        }
    }

    pub fn enter_arrow_function_expression(
        &mut self,
        expr: &mut ArrowExpr,
        _ctx: &mut TraverseCtx,
    ) {
        expr.type_params = None;
        expr.return_type = None;
    }

    pub fn enter_variable_declarator(&mut self, decl: &mut VarDeclarator, _ctx: &mut TraverseCtx) {
        decl.definite = false;
    }

    #[allow(clippy::only_used_in_recursion)]
    pub fn enter_binding_pattern(&mut self, pat: &mut Pat, _ctx: &mut TraverseCtx) {
        // Remove type annotations from patterns
        match pat {
            Pat::Ident(ident) => {
                ident.type_ann = None;
                ident.optional = false;
            }
            Pat::Array(arr) => {
                arr.type_ann = None;
                arr.optional = false;
            }
            Pat::Object(obj) => {
                obj.type_ann = None;
                obj.optional = false;
            }
            Pat::Rest(rest) => {
                rest.type_ann = None;
            }
            Pat::Assign(assign) => {
                // AssignPat doesn't have type_ann, recurse into left pattern
                self.enter_binding_pattern(&mut assign.left, _ctx);
            }
            _ => {}
        }
    }

    pub fn enter_call_expression(&mut self, expr: &mut CallExpr, _ctx: &mut TraverseCtx) {
        expr.type_args = None;
    }

    /// Transform TS non-null assertions in optional chaining expressions
    ///
    /// Removes TypeScript non-null assertion operators (`!`) from within
    /// optional chaining expressions.
    ///
    /// # Example
    ///
    /// ```typescript
    /// obj?.prop!.method()
    /// // becomes
    /// obj?.prop.method()
    /// ```
    pub fn enter_optional_chaining_expression(
        &mut self,
        expr: &mut OptChainExpr,
        _ctx: &mut TraverseCtx,
    ) {
        // Strip TS non-null assertions from the base
        if let OptChainBase::Member(member) = &mut *expr.base {
            strip_ts_non_null_assertion(&mut member.obj);
        } else if let OptChainBase::Call(call) = &mut *expr.base {
            strip_ts_non_null_assertion(&mut call.callee);
        }
    }

    pub fn enter_class(&mut self, class: &mut Class, _ctx: &mut TraverseCtx) {
        class.type_params = None;
        class.super_type_params = None;
        class.implements = vec![];
        class.is_abstract = false;

        // Remove type only members
        class.body.retain(|elem| match elem {
            ClassMember::Method(method) => {
                // Keep regular methods, remove abstract methods
                !method.is_abstract
            }
            ClassMember::ClassProp(prop) => {
                // Keep regular properties, but we'll handle declare later
                !matches!(prop.accessibility, Some(Accessibility::Private))
                    || !is_typescript_only_prop(prop)
            }
            ClassMember::PrivateMethod(_) => true,
            ClassMember::PrivateProp(_) => true,
            ClassMember::Constructor(_) => true,
            ClassMember::TsIndexSignature(_) => false,
            ClassMember::StaticBlock(_) => true,
            ClassMember::AutoAccessor(_) => true,
            ClassMember::Empty(_) => true,
        });
    }

    pub fn exit_class(&mut self, class: &mut Class, _: &mut TraverseCtx) {
        // Remove `declare` properties from the class body, other ts-only properties
        // have been removed in `enter_class`. The reason that removing
        // `declare` properties here because the legacy-decorator plugin needs to
        // transform `declare` field in the `exit_class` phase, so we have to
        // ensure this step is run after the legacy-decorator plugin.
        class
            .body
            .retain(|elem| !matches!(elem, ClassMember::ClassProp(prop) if prop.declare));
    }

    pub fn enter_expression(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        strip_typescript_syntax(expr);
    }

    pub fn enter_simple_assignment_target(
        &mut self,
        target: &mut SimpleAssignTarget,
        _ctx: &mut TraverseCtx,
    ) {
        // Strip TS syntax from simple assignment targets
        if let SimpleAssignTarget::Paren(paren) = target {
            strip_typescript_syntax(&mut paren.expr);
        }
    }

    pub fn enter_assignment_target(&mut self, target: &mut AssignTarget, _ctx: &mut TraverseCtx) {
        // Strip TS syntax from assignment targets
        match target {
            AssignTarget::Simple(simple) => {
                if let SimpleAssignTarget::Paren(paren) = simple {
                    strip_typescript_syntax(&mut paren.expr);
                }
            }
            AssignTarget::Pat(pat) => match pat {
                AssignTargetPat::Array(arr) => {
                    // Array patterns in assignments - recurse into each element
                    for elem in arr.elems.iter_mut().flatten() {
                        self.enter_binding_pattern(elem, _ctx);
                    }
                }
                AssignTargetPat::Object(obj) => {
                    // Object patterns in assignments - recurse into properties
                    for prop in &mut obj.props {
                        match prop {
                            ObjectPatProp::KeyValue(kv) => {
                                self.enter_binding_pattern(&mut kv.value, _ctx);
                            }
                            ObjectPatProp::Assign(assign) => {
                                // Handle assignment properties
                                if let Some(value) = &mut assign.value {
                                    strip_typescript_syntax(value);
                                }
                            }
                            ObjectPatProp::Rest(rest) => {
                                self.enter_binding_pattern(&mut rest.arg, _ctx);
                            }
                        }
                    }
                }
                AssignTargetPat::Invalid(_) => {}
            },
        }
    }

    pub fn enter_formal_parameter(&mut self, param: &mut Param, _ctx: &mut TraverseCtx) {
        // Remove TypeScript-specific modifiers
        param.decorators.clear();
    }

    pub fn exit_function(&mut self, func: &mut Function, _ctx: &mut TraverseCtx) {
        func.type_params = None;
        func.return_type = None;
    }

    pub fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement,
        _ctx: &mut TraverseCtx,
    ) {
        elem.type_args = None;
    }

    pub fn enter_class_method(&mut self, method: &mut ClassMethod, _ctx: &mut TraverseCtx) {
        method.accessibility = None;
        method.is_optional = false;
        method.is_override = false;
    }

    pub fn enter_new_expression(&mut self, expr: &mut NewExpr, _ctx: &mut TraverseCtx) {
        expr.type_args = None;
    }

    pub fn enter_class_prop(&mut self, prop: &mut ClassProp, _ctx: &mut TraverseCtx) {
        prop.accessibility = None;
        prop.definite = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.readonly = false;
        prop.type_ann = None;
    }

    pub fn enter_statements(&mut self, stmts: &mut Vec<Stmt>, _ctx: &mut TraverseCtx) {
        // Remove declare declaration
        stmts.retain(|stmt| {
            if let Stmt::Decl(decl) = stmt {
                !is_declare_decl(decl)
            } else {
                true
            }
        });
    }

    pub fn exit_statements(&mut self, stmts: &mut Vec<Stmt>, _ctx: &mut TraverseCtx) {
        // Remove TS specific statements
        stmts.retain(|stmt| match stmt {
            Stmt::Expr(s) => !is_typescript_expr(&s.expr),
            Stmt::Decl(decl) => !is_typescript_decl(decl),
            _ => true,
        });
    }

    /// Transform if statement's consequent and alternate to block statements if
    /// they are super calls
    ///
    /// # Example
    ///
    /// ```typescript
    /// if (true) super() else super();
    /// // to
    /// if (true) { super() } else { super() }
    /// ```
    pub fn enter_if_statement(&mut self, stmt: &mut IfStmt, _ctx: &mut TraverseCtx) {
        // Handle consequent
        if is_super_call_stmt(&stmt.cons) && !self.assignments.is_empty() {
            let cons = std::mem::replace(&mut *stmt.cons, create_empty_block());
            *stmt.cons = create_block_with_stmt(cons);
        }

        // Handle alternate
        if let Some(alt) = &mut stmt.alt {
            if is_super_call_stmt(alt) && !self.assignments.is_empty() {
                let alt_stmt = std::mem::replace(&mut **alt, create_empty_block());
                **alt = create_block_with_stmt(alt_stmt);
            }

            // Replace TypeScript-only alternate with empty
            if is_typescript_stmt(alt) {
                stmt.alt = None;
            }
        }

        // Replace TypeScript-only consequent with empty block
        if is_typescript_stmt(&stmt.cons) {
            *stmt.cons = create_empty_block();
        }
    }

    pub fn enter_for_statement(&mut self, stmt: &mut ForStmt, _ctx: &mut TraverseCtx) {
        if is_typescript_stmt(&stmt.body) {
            *stmt.body = create_empty_block();
        }
    }

    pub fn enter_for_in_statement(&mut self, stmt: &mut ForInStmt, _ctx: &mut TraverseCtx) {
        if is_typescript_stmt(&stmt.body) {
            *stmt.body = create_empty_block();
        }
    }

    pub fn enter_for_of_statement(&mut self, stmt: &mut ForOfStmt, _ctx: &mut TraverseCtx) {
        if is_typescript_stmt(&stmt.body) {
            *stmt.body = create_empty_block();
        }
    }

    pub fn enter_while_statement(&mut self, stmt: &mut WhileStmt, _ctx: &mut TraverseCtx) {
        if is_typescript_stmt(&stmt.body) {
            *stmt.body = create_empty_block();
        }
    }

    pub fn enter_do_while_statement(&mut self, stmt: &mut DoWhileStmt, _ctx: &mut TraverseCtx) {
        if is_typescript_stmt(&stmt.body) {
            *stmt.body = create_empty_block();
        }
    }

    pub fn enter_tagged_template_expression(
        &mut self,
        expr: &mut TaggedTpl,
        _ctx: &mut TraverseCtx,
    ) {
        expr.type_params = None;
    }

    pub fn enter_jsx_element(&mut self, _elem: &mut JSXElement, _ctx: &mut TraverseCtx) {
        self.has_jsx_element = true;
    }

    pub fn enter_jsx_fragment(&mut self, _elem: &mut JSXFragment, _ctx: &mut TraverseCtx) {
        self.has_jsx_fragment = true;
    }
}

impl TypeScriptAnnotations {
    /// Check if the given name is a JSX pragma or fragment pragma import
    /// and if the file contains JSX elements or fragments
    #[allow(dead_code)]
    fn is_jsx_imports(&self, name: &str) -> bool {
        self.has_jsx_element && name == self.jsx_element_import_name
            || self.has_jsx_fragment && name == self.jsx_fragment_import_name
    }

    fn can_retain_export_specifier(specifier: &ExportSpecifier) -> bool {
        match specifier {
            ExportSpecifier::Named(named) => {
                // In SWC, we don't have semantic analysis yet,
                // so we can't determine if something is type-only based on usage
                // We only check explicit type_only markers
                !named.is_type_only
            }
            ExportSpecifier::Default(_) => true,
            // Namespace exports (export * as foo) are never type-only
            ExportSpecifier::Namespace(_) => true,
        }
    }

    /// Exit statement handler - called by parent TypeScript visitor
    pub fn exit_statement(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // Currently no-op, but kept for compatibility with oxc version
        // In oxc version, this handled adding assignments after super calls
    }
}

#[allow(dead_code)]
struct Assignment {
    span: Span,
    name: String,
}

// Helper functions

/// Strip TypeScript syntax from an expression
fn strip_typescript_syntax(expr: &mut Expr) {
    loop {
        match expr {
            Expr::TsAs(ts_as) => {
                *expr = *ts_as.expr.clone();
            }
            Expr::TsNonNull(ts_non_null) => {
                *expr = *ts_non_null.expr.clone();
            }
            Expr::TsTypeAssertion(ts_type) => {
                *expr = *ts_type.expr.clone();
            }
            Expr::TsConstAssertion(ts_const) => {
                *expr = *ts_const.expr.clone();
            }
            Expr::TsInstantiation(ts_inst) => {
                *expr = *ts_inst.expr.clone();
            }
            Expr::TsSatisfies(ts_sat) => {
                *expr = *ts_sat.expr.clone();
            }
            Expr::Paren(paren) => {
                strip_typescript_syntax(&mut paren.expr);
                break;
            }
            _ => break,
        }
    }
}

/// Strip TypeScript non-null assertions from an expression
fn strip_ts_non_null_assertion(expr: &mut Expr) {
    while let Expr::TsNonNull(ts_non_null) = expr {
        *expr = *ts_non_null.expr.clone();
    }
}

/// Check if a declaration is a TypeScript-only declaration
fn is_typescript_decl(decl: &Decl) -> bool {
    matches!(
        decl,
        Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_)
    )
}

/// Check if an expression is TypeScript-only
fn is_typescript_expr(expr: &Expr) -> bool {
    matches!(
        expr,
        Expr::TsAs(_)
            | Expr::TsNonNull(_)
            | Expr::TsTypeAssertion(_)
            | Expr::TsConstAssertion(_)
            | Expr::TsInstantiation(_)
            | Expr::TsSatisfies(_)
    )
}

/// Check if a statement is TypeScript-only
fn is_typescript_stmt(stmt: &Stmt) -> bool {
    match stmt {
        Stmt::Decl(decl) => is_typescript_decl(decl),
        Stmt::Expr(expr_stmt) => is_typescript_expr(&expr_stmt.expr),
        _ => false,
    }
}

/// Check if a declaration has the declare modifier
fn is_declare_decl(decl: &Decl) -> bool {
    match decl {
        Decl::Class(class) => class.declare,
        Decl::Fn(func) => func.declare,
        Decl::Var(var) => var.declare,
        Decl::TsInterface(_) | Decl::TsTypeAlias(_) => true,
        Decl::TsEnum(e) => e.declare,
        Decl::TsModule(m) => m.declare,
        Decl::Using(_) => false,
    }
}

/// Check if a class property is TypeScript-only
fn is_typescript_only_prop(prop: &ClassProp) -> bool {
    prop.declare || prop.is_abstract
}

/// Check if a statement is a super call
fn is_super_call_stmt(stmt: &Stmt) -> bool {
    matches!(
        stmt,
        Stmt::Expr(ExprStmt { expr, .. }) if matches!(**expr, Expr::Call(CallExpr { callee: Callee::Super(_), .. }))
    )
}

/// Create an empty block statement
fn create_empty_block() -> Stmt {
    Stmt::Block(BlockStmt {
        span: DUMMY_SP,
        ctxt: SyntaxContext::empty(),
        stmts: vec![],
    })
}

/// Create a block statement containing a single statement
fn create_block_with_stmt(stmt: Stmt) -> Stmt {
    Stmt::Block(BlockStmt {
        span: DUMMY_SP,
        ctxt: SyntaxContext::empty(),
        stmts: vec![stmt],
    })
}
