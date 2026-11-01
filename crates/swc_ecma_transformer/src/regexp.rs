use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_compat_regexp::transform_unicode_property_escapes;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_regexp::{
    ast::{Disjunction, IndexedReference, Term},
    LiteralParser, Options as RegexpOptions,
};
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{quote_ident, ExprFactory, IsDirective};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::TraverseCtx;

/// If true, the syntax will be transformed.
#[derive(Debug, Default)]
#[non_exhaustive]
pub struct RegExpOptions {
    /// [s/dotAll flag for regular expressions](https://tc39.github.io/proposal-regexp-dotall-flag/)
    pub dot_all_regex: bool,
    /// [RegExp.prototype.hasIndices](https://262.ecma-international.org/13.0/#sec-get-regexp.prototype.hasIndices)
    pub has_indices: bool,
    /// [RegExp Lookbehind Assertions](https://tc39.es/proposal-regexp-lookbehind/)
    pub lookbehind_assertion: bool,
    /// [Named capture groups in regular expressions](https://tc39.es/proposal-regexp-named-groups/)
    pub named_capturing_groups_regex: bool,
    /// [RegExp.prototype.sticky](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.sticky)
    pub sticky_regex: bool,
    /// [Unicode property escapes in regular expressions](https://tc39.es/proposal-regexp-unicode-property-escapes/)
    pub unicode_property_regex: bool,
    /// [RegExp.prototype.unicode](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.unicode)
    pub unicode_regex: bool,
    // [RegExp.prototype.unicodeSets](https://github.com/tc39/proposal-regexp-v-flag)
    pub unicode_sets_regex: bool,
}

impl RegExpOptions {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.dot_all_regex
            || self.has_indices
            || self.lookbehind_assertion
            || self.named_capturing_groups_regex
            || self.sticky_regex
            || self.unicode_property_regex
            || self.unicode_regex
            || self.unicode_sets_regex
    }
}

/// Determines how the pass recognizes the global `RegExp`.
#[derive(Clone, Copy)]
pub(crate) enum GlobalRegExp {
    ByName,
    Unresolved(SyntaxContext),
}

pub(crate) fn hook(
    options: RegExpOptions,
    global_regexp: GlobalRegExp,
) -> Option<impl VisitMutHook<TraverseCtx>> {
    if options.dot_all_regex
        || options.has_indices
        || options.lookbehind_assertion
        || options.named_capturing_groups_regex
        || options.sticky_regex
        || options.unicode_property_regex
        || options.unicode_regex
        || options.unicode_sets_regex
    {
        Some(RegexpPass::new(options, global_regexp))
    } else {
        None
    }
}

pub(crate) fn pass(options: RegExpOptions) -> impl Pass {
    visit_mut_pass(RegexpPass::new(options, GlobalRegExp::ByName))
}

struct RegexpPass {
    options: RegExpOptions,
    global_regexp: GlobalRegExp,
    strict: bool,
    constants: FxHashMap<Id, Box<Expr>>,
}

impl RegexpPass {
    fn new(options: RegExpOptions, global_regexp: GlobalRegExp) -> Self {
        Self {
            options,
            global_regexp,
            strict: false,
            constants: Default::default(),
        }
    }

    /// Clears the constants of the previous program and checks whether
    /// `program` is strict code.
    fn reset(&mut self, program: &Program) {
        self.constants.clear();
        self.strict = match program {
            Program::Module(_) => true,
            Program::Script(script) => script
                .body
                .iter()
                .take_while(|stmt| stmt.directive_continue())
                .any(|stmt| stmt.is_use_strict()),
        };
    }

