use std::collections::{HashMap, HashSet};
use std::mem;

use base64;
use indexmap::IndexSet;
use once_cell::sync::Lazy;
use regex::Regex;
use sha1::{Digest, Sha1};

use swc_atoms::JsWord;
use swc_common::BytePos;
use swc_common::{
    comments::Comments, comments::CommentsExt, sync::Lrc, SourceMap, Span, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{private_ident, quote_ident, quote_str};
use swc_ecma_visit::{Fold, FoldWith, Node, Visit};
use util::{
    callee_should_ignore, gen_custom_hook_record, is_body_arrow_fn, is_builtin_hook,
    is_import_or_require, make_assign_stmt, make_call_expr, make_call_stmt, CollectIdent,
};

pub mod options;
use options::RefreshOptions;
mod util;

#[cfg(test)]
mod tests;

struct Hoc {
    insert: bool,
    reg: Vec<(Ident, String)>,
    // use to register hook for all level of HOC, first is hook register ident
    // rest is hook register call args
    hook: Option<HocHook>,
}
struct HocHook {
    ident: ExprOrSuper,
    args: Vec<ExprOrSpread>,
}
enum Persist {
    Hoc(Hoc),
    Component(Ident),
    None,
}
fn get_persistent_id(ident: &Ident) -> Persist {
    if ident.sym.starts_with(|c: char| c.is_ascii_uppercase()) {
        Persist::Component(ident.clone())
    } else {
        Persist::None
    }
}

fn hook_to_handle_map(hook_fn: Vec<FnWithHook>) -> (HashMap<Ident, FnWithHook>, HashSet<Ident>) {
    let mut has_ident = HashMap::new();
    let mut ignore = HashSet::new();
    for hook in hook_fn {
        if let Some(binding) = &hook.binding {
            has_ident.insert(binding.clone(), hook);
        } else {
            ignore.insert(hook.handle);
        }
    }
    (has_ident, ignore)
}
// funtction that use hooks
struct FnWithHook {
    binding: Option<Ident>, // ident of function
    handle: Ident,          // varaible to register
    hook: Vec<Hook>,
}

struct Hook {
    name: Ident,
    callee: HookCall,
    key: String,
}

// we only consider two kinds of expr as hook call
enum HookCall {
    Ident(Ident),
    Member(Expr, Ident), // for obj and prop
}

/// `react-refresh/babel`
/// https://github.com/facebook/react/blob/master/packages/react-refresh/src/ReactFreshBabelPlugin.js
pub fn refresh<C: Comments>(
    dev: bool,
    options: Option<RefreshOptions>,
    cm: Lrc<SourceMap>,
    comments: Option<C>,
) -> impl Fold {
    Refresh {
        enable: dev && options.is_some(),
        cm,
        comments,
        should_reset: false,
        options: options.unwrap_or(Default::default()),
        used_in_jsx: HashSet::new(),
        curr_hook_fn: Vec::new(),
        scope_binding: IndexSet::new(),
    }
}

struct Refresh<C: Comments> {
    enable: bool,
    options: RefreshOptions,
    cm: Lrc<SourceMap>,
    should_reset: bool,
    used_in_jsx: HashSet<JsWord>,
    comments: Option<C>,
    curr_hook_fn: Vec<FnWithHook>,
    // bindings in current and all parent scope
    scope_binding: IndexSet<JsWord>,
}

static IS_HOOK_LIKE: Lazy<Regex> = Lazy::new(|| Regex::new("^use[A-Z]").unwrap());
impl<C: Comments> Refresh<C> {
    fn get_hook_from_call_expr(&self, expr: &CallExpr, lhs: Option<&Pat>) -> Option<Hook> {
        let callee = if let ExprOrSuper::Expr(callee) = &expr.callee {
            Some(callee.as_ref())
        } else {
            None
        }?;
        let mut hook_call = None;
        let ident = match callee {
            Expr::Ident(ident) => {
                hook_call = Some(HookCall::Ident(ident.clone()));
                Some(ident)
            }
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                prop,
                ..
            }) => {
                if let Expr::Ident(ident) = prop.as_ref() {
                    hook_call = Some(HookCall::Member(*obj.clone(), ident.clone()));
                    Some(ident)
                } else {
                    None
                }
            }
            _ => None,
        }?;
        let name = if IS_HOOK_LIKE.is_match(&ident.sym) {
            Some(ident.clone())
        } else {
            None
        }?;
        let mut key = if let Some(name) = lhs {
            self.cm
                .span_to_snippet(name.span())
                .unwrap_or("".to_string())
        } else {
            "".to_string()
        };
        // Some built-in Hooks reset on edits to arguments.
        if &name.sym == "useState" && expr.args.len() > 0 {
            // useState second argument is initial state.
            key += &format!(
                "({})",
                self.cm
                    .span_to_snippet(expr.args[0].span())
                    .unwrap_or("".to_string())
            );
        } else if &name.sym == "useReducer" && expr.args.len() > 1 {
            // useReducer second argument is initial state.
            key += &format!(
                "({})",
                self.cm
                    .span_to_snippet(expr.args[1].span())
                    .unwrap_or("".to_string())
            );
        }

        let callee = hook_call?;
        Some(Hook { name, callee, key })
    }
    fn get_hook_from_expr(&self, expr: &Expr, lhs: Option<&Pat>, reg: &mut Vec<Hook>) {
        match expr {
            Expr::Paren(ParenExpr { expr, .. }) => {
                if let Expr::Seq(SeqExpr { exprs, .. }) = expr.as_ref() {
                    for expr in exprs {
                        self.get_hook_from_expr(expr, lhs, reg);
                    }
                }
            }
            Expr::Seq(SeqExpr { exprs, .. }) => {
                for expr in exprs {
                    self.get_hook_from_expr(expr, lhs, reg);
                }
            }
            Expr::Call(expr) => {
                if let Some(hook) = self.get_hook_from_call_expr(expr, lhs) {
                    reg.push(hook);
                }
            }
            _ => (),
        }
    }
    fn get_hook_sign(&mut self, body: &mut BlockStmt) -> Option<FnWithHook> {
        let mut sign_res = Vec::new();
        for stmt in &body.stmts {
            match stmt {
                Stmt::Expr(ExprStmt { expr, .. }) => {
                    self.get_hook_from_expr(expr, None, &mut sign_res)
                }
                Stmt::Decl(Decl::Var(var_decl)) => {
                    for decl in &var_decl.decls {
                        if let Some(init) = &decl.init {
                            self.get_hook_from_expr(init, Some(&decl.name), &mut sign_res);
                        }
                    }
                }
                Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                    self.get_hook_from_expr(arg.as_ref(), None, &mut sign_res)
                }
                _ => {}
            }
        }
        // The signature call is split in two parts. One part is called inside the
        // function. This is used to signal when first render happens.
        if sign_res.len() != 0 {
            let handle = private_ident!("_s");
            body.stmts.insert(0, make_call_stmt(handle.clone()));
            Some(FnWithHook {
                binding: None,
                handle,
                hook: sign_res,
            })
        } else {
            None
        }
    }
    fn get_hook_sign_from_arrow(&mut self, body: &mut BlockStmtOrExpr) -> Option<FnWithHook> {
        match body {
            BlockStmtOrExpr::BlockStmt(stmt) => self.get_hook_sign(stmt),
            BlockStmtOrExpr::Expr(expr) => {
                let mut hook = Vec::new();
                self.get_hook_from_expr(expr, None, &mut hook);
                if hook.len() == 0 {
                    return None;
                }

                let mut block = BlockStmt {
                    span: expr.span(),
                    stmts: Vec::new(),
                };
                let handle = private_ident!("_s");
                block.stmts.push(make_call_stmt(handle.clone()));
                block.stmts.push(Stmt::Return(ReturnStmt {
                    span: expr.span(),
                    arg: Some(Box::new(expr.as_mut().take())),
                }));

                *body = BlockStmtOrExpr::BlockStmt(block);

                Some(FnWithHook {
                    binding: None,
                    handle,
                    hook,
                })
            }
        }
    }
    fn gen_hook_handle(&self, curr_hook_fn: &Vec<FnWithHook>) -> Stmt {
        let refresh_sig = self.options.refresh_sig.as_str();
        Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            decls: curr_hook_fn
                .iter()
                .map(|FnWithHook { ref handle, .. }| VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(BindingIdent::from(handle.clone())),
                    init: Some(Box::new(make_call_expr(quote_ident!(refresh_sig)))),
                    definite: false,
                })
                .collect(),
            declare: false,
        }))
    }
    // The second call is around the function itself. This is used to associate a
    // type with a signature.
    // Unlike with $RefreshReg$, this needs to work for nested declarations too.
    fn gen_hook_register(&self, func: Expr, hook_fn: &mut FnWithHook) -> Expr {
        let mut args = vec![func];
        let mut sign = Vec::new();
        let hooks = mem::replace(&mut hook_fn.hook, Vec::new());
        let mut custom_hook = Vec::new();

        for hook in hooks {
            sign.push(format!("{}{{{}}}", hook.name.sym, hook.key));
            match &hook.callee {
                HookCall::Ident(ident) if !is_builtin_hook(ident) => {
                    custom_hook.push(hook.callee);
                }
                HookCall::Member(obj, prop) if !is_builtin_hook(prop) => {
                    if let Expr::Ident(ident) = obj {
                        if ident.sym.as_ref() != "React" {
                            custom_hook.push(hook.callee);
                        }
                    }
                }
                _ => (),
            };
        }

        // this is just for pass test
        let has_escape = sign.len() > 1;
        let sign = sign.join("\n");
        let sign = if self.options.emit_full_signatures {
            sign
        } else {
            let mut hasher = Sha1::new();
            hasher.update(sign);
            base64::encode(hasher.finalize())
        };

        args.push(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: sign.into(),
            has_escape,
            kind: StrKind::Synthesized,
        })));

        let mut should_reset = self.should_reset;

        let mut custom_hook_in_scope = Vec::new();
        for hook in custom_hook {
            let ident = match &hook {
                HookCall::Ident(ident) => Some(ident),
                HookCall::Member(Expr::Ident(ident), _) => Some(ident),
                _ => None,
            };
            if let None = ident.and_then(|id| self.scope_binding.get(&id.sym)) {
                // We don't have anything to put in the array because Hook is out ofscope.
                // Since it could potentially have been edited, remount the component.
                should_reset = true;
            } else {
                custom_hook_in_scope.push(hook);
            }
        }

        if should_reset || custom_hook_in_scope.len() > 0 {
            args.push(Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: should_reset,
            })));
        }

        if custom_hook_in_scope.len() > 0 {
            let elems = custom_hook_in_scope
                .into_iter()
                .map(|hook| {
                    Some(ExprOrSpread {
                        spread: None,
                        expr: Box::new(match hook {
                            HookCall::Ident(ident) => Expr::Ident(ident),
                            HookCall::Member(obj, prop) => Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: ExprOrSuper::Expr(Box::new(obj)),
                                prop: Box::new(Expr::Ident(prop)),
                                computed: false,
                            }),
                        }),
                    })
                })
                .collect();
            args.push(gen_custom_hook_record(elems));
        }

        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: ExprOrSuper::Expr(Box::new(Expr::Ident(hook_fn.handle.clone()))),
            args: args
                .into_iter()
                .map(|arg| ExprOrSpread {
                    spread: None,
                    expr: Box::new(arg),
                })
                .collect(),
            type_args: None,
        })
    }
    fn gen_hook_register_stmt(&self, func: Expr, hook_fn: &mut FnWithHook) -> Stmt {
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(self.gen_hook_register(func, hook_fn)),
        })
    }

    fn get_persistent_id_from_var_decl(
        &self,
        var_decl: &mut VarDecl,
        ignore: &HashSet<Ident>,
    ) -> Persist {
        // We only handle the case when a single variable is declared
        if let [VarDeclarator {
            name: Pat::Ident(binding),
            init: Some(init_expr),
            ..
        }] = var_decl.decls.as_mut_slice()
        {
            if self.used_in_jsx.contains(&binding.id.sym) && !is_import_or_require(init_expr) {
                match init_expr.as_ref() {
                    // TaggedTpl is for something like styled.div`...`
                    Expr::Arrow(_) | Expr::Fn(_) | Expr::TaggedTpl(_) | Expr::Call(_) => {
                        return Persist::Component(binding.id.clone())
                    }
                    _ => (),
                }
            }

            if let Persist::Component(persistent_id) = get_persistent_id(&binding.id) {
                return match init_expr.as_mut() {
                    Expr::Fn(_) => Persist::Component(persistent_id),
                    Expr::Arrow(ArrowExpr { body, .. }) => {
                        // Ignore complex function expressions like
                        // let Foo = () => () => {}
                        if is_body_arrow_fn(body) {
                            Persist::None
                        } else {
                            Persist::Component(persistent_id)
                        }
                    }
                    // Maybe a HOC.
                    Expr::Call(call_expr) => self.get_persistent_id_from_possible_hoc(
                        call_expr,
                        vec![(private_ident!("_c"), persistent_id.sym.to_string())],
                        ignore,
                    ),
                    _ => Persist::None,
                };
            }
        }
        Persist::None
    }
    fn get_persistent_id_from_possible_hoc(
        &self,
        call_expr: &mut CallExpr,
        mut reg: Vec<(Ident, String)>,
        // sadly unlike orignal implent our transform for component happens before hook
        // so we should just ignore hook register
        ignore: &HashSet<Ident>,
    ) -> Persist {
        if let Some(ident) = callee_should_ignore(ignore, &call_expr.callee) {
            // there's at least one item in reg
            return if reg.len() > 1 {
                let args = call_expr.args[1..].to_vec();
                Persist::Hoc(Hoc {
                    reg,
                    insert: true,
                    hook: Some(HocHook { ident, args }),
                })
            } else {
                Persist::None
            };
        };
        let first_arg = match call_expr.args.as_mut_slice() {
            [first, ..] => &mut first.expr,
            _ => return Persist::None,
        };
        let callee = if let ExprOrSuper::Expr(expr) = &call_expr.callee {
            expr
        } else {
            return Persist::None;
        };
        let hoc_name = match callee.as_ref() {
            Expr::Ident(fn_name) => fn_name.sym.to_string(),
            // original react implement use `getSource` so we just follow them
            Expr::Member(member) => self.cm.span_to_snippet(member.span).unwrap(),
            _ => return Persist::None,
        };
        let reg_str = reg.last().unwrap().1.clone() + "$" + &hoc_name;
        match first_arg.as_mut() {
            Expr::Call(expr) => {
                let reg_ident = private_ident!("_c");
                reg.push((reg_ident.clone(), reg_str));
                if let Persist::Hoc(hoc) =
                    self.get_persistent_id_from_possible_hoc(expr, reg, ignore)
                {
                    *first_arg = Box::new(make_assign_stmt(reg_ident.clone(), first_arg.take()));
                    if let Some(hook) = &hoc.hook {
                        let span = call_expr.span;
                        let first = ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Call(call_expr.take())),
                        };
                        let mut args = vec![first];
                        args.extend(hook.args.clone());
                        *call_expr = CallExpr {
                            span,
                            callee: hook.ident.clone(),
                            args,
                            type_args: None,
                        };
                    }

                    Persist::Hoc(hoc)
                } else {
                    return Persist::None;
                }
            }
            Expr::Fn(_) | Expr::Arrow(_) => {
                let reg_ident = private_ident!("_c");
                *first_arg = Box::new(make_assign_stmt(reg_ident.clone(), first_arg.take()));
                reg.push((reg_ident, reg_str));
                Persist::Hoc(Hoc {
                    reg,
                    insert: true,
                    hook: None,
                })
            }
            // export default hoc(Foo)
            // const X = hoc(Foo)
            Expr::Ident(ident) => {
                if let Persist::Component(_) = get_persistent_id(ident) {
                    Persist::Hoc(Hoc {
                        reg,
                        insert: true,
                        hook: None,
                    })
                } else {
                    Persist::None
                }
            }
            _ => Persist::None,
        }
    }
}

