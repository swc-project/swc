//! Visit interfaces for `swc_es_ast`.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_es_ast::{
    AstStore, Class, ClassId, ClassMember, ClassMemberId, Decl, DeclId, Expr, ExprId, Function,
    FunctionId, JSXElement, JSXElementId, ModuleDecl, ModuleDeclId, Pat, PatId, Program, ProgramId,
    Stmt, StmtId, TsType, TsTypeId,
};

/// Immutable visitor over `swc_es_ast` nodes.
pub trait Visit {
    fn visit_program(&mut self, store: &AstStore, id: ProgramId) {
        walk_program(self, store, id);
    }

    fn visit_stmt(&mut self, store: &AstStore, id: StmtId) {
        walk_stmt(self, store, id);
    }

    fn visit_decl(&mut self, store: &AstStore, id: DeclId) {
        walk_decl(self, store, id);
    }

    fn visit_pat(&mut self, store: &AstStore, id: PatId) {
        walk_pat(self, store, id);
    }

    fn visit_expr(&mut self, store: &AstStore, id: ExprId) {
        walk_expr(self, store, id);
    }

    fn visit_module_decl(&mut self, store: &AstStore, id: ModuleDeclId) {
        walk_module_decl(self, store, id);
    }

    fn visit_function(&mut self, store: &AstStore, id: FunctionId) {
        walk_function(self, store, id);
    }

    fn visit_class(&mut self, store: &AstStore, id: ClassId) {
        walk_class(self, store, id);
    }

    fn visit_class_member(&mut self, store: &AstStore, id: ClassMemberId) {
        walk_class_member(self, store, id);
    }

    fn visit_jsx_element(&mut self, store: &AstStore, id: JSXElementId) {
        walk_jsx_element(self, store, id);
    }

    fn visit_ts_type(&mut self, store: &AstStore, id: TsTypeId) {
        walk_ts_type(self, store, id);
    }

    fn visit_program_node(&mut self, _store: &AstStore, _node: &Program) {}
    fn visit_stmt_node(&mut self, _store: &AstStore, _node: &Stmt) {}
    fn visit_decl_node(&mut self, _store: &AstStore, _node: &Decl) {}
    fn visit_pat_node(&mut self, _store: &AstStore, _node: &Pat) {}
    fn visit_expr_node(&mut self, _store: &AstStore, _node: &Expr) {}
    fn visit_module_decl_node(&mut self, _store: &AstStore, _node: &ModuleDecl) {}
    fn visit_function_node(&mut self, _store: &AstStore, _node: &Function) {}
    fn visit_class_node(&mut self, _store: &AstStore, _node: &Class) {}
    fn visit_class_member_node(&mut self, _store: &AstStore, _node: &ClassMember) {}
    fn visit_jsx_element_node(&mut self, _store: &AstStore, _node: &JSXElement) {}
    fn visit_ts_type_node(&mut self, _store: &AstStore, _node: &TsType) {}
}

/// Mutable visitor over `swc_es_ast` nodes.
///
/// This interface is intentionally minimal for the initial bootstrap.
pub trait VisitMut {
    fn visit_program_mut(&mut self, _store: &mut AstStore, _id: ProgramId) {}
    fn visit_stmt_mut(&mut self, _store: &mut AstStore, _id: StmtId) {}
    fn visit_decl_mut(&mut self, _store: &mut AstStore, _id: DeclId) {}
    fn visit_pat_mut(&mut self, _store: &mut AstStore, _id: PatId) {}
    fn visit_expr_mut(&mut self, _store: &mut AstStore, _id: ExprId) {}
    fn visit_module_decl_mut(&mut self, _store: &mut AstStore, _id: ModuleDeclId) {}
    fn visit_function_mut(&mut self, _store: &mut AstStore, _id: FunctionId) {}
    fn visit_class_mut(&mut self, _store: &mut AstStore, _id: ClassId) {}
    fn visit_class_member_mut(&mut self, _store: &mut AstStore, _id: ClassMemberId) {}
    fn visit_jsx_element_mut(&mut self, _store: &mut AstStore, _id: JSXElementId) {}
    fn visit_ts_type_mut(&mut self, _store: &mut AstStore, _id: TsTypeId) {}
}