    /// Records the `const` declarations directly in `items`.
    fn record_module_items(&mut self, items: &[ModuleItem]) {
        for item in items {
            if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(decl),
                ..
            })) = item
            {
                self.record_var_decl(decl);
            }
        }
    }

    /// Records the `const` declarations directly in `stmts`.
    fn record_stmts(&mut self, stmts: &[Stmt]) {
        for stmt in stmts {
            if let Stmt::Decl(Decl::Var(decl)) = stmt {
                self.record_var_decl(decl);
            }
        }
    }

    /// Records the initializers of `decl` that may fold to a string if it is a
    /// `const` declaration in strict code.
    fn record_var_decl(&mut self, decl: &VarDecl) {
        if !self.options.unicode_property_regex || !self.strict || decl.kind != VarDeclKind::Const {
            return;
        }
        for declarator in &decl.decls {
            let (Pat::Ident(name), Some(init)) = (&declarator.name, &declarator.init) else {
                continue;
            };
            if name.ctxt == SyntaxContext::empty() {
                continue;
            }
            if is_foldable(init) {
                self.constants.insert(name.to_id(), init.clone());
            }
        }
    }

    /// Evaluates `expr` to a string made of string literals, template
    /// literals, `+` and recorded constants.
    fn fold(
        &self,
        expr: &Expr,
        folding: &mut Vec<Id>,
        direct_reads: &mut Vec<Ident>,
    ) -> Option<String> {
        match expr {
            Expr::Lit(Lit::Str(lit)) => lit.value.as_str().map(str::to_owned),
            Expr::Tpl(tpl) => {
                let mut value = String::new();
                for (index, quasi) in tpl.quasis.iter().enumerate() {
                    value.push_str(quasi.cooked.as_ref()?.as_str()?);
                    if let Some(expr) = tpl.exprs.get(index) {
                        value.push_str(&self.fold(expr, folding, direct_reads)?);
                    }
                }
                Some(value)
            }
            Expr::Bin(BinExpr {
                op: op!(bin, "+"),
                left,
                right,
                ..
            }) => {
                let mut value = self.fold(left, folding, direct_reads)?;
                value.push_str(&self.fold(right, folding, direct_reads)?);
                Some(value)
            }
            Expr::Paren(ParenExpr { expr, .. }) => self.fold(expr, folding, direct_reads),
            Expr::Ident(ident) => {
                let id = ident.to_id();
                if folding.contains(&id) {
                    return None;
                }
                let init = self.constants.get(&id)?;
                if folding.is_empty() && !direct_reads.iter().any(|read| read.to_id() == id) {
                    direct_reads.push(ident.clone());
                }
                folding.push(id);
                let value = self.fold(init, folding, direct_reads);
                folding.pop();
                value
            }
            _ => None,
        }
    }

    /// Returns whether `callee` refers to the global `RegExp`.
    fn is_global_regexp(&self, callee: &Expr) -> bool {
        let Expr::Ident(ident) = callee else {
            return false;
        };
        ident.sym == "RegExp"
            && match self.global_regexp {
                GlobalRegExp::ByName => true,
                GlobalRegExp::Unresolved(unresolved_ctxt) => {
                    ident.ctxt == unresolved_ctxt || ident.ctxt == SyntaxContext::empty()
                }
            }
    }

    /// Transform the regex pattern if it contains unicode property escapes.
    /// Returns the transformed pattern string.
    fn transform_pattern(&self, pattern: &str, flags: &str) -> Option<String> {
        // Only transform if unicode_property_regex is enabled and pattern contains
        // \p{ or \P{
        if !self.options.unicode_property_regex {
            return None;
        }
        if !pattern.contains("\\p{") && !pattern.contains("\\P{") {
            return None;
        }

        // Parse the regex pattern
        let mut ast = LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
            .ok()?;

        // Transform unicode property escapes
        transform_unicode_property_escapes(&mut ast);

        // Serialize back to string
        Some(ast.to_string())
    }

    fn transform_regexp_args(&self, args: &mut [ExprOrSpread]) {
        if !self.options.unicode_property_regex {
            return;
        }

        let Some((pattern_arg, rest_args)) = args.split_first_mut() else {
            return;
        };
        if pattern_arg.spread.is_some() {
            return;
        }

        let flags = match rest_args.first() {
            Some(flags_arg) => {
                if flags_arg.spread.is_some() {
                    return;
                }

                let Some(flags) = self.fold(&flags_arg.expr, &mut Vec::new(), &mut Vec::new())
                else {
                    return;
                };

                flags
            }
            None => String::new(),
        };

        if !flags.contains(['u', 'v']) {
            return;
        }

        let mut direct_reads = Vec::new();
        let Some(pattern) = self.fold(&pattern_arg.expr, &mut Vec::new(), &mut direct_reads) else {
            return;
        };

        let Some(transformed_pattern) = self.transform_pattern(&pattern, &flags) else {
            return;
        };

        let span = pattern_arg.expr.span();
        let literal = Expr::Lit(Lit::Str(Str {
            span,
            value: transformed_pattern.into(),
            raw: None,
        }));
        *pattern_arg.expr = after_reads(direct_reads, literal);
    }

    /// Parse a regex pattern, extract named capturing groups, strip them,
    /// convert named backreferences to indexed ones, and return the stripped
    /// pattern string along with the name-to-index mapping.
    ///
    /// Returns `None` if parsing fails or if there are no named groups.
    fn extract_and_strip_named_groups(
        &self,
        pattern: &str,
        flags: &str,
    ) -> Option<(String, Vec<(Atom, u32)>)> {
        let mut ast = LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
            .parse()
            .ok()?;

        // First pass: collect all named capturing groups and their indices
        let mut mapping = Vec::new();
        let mut counter = 0u32;
        collect_named_groups(&ast.body, &mut counter, &mut mapping);

        if mapping.is_empty() {
            return None;
        }

        // Second pass: strip names from groups and convert named references
        strip_named_groups(&mut ast.body, &mapping);

        Some((ast.to_string(), mapping))
    }

    /// Check if non-named-group transforms require converting to RegExp()
    /// constructor.
    fn needs_regexp_constructor(&self, pattern: &str, flags: &str) -> bool {
        (self.options.dot_all_regex && flags.contains('s'))
            || (self.options.sticky_regex && flags.contains('y'))
            || (self.options.unicode_regex && flags.contains('u'))
            || (self.options.unicode_sets_regex && flags.contains('v'))
            || (self.options.has_indices && flags.contains('d'))
            || (self.options.lookbehind_assertion
                && (pattern.contains("(?<=") || pattern.contains("(?<!")))
            || (self.options.unicode_property_regex
                && (pattern.contains("\\p{") || pattern.contains("\\P{")))
    }

    /// Build an object expression for the group name-to-index mapping.
    fn build_mapping_object(&self, mapping: Vec<(Atom, u32)>) -> Expr {
        let props = mapping
            .into_iter()
            .map(|(name, idx)| {
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        span: DUMMY_SP,
                        sym: name,
                    }),
                    value: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: idx as f64,
                        raw: None,
                    }))),
                })))
            })
            .collect();

        Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props,
        })
    }
}