impl<C> Visit for Refresh<C>
where
    C: Comments,
{
    fn visit_span(&mut self, n: &Span, _: &dyn Node) {
        if self.should_reset {
            return;
        }

        let mut should_refresh = self.should_reset;
        if let Some(comments) = &self.comments {
            if n.hi != BytePos(0) {
                comments.with_leading(n.hi - BytePos(1), |comments| {
                    if comments.iter().any(|c| c.text.contains("@refresh reset")) {
                        should_refresh = true
                    }
                });
            }

            comments.with_trailing(n.lo, |comments| {
                if comments.iter().any(|c| c.text.contains("@refresh reset")) {
                    should_refresh = true
                }
            });
        }

        self.should_reset = should_refresh;
    }
}

// We let user do /* @refresh reset */ to reset state in the whole file.
impl<C: Comments> Fold for Refresh<C> {
    fn fold_jsx_opening_element(&mut self, n: JSXOpeningElement) -> JSXOpeningElement {
        if let JSXElementName::Ident(ident) = &n.name {
            self.used_in_jsx.insert(ident.sym.clone());
        }
        n
    }

    fn fold_call_expr(&mut self, n: CallExpr) -> CallExpr {
        let n = n.fold_children_with(self);

        if let ExprOrSuper::Expr(expr) = &n.callee {
            let ident = match expr.as_ref() {
                Expr::Ident(ident) => ident,
                Expr::Member(MemberExpr { prop, .. }) => {
                    if let Expr::Ident(ident) = prop.as_ref() {
                        ident
                    } else {
                        return n;
                    }
                }
                _ => return n,
            };
            match ident.sym.as_ref() {
                "createElement" | "jsx" | "jsxDEV" | "jsxs" => {
                    let ExprOrSpread { expr, .. } = &n.args[0];
                    if let Expr::Ident(ident) = expr.as_ref() {
                        self.used_in_jsx.insert(ident.sym.clone());
                    }
                }
                _ => (),
            }
        }
        n
    }