/// Folding interface over `swc_es_ast` ids.
///
/// The default implementations are identity transforms.
pub trait Fold {
    fn fold_program(&mut self, _store: &mut AstStore, id: ProgramId) -> ProgramId {
        id
    }

    fn fold_stmt(&mut self, _store: &mut AstStore, id: StmtId) -> StmtId {
        id
    }

    fn fold_decl(&mut self, _store: &mut AstStore, id: DeclId) -> DeclId {
        id
    }

    fn fold_pat(&mut self, _store: &mut AstStore, id: PatId) -> PatId {
        id
    }

    fn fold_expr(&mut self, _store: &mut AstStore, id: ExprId) -> ExprId {
        id
    }

    fn fold_module_decl(&mut self, _store: &mut AstStore, id: ModuleDeclId) -> ModuleDeclId {
        id
    }

    fn fold_function(&mut self, _store: &mut AstStore, id: FunctionId) -> FunctionId {
        id
    }

    fn fold_class(&mut self, _store: &mut AstStore, id: ClassId) -> ClassId {
        id
    }

    fn fold_class_member(&mut self, _store: &mut AstStore, id: ClassMemberId) -> ClassMemberId {
        id
    }

    fn fold_jsx_element(&mut self, _store: &mut AstStore, id: JSXElementId) -> JSXElementId {
        id
    }

    fn fold_ts_type(&mut self, _store: &mut AstStore, id: TsTypeId) -> TsTypeId {
        id
    }
}

/// Helper trait to dispatch ids into a [`Visit`] implementation.
pub trait VisitWith {
    /// Visits the node with the provided visitor.
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V);
}

impl VisitWith for ProgramId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_program(store, *self);
    }
}

impl VisitWith for StmtId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_stmt(store, *self);
    }
}

impl VisitWith for DeclId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_decl(store, *self);
    }
}

impl VisitWith for PatId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_pat(store, *self);
    }
}

impl VisitWith for ExprId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_expr(store, *self);
    }
}

impl VisitWith for ModuleDeclId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_module_decl(store, *self);
    }
}

impl VisitWith for FunctionId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_function(store, *self);
    }
}

impl VisitWith for ClassId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_class(store, *self);
    }
}

impl VisitWith for ClassMemberId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_class_member(store, *self);
    }
}

impl VisitWith for JSXElementId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_jsx_element(store, *self);
    }
}

impl VisitWith for TsTypeId {
    fn visit_with<V: Visit>(&self, store: &AstStore, visitor: &mut V) {
        visitor.visit_ts_type(store, *self);
    }
}

/// Walks a program tree recursively.
pub fn walk_program<V>(visitor: &mut V, store: &AstStore, id: ProgramId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.program(id) else {
        return;
    };
    visitor.visit_program_node(store, node);
    for stmt in &node.body {
        visitor.visit_stmt(store, *stmt);
    }
}

/// Walks a statement tree recursively.
pub fn walk_stmt<V>(visitor: &mut V, store: &AstStore, id: StmtId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.stmt(id) else {
        return;
    };
    visitor.visit_stmt_node(store, node);

    match node {
        Stmt::Empty(_) => {}
        Stmt::Block(block) => {
            for child in &block.stmts {
                visitor.visit_stmt(store, *child);
            }
        }
        Stmt::Expr(expr_stmt) => visitor.visit_expr(store, expr_stmt.expr),
        Stmt::Return(ret) => {
            if let Some(arg) = ret.arg {
                visitor.visit_expr(store, arg);
            }
        }
        Stmt::If(if_stmt) => {
            visitor.visit_expr(store, if_stmt.test);
            visitor.visit_stmt(store, if_stmt.cons);
            if let Some(alt) = if_stmt.alt {
                visitor.visit_stmt(store, alt);
            }
        }
        Stmt::While(while_stmt) => {
            visitor.visit_expr(store, while_stmt.test);
            visitor.visit_stmt(store, while_stmt.body);
        }
        Stmt::For(for_stmt) => {
            match &for_stmt.head {
                swc_es_ast::ForHead::Classic(head) => {
                    if let Some(init) = &head.init {
                        match init {
                            swc_es_ast::ForInit::Decl(decl) => visitor.visit_decl(store, *decl),
                            swc_es_ast::ForInit::Expr(expr) => visitor.visit_expr(store, *expr),
                        }
                    }
                    if let Some(test) = head.test {
                        visitor.visit_expr(store, test);
                    }
                    if let Some(update) = head.update {
                        visitor.visit_expr(store, update);
                    }
                }
                swc_es_ast::ForHead::In(head) => {
                    match &head.left {
                        swc_es_ast::ForBinding::Decl(decl) => visitor.visit_decl(store, *decl),
                        swc_es_ast::ForBinding::Pat(pat) => visitor.visit_pat(store, *pat),
                        swc_es_ast::ForBinding::Expr(expr) => visitor.visit_expr(store, *expr),
                    }
                    visitor.visit_expr(store, head.right);
                }
                swc_es_ast::ForHead::Of(head) => {
                    match &head.left {
                        swc_es_ast::ForBinding::Decl(decl) => visitor.visit_decl(store, *decl),
                        swc_es_ast::ForBinding::Pat(pat) => visitor.visit_pat(store, *pat),
                        swc_es_ast::ForBinding::Expr(expr) => visitor.visit_expr(store, *expr),
                    }
                    visitor.visit_expr(store, head.right);
                }
            }
            visitor.visit_stmt(store, for_stmt.body);
        }
        Stmt::Decl(decl) => visitor.visit_decl(store, *decl),
        Stmt::ModuleDecl(module_decl) => visitor.visit_module_decl(store, *module_decl),
    }
}

