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
        Stmt::DoWhile(do_while) => {
            visitor.visit_stmt(store, do_while.body);
            visitor.visit_expr(store, do_while.test);
        }
        Stmt::Switch(switch_stmt) => {
            visitor.visit_expr(store, switch_stmt.discriminant);
            for case in &switch_stmt.cases {
                if let Some(test) = case.test {
                    visitor.visit_expr(store, test);
                }
                for stmt in &case.cons {
                    visitor.visit_stmt(store, *stmt);
                }
            }
        }
        Stmt::Try(try_stmt) => {
            visitor.visit_stmt(store, try_stmt.block);
            if let Some(handler) = &try_stmt.handler {
                if let Some(param) = handler.param {
                    visitor.visit_pat(store, param);
                }
                visitor.visit_stmt(store, handler.body);
            }
            if let Some(finalizer) = try_stmt.finalizer {
                visitor.visit_stmt(store, finalizer);
            }
        }
        Stmt::Throw(throw_stmt) => visitor.visit_expr(store, throw_stmt.arg),
        Stmt::With(with_stmt) => {
            visitor.visit_expr(store, with_stmt.obj);
            visitor.visit_stmt(store, with_stmt.body);
        }
        Stmt::Break(_) | Stmt::Continue(_) | Stmt::Debugger(_) => {}
        Stmt::Labeled(labeled) => visitor.visit_stmt(store, labeled.body),
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
        Decl::Class(class_decl) => visitor.visit_class(store, class_decl.class),
        Decl::TsInterface(interface_decl) => {
            for member in &interface_decl.body {
                walk_ts_type_member(visitor, store, member);
            }
        }
        Decl::TsEnum(enum_decl) => {
            for member in &enum_decl.members {
                if let Some(init) = member.init {
                    visitor.visit_expr(store, init);
                }
            }
        }
        Decl::TsModule(module_decl) => {
            if let Some(body) = &module_decl.body {
                walk_ts_namespace_body(visitor, store, body);
            }
        }
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
        Pat::Object(object_pat) => {
            for prop in &object_pat.props {
                match prop {
                    swc_es_ast::ObjectPatProp::KeyValue(key_value) => {
                        if let swc_es_ast::PropName::Computed(expr) = &key_value.key {
                            visitor.visit_expr(store, *expr);
                        }
                        visitor.visit_pat(store, key_value.value);
                    }
                    swc_es_ast::ObjectPatProp::Assign(assign) => {
                        if let Some(value) = assign.value {
                            visitor.visit_expr(store, value);
                        }
                    }
                    swc_es_ast::ObjectPatProp::Rest(rest) => {
                        visitor.visit_pat(store, rest.arg);
                    }
                }
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
        Expr::Ident(_) | Expr::Lit(_) | Expr::MetaProp(_) => {}
        Expr::Function(function) => visitor.visit_function(store, *function),
        Expr::Class(class) => visitor.visit_class(store, *class),
        Expr::JSXElement(jsx_element) => visitor.visit_jsx_element(store, *jsx_element),
        Expr::TsAs(ts_as) => {
            visitor.visit_expr(store, ts_as.expr);
            visitor.visit_ts_type(store, ts_as.ty);
        }
        Expr::TsNonNull(ts_non_null) => {
            visitor.visit_expr(store, ts_non_null.expr);
        }
        Expr::TsSatisfies(ts_satisfies) => {
            visitor.visit_expr(store, ts_satisfies.expr);
            visitor.visit_ts_type(store, ts_satisfies.ty);
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
            match &member.prop {
                swc_es_ast::MemberProp::Computed(prop) => visitor.visit_expr(store, *prop),
                swc_es_ast::MemberProp::Ident(_) | swc_es_ast::MemberProp::Private(_) => {}
            }
        }
        Expr::Cond(cond) => {
            visitor.visit_expr(store, cond.test);
            visitor.visit_expr(store, cond.cons);
            visitor.visit_expr(store, cond.alt);
        }
        Expr::Seq(seq) => {
            for expr in &seq.exprs {
                visitor.visit_expr(store, *expr);
            }
        }
        Expr::New(new_expr) => {
            visitor.visit_expr(store, new_expr.callee);
            for arg in &new_expr.args {
                visitor.visit_expr(store, arg.expr);
            }
        }
        Expr::Update(update) => visitor.visit_expr(store, update.arg),
        Expr::Await(await_expr) => visitor.visit_expr(store, await_expr.arg),
        Expr::Arrow(arrow) => {
            for param in &arrow.params {
                visitor.visit_pat(store, *param);
            }
            match &arrow.body {
                swc_es_ast::ArrowBody::Expr(expr) => visitor.visit_expr(store, *expr),
                swc_es_ast::ArrowBody::Block(stmts) => {
                    for stmt in stmts {
                        visitor.visit_stmt(store, *stmt);
                    }
                }
            }
        }
        Expr::Template(template) => {
            for expr in &template.exprs {
                visitor.visit_expr(store, *expr);
            }
        }
        Expr::Yield(yield_expr) => {
            if let Some(arg) = yield_expr.arg {
                visitor.visit_expr(store, arg);
            }
        }
        Expr::TaggedTemplate(tagged) => {
            visitor.visit_expr(store, tagged.tag);
            for expr in &tagged.template.exprs {
                visitor.visit_expr(store, *expr);
            }
        }
        Expr::OptChain(chain) => visitor.visit_expr(store, chain.base),
        Expr::Paren(paren) => visitor.visit_expr(store, paren.expr),
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
        ModuleDecl::Import(import_decl) => {
            for attr in &import_decl.with {
                match &attr.key {
                    swc_es_ast::ImportAttributeName::Ident(_) => {}
                    swc_es_ast::ImportAttributeName::Str(_) => {}
                }
            }
        }
        ModuleDecl::ExportNamed(named) => {
            if let Some(decl) = named.decl {
                visitor.visit_decl(store, decl);
            }
        }
        ModuleDecl::ExportDefaultExpr(default_expr) => {
            visitor.visit_expr(store, default_expr.expr);
        }
        ModuleDecl::ExportDefaultDecl(default_decl) => visitor.visit_decl(store, default_decl.decl),
        ModuleDecl::ExportAll(_) => {}
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
        for decorator in &param.decorators {
            visitor.visit_expr(store, decorator.expr);
        }
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

    for decorator in &node.decorators {
        visitor.visit_expr(store, decorator.expr);
    }

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
        ClassMember::Method(method) => {
            for decorator in &method.decorators {
                visitor.visit_expr(store, decorator.expr);
            }
            if let swc_es_ast::PropName::Computed(expr) = &method.key {
                visitor.visit_expr(store, *expr);
            }
            visitor.visit_function(store, method.function);
        }
        ClassMember::Prop(prop) => {
            for decorator in &prop.decorators {
                visitor.visit_expr(store, decorator.expr);
            }
            if let swc_es_ast::PropName::Computed(expr) = &prop.key {
                visitor.visit_expr(store, *expr);
            }
            if let Some(value) = prop.value {
                visitor.visit_expr(store, value);
            }
        }
        ClassMember::StaticBlock(block) => {
            for stmt in &block.body {
                visitor.visit_stmt(store, *stmt);
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
        TsType::Keyword(_) | TsType::Lit(_) => {}
        TsType::TypeLit(type_lit) => {
            for member in &type_lit.members {
                walk_ts_type_member(visitor, store, member);
            }
        }
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
        TsType::Conditional(conditional) => {
            visitor.visit_ts_type(store, conditional.check_type);
            visitor.visit_ts_type(store, conditional.extends_type);
            visitor.visit_ts_type(store, conditional.true_type);
            visitor.visit_ts_type(store, conditional.false_type);
        }
        TsType::IndexedAccess(indexed) => {
            visitor.visit_ts_type(store, indexed.obj_type);
            visitor.visit_ts_type(store, indexed.index_type);
        }
        TsType::TypeOperator(operator) => visitor.visit_ts_type(store, operator.ty),
        TsType::Infer(_) => {}
        TsType::Import(import_type) => {
            for arg in &import_type.type_args {
                visitor.visit_ts_type(store, *arg);
            }
        }
        TsType::TypeQuery(type_query) => {
            for arg in &type_query.type_args {
                visitor.visit_ts_type(store, *arg);
            }
        }
        TsType::Mapped(mapped) => {
            visitor.visit_ts_type(store, mapped.constraint);
            if let Some(ty) = mapped.ty {
                visitor.visit_ts_type(store, ty);
            }
        }
    }
}

fn walk_ts_namespace_body<V>(visitor: &mut V, store: &AstStore, body: &swc_es_ast::TsNamespaceBody)
where
    V: Visit + ?Sized,
{
    match body {
        swc_es_ast::TsNamespaceBody::ModuleBlock(stmts) => {
            for stmt in stmts {
                visitor.visit_stmt(store, *stmt);
            }
        }
        swc_es_ast::TsNamespaceBody::Namespace(namespace_decl) => {
            walk_ts_namespace_body(visitor, store, &namespace_decl.body);
        }
    }
}

fn walk_ts_type_member<V>(visitor: &mut V, store: &AstStore, member: &swc_es_ast::TsTypeMember)
where
    V: Visit + ?Sized,
{
    if let Some(swc_es_ast::PropName::Computed(expr)) = &member.name {
        visitor.visit_expr(store, *expr);
    }
    for param in &member.params {
        if let Some(ty) = param.ty {
            visitor.visit_ts_type(store, ty);
        }
    }
    if let Some(ty) = member.ty {
        visitor.visit_ts_type(store, ty);
    }
}