    fn fold_fn_decl(&mut self, n: FnDecl) -> FnDecl {
        let mut n = n.fold_children_with(self);

        if let Some(mut hook) = n
            .function
            .body
            .as_mut()
            .and_then(|body| self.get_hook_sign(body))
        {
            hook.binding = Some(n.ident.clone());
            self.curr_hook_fn.push(hook);
        }

        n
    }

    fn fold_default_decl(&mut self, n: DefaultDecl) -> DefaultDecl {
        let mut n = n.fold_children_with(self);

        // arrow function is handled in fold_expr
        if let DefaultDecl::Fn(FnExpr {
            // original implent somehow doesn't handle unnamed default export either
            ident: Some(ident),
            function: Function {
                body: Some(body), ..
            },
        }) = &mut n
        {
            if let Some(mut hook) = self.get_hook_sign(body) {
                hook.binding = Some(ident.clone());
                self.curr_hook_fn.push(hook);
            }
        }

        n
    }

    fn fold_var_decl(&mut self, n: VarDecl) -> VarDecl {
        let VarDecl {
            span,
            kind,
            declare,
            decls,
        } = n;

        // we don't want fold_expr to mess up with function name inference
        // so intercept it here
        let decls = decls
            .into_iter()
            .map(|decl| match decl {
                VarDeclarator {
                    span,
                    // it doesn't quite make sense for other Pat to appear here
                    name: Pat::Ident(BindingIdent { id, type_ann }),
                    init: Some(init),
                    definite,
                } => {
                    let init = match *init {
                        Expr::Fn(mut expr) => {
                            if let Some(mut hook) = expr
                                .function
                                .body
                                .as_mut()
                                .and_then(|body| self.get_hook_sign(body))
                            {
                                hook.binding = Some(id.clone());
                                self.curr_hook_fn.push(hook);
                            }
                            Expr::Fn(expr.fold_children_with(self))
                        }
                        Expr::Arrow(mut expr) => {
                            if let Some(mut hook) = self.get_hook_sign_from_arrow(&mut expr.body) {
                                hook.binding = Some(id.clone());
                                self.curr_hook_fn.push(hook);
                            }
                            Expr::Arrow(expr.fold_children_with(self))
                        }
                        _ => self.fold_expr(*init),
                    };
                    VarDeclarator {
                        span,
                        name: Pat::Ident(BindingIdent { id, type_ann }),
                        init: Some(Box::new(init)),
                        definite,
                    }
                }
                _ => decl.fold_children_with(self),
            })
            .collect();

        VarDecl {
            span,
            kind,
            declare,
            decls,
        }
    }