/// Returns whether `expr` is made only of the expressions `fold` evaluates.
fn is_foldable(expr: &Expr) -> bool {
    match expr {
        Expr::Lit(Lit::Str(_)) | Expr::Ident(_) => true,
        Expr::Tpl(tpl) => tpl.exprs.iter().all(|expr| is_foldable(expr)),
        Expr::Bin(BinExpr {
            op: op!(bin, "+"),
            left,
            right,
            ..
        }) => is_foldable(left) && is_foldable(right),
        Expr::Paren(paren) => is_foldable(&paren.expr),
        _ => false,
    }
}

/// Evaluates `reads` before `expr`, so that reading a constant before its
/// initialization still throws a `ReferenceError`.
fn after_reads(reads: Vec<Ident>, expr: Expr) -> Expr {
    if reads.is_empty() {
        return expr;
    }
    let span = expr.span();
    let mut exprs: Vec<Box<Expr>> = reads.into_iter().map(Box::<Expr>::from).collect();
    exprs.push(Box::new(expr));
    Expr::Paren(ParenExpr {
        span,
        expr: Box::new(Expr::Seq(SeqExpr { span, exprs })),
    })
}

impl VisitMutHook<TraverseCtx> for RegexpPass {
    fn enter_program(&mut self, program: &mut Program, _: &mut TraverseCtx) {
        self.reset(program);
    }

    fn enter_module_items(&mut self, items: &mut Vec<ModuleItem>, _: &mut TraverseCtx) {
        self.record_module_items(items);
    }

    fn enter_stmts(&mut self, stmts: &mut Vec<Stmt>, _: &mut TraverseCtx) {
        self.record_stmts(stmts);
    }

    fn exit_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        self.transform_expr(expr);
    }
}

impl VisitMut for RegexpPass {
    noop_visit_mut_type!(fail);

    fn visit_mut_program(&mut self, program: &mut Program) {
        self.reset(program);
        program.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.record_module_items(items);
        items.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.record_stmts(stmts);
        stmts.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);
        self.transform_expr(expr);
    }
}