/// Walks a declaration tree recursively.
pub fn walk_decl<V>(visitor: &mut V, store: &AstStore, id: DeclId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.decl(id) else {
        return;
    };
    visitor.visit_decl_node(store, node);

    match node {
        Decl::Var(var) => {
            for declarator in &var.declarators {
                visitor.visit_pat(store, declarator.name);
                if let Some(init) = declarator.init {
                    visitor.visit_expr(store, init);
                }
            }
        }
        Decl::Fn(function) => {
            for param in &function.params {
                visitor.visit_pat(store, *param);
            }
            for stmt in &function.body {
                visitor.visit_stmt(store, *stmt);
            }
        }
        Decl::TsTypeAlias(alias) => visitor.visit_ts_type(store, alias.ty),
    }
}

/// Walks a pattern tree recursively.
pub fn walk_pat<V>(visitor: &mut V, store: &AstStore, id: PatId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.pat(id) else {
        return;
    };
    visitor.visit_pat_node(store, node);

    match node {
        Pat::Ident(_) => {}
        Pat::Expr(expr) => visitor.visit_expr(store, *expr),
        Pat::Array(array_pat) => {
            for elem in array_pat.elems.iter().flatten() {
                visitor.visit_pat(store, *elem);
            }
        }
        Pat::Rest(rest) => visitor.visit_pat(store, rest.arg),
        Pat::Assign(assign) => {
            visitor.visit_pat(store, assign.left);
            visitor.visit_expr(store, assign.right);
        }
    }
}

/// Walks an expression tree recursively.
pub fn walk_expr<V>(visitor: &mut V, store: &AstStore, id: ExprId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.expr(id) else {
        return;
    };
    visitor.visit_expr_node(store, node);

    match node {
        Expr::Ident(_) | Expr::Lit(_) => {}
        Expr::Function(function) => visitor.visit_function(store, *function),
        Expr::Class(class) => visitor.visit_class(store, *class),
        Expr::JSXElement(jsx_element) => visitor.visit_jsx_element(store, *jsx_element),
        Expr::TsAs(ts_as) => {
            visitor.visit_expr(store, ts_as.expr);
            visitor.visit_ts_type(store, ts_as.ty);
        }
        Expr::Array(array) => {
            for elem in array.elems.iter().flatten() {
                visitor.visit_expr(store, elem.expr);
            }
        }
        Expr::Object(obj) => {
            for prop in &obj.props {
                visitor.visit_expr(store, prop.value);
                if let swc_es_ast::PropName::Computed(expr) = &prop.key {
                    visitor.visit_expr(store, *expr);
                }
            }
        }
        Expr::Unary(unary) => visitor.visit_expr(store, unary.arg),
        Expr::Binary(binary) => {
            visitor.visit_expr(store, binary.left);
            visitor.visit_expr(store, binary.right);
        }
        Expr::Assign(assign) => {
            visitor.visit_pat(store, assign.left);
            visitor.visit_expr(store, assign.right);
        }
        Expr::Call(call) => {
            visitor.visit_expr(store, call.callee);
            for arg in &call.args {
                visitor.visit_expr(store, arg.expr);
            }
        }
        Expr::Member(member) => {
            visitor.visit_expr(store, member.obj);
            if let swc_es_ast::MemberProp::Computed(prop) = &member.prop {
                visitor.visit_expr(store, *prop);
            }
        }
    }
}