    fn fold_expr(&mut self, n: Expr) -> Expr {
        let n = n.fold_children_with(self);

        match n {
            Expr::Fn(mut func) => {
                if let Some(mut hook) = func
                    .function
                    .body
                    .as_mut()
                    .and_then(|body| self.get_hook_sign(body))
                {
                    // I don't believe many people would use it, but anyway
                    let mut should_remove = false;
                    if let Some(ident) = &func.ident {
                        self.scope_binding.insert(ident.sym.clone());
                        should_remove = true;
                    };
                    let reg = self.gen_hook_register(Expr::Fn(func), &mut hook);
                    if should_remove {
                        self.scope_binding.truncate(self.scope_binding.len() - 1);
                    };
                    self.curr_hook_fn.push(hook);
                    reg
                } else {
                    Expr::Fn(func)
                }
            }
            Expr::Arrow(mut func) => {
                if let Some(mut hook) = self.get_hook_sign_from_arrow(&mut func.body) {
                    let reg = self.gen_hook_register(Expr::Arrow(func), &mut hook);
                    self.curr_hook_fn.push(hook);
                    reg
                } else {
                    Expr::Arrow(func)
                }
            }
            Expr::Call(call) => Expr::Call(call),
            _ => n,
        }
    }

    fn fold_block_stmt(&mut self, n: BlockStmt) -> BlockStmt {
        let mut current_scope = IndexSet::new();

        for stmt in &n.stmts {
            stmt.collect_ident(&mut current_scope);
        }
        let orig_bindinga = self.scope_binding.len();
        self.scope_binding.extend(current_scope.into_iter());

        let orig_hook = mem::replace(&mut self.curr_hook_fn, Vec::new());
        let mut n = n.fold_children_with(self);
        let curr_hook = mem::replace(&mut self.curr_hook_fn, orig_hook);
        self.scope_binding.truncate(orig_bindinga);

        if curr_hook.len() > 0 {
            let stmt_count = n.stmts.len();
            let stmts = mem::replace(&mut n.stmts, Vec::with_capacity(stmt_count));
            n.stmts.push(self.gen_hook_handle(&curr_hook));
            let (mut handle_map, _) = hook_to_handle_map(curr_hook);

            for stmt in stmts {
                let mut reg = Vec::new();
                match &stmt {
                    Stmt::Decl(Decl::Fn(FnDecl { ident, .. })) => {
                        if let Some(hook) = handle_map.remove(ident) {
                            reg.push((ident.clone(), hook));
                        }
                    }
                    Stmt::Decl(Decl::Var(VarDecl { decls, .. })) => {
                        for decl in decls {
                            if let Pat::Ident(BindingIdent { id, .. }) = &decl.name {
                                if let Some(hook) = handle_map.remove(id) {
                                    reg.push((id.clone(), hook));
                                }
                            }
                        }
                    }
                    _ => (),
                };
                n.stmts.push(stmt);
                if reg.len() > 0 {
                    for (ident, mut hook) in reg {
                        n.stmts
                            .push(self.gen_hook_register_stmt(Expr::Ident(ident), &mut hook));
                    }
                }
            }
        }

        n
    }