impl RegexpPass {
    fn transform_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Lit(Lit::Regex(regex)) => {
                // Try named groups transform first
                if self.options.named_capturing_groups_regex && regex.exp.contains("(?<") {
                    let original_exp = regex.exp.clone();

                    if let Some((stripped_exp, group_mapping)) =
                        self.extract_and_strip_named_groups(&original_exp, &regex.flags)
                    {
                        let Regex { flags, span, .. } = regex.take();

                        // Check if other transforms also need the regex to be a
                        // RegExp() constructor call
                        let needs_constructor =
                            self.needs_regexp_constructor(&stripped_exp, &flags);

                        let regex_arg: Expr = if needs_constructor {
                            // Apply unicode property transform if needed
                            let pattern = self
                                .transform_pattern(&stripped_exp, &flags)
                                .unwrap_or(stripped_exp);

                            let exp: Expr = Atom::from(pattern).into();
                            let mut args = vec![exp.into()];
                            if !flags.is_empty() {
                                let f: Expr = flags.into();
                                args.push(f.into());
                            }

                            CallExpr {
                                span,
                                callee: quote_ident!("RegExp").as_callee(),
                                args,
                                ..Default::default()
                            }
                            .into()
                        } else {
                            // Keep as regex literal with stripped named groups
                            Lit::Regex(Regex {
                                span,
                                exp: stripped_exp.into(),
                                flags,
                            })
                            .into()
                        };

                        let mapping_expr = self.build_mapping_object(group_mapping);
                        let source_expr: Expr = original_exp.into();

                        *expr = CallExpr {
                            span,
                            callee: helper!(span, wrap_reg_exp),
                            args: vec![
                                regex_arg.as_arg(),
                                mapping_expr.as_arg(),
                                source_expr.as_arg(),
                            ],
                            ..Default::default()
                        }
                        .into();

                        return;
                    }
                }

                // Non-named-group transforms (or named group extraction failed)
                let needs_transform = self.needs_regexp_constructor(&regex.exp, &regex.flags);

                if needs_transform {
                    let Regex { exp, flags, span } = regex.take();

                    // Transform the pattern if it contains unicode property escapes
                    let transformed_pattern = self
                        .transform_pattern(&exp, &flags)
                        .unwrap_or_else(|| exp.to_string());

                    let exp: Expr = Atom::from(transformed_pattern).into();
                    let mut args = vec![exp.into()];

                    if !flags.is_empty() {
                        let flags: Expr = flags.into();
                        args.push(flags.into());
                    }

                    *expr = CallExpr {
                        span,
                        callee: quote_ident!("RegExp").as_callee(),
                        args,
                        ..Default::default()
                    }
                    .into()
                }
            }
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                args,
                ..
            }) if self.is_global_regexp(callee) => {
                self.transform_regexp_args(args);
            }
            Expr::New(NewExpr {
                callee,
                args: Some(args),
                ..
            }) if self.is_global_regexp(callee) => {
                self.transform_regexp_args(args);
            }
            _ => {}
        }
    }
}

/// First pass: collect all named capturing groups and their 1-based indices.
/// Groups are counted in left-to-right order by the position of their opening
/// parenthesis.
fn collect_named_groups(
    disjunction: &Disjunction,
    counter: &mut u32,
    mapping: &mut Vec<(Atom, u32)>,
) {
    for alt in &disjunction.body {
        for term in &alt.body {
            collect_named_groups_term(term, counter, mapping);
        }
    }
}

fn collect_named_groups_term(term: &Term, counter: &mut u32, mapping: &mut Vec<(Atom, u32)>) {
    match term {
        Term::CapturingGroup(g) => {
            *counter += 1;
            if let Some(name) = &g.name {
                mapping.push((name.clone(), *counter));
            }
            collect_named_groups(&g.body, counter, mapping);
        }
        Term::Quantifier(q) => {
            collect_named_groups_term(&q.body, counter, mapping);
        }
        Term::LookAroundAssertion(la) => {
            collect_named_groups(&la.body, counter, mapping);
        }
        Term::IgnoreGroup(ig) => {
            collect_named_groups(&ig.body, counter, mapping);
        }
        _ => {}
    }
}

/// Second pass: strip names from named groups and convert named references
/// to indexed references.
fn strip_named_groups(disjunction: &mut Disjunction, mapping: &[(Atom, u32)]) {
    for alt in &mut disjunction.body {
        for term in &mut alt.body {
            strip_named_groups_term(term, mapping);
        }
    }
}

fn strip_named_groups_term(term: &mut Term, mapping: &[(Atom, u32)]) {
    // Check if this is a NamedReference that needs conversion
    let replacement = if let Term::NamedReference(nr) = &*term {
        mapping.iter().find(|(n, _)| *n == nr.name).map(|(_, idx)| {
            Term::IndexedReference(Box::new(IndexedReference {
                span: nr.span,
                index: *idx,
            }))
        })
    } else {
        None
    };

    if let Some(new_term) = replacement {
        *term = new_term;
        return;
    }

    // Recurse into children
    match term {
        Term::CapturingGroup(g) => {
            if g.name.is_some() {
                g.name = None;
            }
            strip_named_groups(&mut g.body, mapping);
        }
        Term::Quantifier(q) => {
            strip_named_groups_term(&mut q.body, mapping);
        }
        Term::LookAroundAssertion(la) => {
            strip_named_groups(&mut la.body, mapping);
        }
        Term::IgnoreGroup(ig) => {
            strip_named_groups(&mut ig.body, mapping);
        }
        _ => {}
    }
}