/// Walks a module declaration recursively.
pub fn walk_module_decl<V>(visitor: &mut V, store: &AstStore, id: ModuleDeclId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.module_decl(id) else {
        return;
    };
    visitor.visit_module_decl_node(store, node);

    match node {
        ModuleDecl::Import(_) => {}
        ModuleDecl::ExportNamed(named) => {
            if let Some(decl) = named.decl {
                visitor.visit_decl(store, decl);
            }
        }
        ModuleDecl::ExportDefaultExpr(default_expr) => {
            visitor.visit_expr(store, default_expr.expr);
        }
        ModuleDecl::ExportDecl(export_decl) => visitor.visit_decl(store, export_decl.decl),
    }
}

/// Walks a function recursively.
pub fn walk_function<V>(visitor: &mut V, store: &AstStore, id: FunctionId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.function(id) else {
        return;
    };
    visitor.visit_function_node(store, node);

    for param in &node.params {
        visitor.visit_pat(store, param.pat);
    }
    for stmt in &node.body {
        visitor.visit_stmt(store, *stmt);
    }
}

/// Walks a class recursively.
pub fn walk_class<V>(visitor: &mut V, store: &AstStore, id: ClassId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.class(id) else {
        return;
    };
    visitor.visit_class_node(store, node);

    if let Some(super_class) = node.super_class {
        visitor.visit_expr(store, super_class);
    }
    for member in &node.body {
        visitor.visit_class_member(store, *member);
    }
}

/// Walks a class member recursively.
pub fn walk_class_member<V>(visitor: &mut V, store: &AstStore, id: ClassMemberId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.class_member(id) else {
        return;
    };
    visitor.visit_class_member_node(store, node);

    match node {
        ClassMember::Method(method) => visitor.visit_function(store, method.function),
        ClassMember::Prop(prop) => {
            if let Some(value) = prop.value {
                visitor.visit_expr(store, value);
            }
        }
    }
}

/// Walks a JSX element recursively.
pub fn walk_jsx_element<V>(visitor: &mut V, store: &AstStore, id: JSXElementId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.jsx_element(id) else {
        return;
    };
    visitor.visit_jsx_element_node(store, node);

    for child in &node.children {
        match child {
            swc_es_ast::JSXElementChild::Element(child) => visitor.visit_jsx_element(store, *child),
            swc_es_ast::JSXElementChild::Text(_) => {}
            swc_es_ast::JSXElementChild::Expr(expr) => visitor.visit_expr(store, *expr),
        }
    }
}

/// Walks a TypeScript type recursively.
pub fn walk_ts_type<V>(visitor: &mut V, store: &AstStore, id: TsTypeId)
where
    V: Visit + ?Sized,
{
    let Some(node) = store.ts_type(id) else {
        return;
    };
    visitor.visit_ts_type_node(store, node);

    match node {
        TsType::Keyword(_) | TsType::Lit(_) | TsType::TypeLit(_) => {}
        TsType::TypeRef(reference) => {
            for arg in &reference.type_args {
                visitor.visit_ts_type(store, *arg);
            }
        }
        TsType::Array(array) => visitor.visit_ts_type(store, array.elem_type),
        TsType::Tuple(tuple) => {
            for elem in &tuple.elem_types {
                visitor.visit_ts_type(store, *elem);
            }
        }
        TsType::Union(union) => {
            for elem in &union.types {
                visitor.visit_ts_type(store, *elem);
            }
        }
        TsType::Intersection(intersection) => {
            for elem in &intersection.types {
                visitor.visit_ts_type(store, *elem);
            }
        }
        TsType::Parenthesized(parenthesized) => visitor.visit_ts_type(store, parenthesized.ty),
        TsType::Fn(function) => {
            for param in &function.params {
                if let Some(ty) = param.ty {
                    visitor.visit_ts_type(store, ty);
                }
            }
            visitor.visit_ts_type(store, function.return_type);
        }
    }
}