    fn fold_module_items(&mut self, module_items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        if !self.enable {
            return module_items;
        }

        self.visit_module_items(&module_items, &Invalid { span: DUMMY_SP } as _);

        for item in &module_items {
            item.collect_ident(&mut self.scope_binding);
        }

        let module_items = module_items.fold_children_with(self);

        let mut items = Vec::with_capacity(module_items.len());
        let mut refresh_regs = Vec::<(Ident, String)>::new();

        if self.curr_hook_fn.len() > 0 {
            items.push(ModuleItem::Stmt(self.gen_hook_handle(&self.curr_hook_fn)));
        }

        let curr_hook_fn = mem::replace(&mut self.curr_hook_fn, Vec::new());
        let (mut handle_map, ignore) = hook_to_handle_map(curr_hook_fn);

        for mut item in module_items {
            let mut hook_reg = Vec::new();

            let persistent_id = match &mut item {
                // function Foo() {}
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl { ident, .. }))) => {
                    if let Some(hook) = handle_map.remove(&ident) {
                        hook_reg.push((ident.clone(), hook));
                    }
                    get_persistent_id(ident)
                }

                // export function Foo() {}
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(FnDecl { ident, .. }),
                    ..
                })) => {
                    if let Some(hook) = handle_map.remove(&ident) {
                        hook_reg.push((ident.clone(), hook));
                    }
                    get_persistent_id(ident)
                }

                // export default function Foo() {}
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Fn(FnExpr {
                            // We don't currently handle anonymous default exports.
                            ident: Some(ident),
                            ..
                        }),
                    ..
                })) => {
                    if let Some(hook) = handle_map.remove(&ident) {
                        hook_reg.push((ident.clone(), hook));
                    };
                    get_persistent_id(ident)
                }

                // const Foo = () => {}
                // export const Foo = () => {}
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(var_decl),
                    ..
                })) => {
                    for decl in &var_decl.decls {
                        if let Pat::Ident(BindingIdent { id, .. }) = &decl.name {
                            if let Some(hook) = handle_map.remove(&id) {
                                hook_reg.push((id.clone(), hook));
                            }
                        }
                    }
                    self.get_persistent_id_from_var_decl(var_decl, &ignore)
                }

                // This code path handles nested cases like:
                // export default memo(() => {})
                // In those cases it is more plausible people will omit names
                // so they're worth handling despite possible false positives.
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    expr,
                    span,
                })) => {
                    if let Expr::Call(call) = expr.as_mut() {
                        if let Persist::Hoc(Hoc { reg, .. }) = self
                            .get_persistent_id_from_possible_hoc(
                                call,
                                vec![((private_ident!("_c"), "%default%".to_string()))],
                                &ignore,
                            )
                        {
                            item = ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                                ExportDefaultExpr {
                                    expr: Box::new(make_assign_stmt(reg[0].0.clone(), expr.take())),
                                    span: span.clone(),
                                },
                            ));
                            Persist::Hoc(Hoc {
                                insert: false,
                                reg,
                                hook: None,
                            })
                        } else {
                            Persist::None
                        }
                    } else {
                        Persist::None
                    }
                }

                _ => Persist::None,
            };

            items.push(item);

            for (ident, mut hook) in hook_reg {
                items.push(ModuleItem::Stmt(
                    self.gen_hook_register_stmt(Expr::Ident(ident), &mut hook),
                ))
            }

            match persistent_id {
                Persist::None => (),
                Persist::Component(persistent_id) => {
                    let registration_handle = private_ident!("_c");

                    refresh_regs.push((registration_handle.clone(), persistent_id.sym.to_string()));

                    items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(make_assign_stmt(
                            registration_handle,
                            Box::new(Expr::Ident(persistent_id)),
                        )),
                    })));
                }

                Persist::Hoc(mut hoc) => {
                    hoc.reg = hoc.reg.into_iter().rev().collect();
                    if hoc.insert {
                        let (ident, name) = hoc.reg.last().unwrap();
                        items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(make_assign_stmt(
                                ident.clone(),
                                Box::new(Expr::Ident(quote_ident!(name.clone()))),
                            )),
                        })))
                    }
                    refresh_regs.append(&mut hoc.reg);
                }
            }
        }

        // Insert
        // ```
        // var _c, _c1;
        // ```
        if refresh_regs.len() > 0 {
            items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: refresh_regs
                    .iter()
                    .map(|(handle, _)| VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(BindingIdent::from(handle.clone())),
                        init: None,
                        definite: false,
                    })
                    .collect(),
            }))));
        }

        // Insert
        // ```
        // $RefreshReg$(_c, "Hello");
        // $RefreshReg$(_c1, "Foo");
        // ```
        let refresh_reg = self.options.refresh_reg.as_str();
        for (handle, persistent_id) in refresh_regs {
            items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: ExprOrSuper::Expr(Box::new(Expr::Ident(quote_ident!(refresh_reg)))),
                    args: vec![
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Ident(handle)),
                        },
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Lit(Lit::Str(quote_str!(persistent_id)))),
                        },
                    ],
                    type_args: None,
                })),
            })));
        }

        items
    }
}
