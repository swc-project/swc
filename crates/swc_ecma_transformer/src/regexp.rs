use std::cell::RefCell;

use rustc_hash::FxHashSet;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{errors::HANDLER, util::take::Take, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_compat_regexp::{
    has_modifiers, transform_modifiers, transform_unicode_property_escapes, transform_unicode_sets,
};
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_regexp::{
    ast::{Disjunction, IndexedReference, Term},
    LiteralParser, Options as RegexpOptions,
};
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use tracing::debug;

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
    /// [Duplicate named capturing groups](https://github.com/tc39/proposal-duplicate-named-capturing-groups)
    ///
    /// Patterns that reuse a group name in different alternatives are
    /// rewritten to indexed groups, and `_wrap_reg_exp` restores the
    /// `groups` object. Patterns that refer to such a name with `\k<name>`
    /// are left unchanged because the reference cannot be expressed with
    /// indexed groups.
    pub duplicate_named_capturing_groups_regex: bool,
    /// [RegExp.prototype.sticky](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.sticky)
    pub sticky_regex: bool,
    /// [Unicode property escapes in regular expressions](https://tc39.es/proposal-regexp-unicode-property-escapes/)
    pub unicode_property_regex: bool,
    /// [RegExp.prototype.unicode](https://tc39.es/ecma262/multipage/text-processing.html#sec-get-regexp.prototype.unicode)
    pub unicode_regex: bool,
    /// [RegExp.prototype.unicodeSets](https://github.com/tc39/proposal-regexp-v-flag)
    ///
    /// Regex literals with the `v` flag are rewritten to equivalent literals
    /// with the `u` flag. A pattern that uses a property of strings other than
    /// `Basic_Emoji` (for example `\p{RGI_Emoji}`) cannot be rewritten and is
    /// only converted to a `RegExp` call, with a warning.
    ///
    /// Like Babel, only regex literals are lowered. A `RegExp(...)` call is
    /// never rewritten, so that runtime feature checks such as
    /// `new RegExp("", "v")` keep working; it gets a warning instead.
    pub unicode_sets_regex: bool,
    /// [RegExp modifiers](https://github.com/tc39/proposal-regexp-modifiers)
    ///
    /// `(?ims-ims:...)` groups in regex literals are rewritten without
    /// modifiers. A backreference in a case-insensitive group cannot be
    /// rewritten, so such a literal is converted to a `RegExp` call, with a
    /// warning. As for the `v` flag, `RegExp(...)` calls are only reported.
    ///
    /// When an `m` modifier applies only to some `^` or `$`, and for `\b` or
    /// `\B` in an `i` modifier group with the `u` flag, the rewrite uses
    /// lookbehind. Targets without lookbehind cannot parse the result.
    ///
    /// The rewritten pattern assumes the flags of the literal, and an
    /// `(?m:...)` group that contains every `^` and `$` becomes the `m`
    /// flag. A literal that is the direct pattern argument of a
    /// `RegExp(...)` call with a flags argument is kept, because the call
    /// replaces its flags. Like Babel, other ways to reuse a literal with
    /// other flags are not followed, and they can match differently: a
    /// variable, an alias such as `const R = RegExp`, `RegExp.call`,
    /// `RegExp.apply`, `Reflect.construct` and `.source`. This applies to
    /// the `v` flag as well.
    pub regexp_modifiers: bool,
    /// The syntax context of unresolved (global) identifiers.
    ///
    /// When it is set, only calls to the global `RegExp` are transformed or
    /// reported. A local binding named `RegExp` (for example a parameter) is
    /// left alone.
    ///
    /// An identifier with an empty context (the resolver has not run) is
    /// treated as the global `RegExp`. When this field is `None` and the
    /// resolver has run, the pass cannot tell a local binding from the global
    /// one: it keeps applying the unicode property transform to the arguments,
    /// as before, but does not report them.
    pub unresolved_ctxt: Option<SyntaxContext>,
}

impl RegExpOptions {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.dot_all_regex
            || self.has_indices
            || self.lookbehind_assertion
            || self.named_capturing_groups_regex
            || self.duplicate_named_capturing_groups_regex
            || self.sticky_regex
            || self.unicode_property_regex
            || self.unicode_regex
            || self.unicode_sets_regex
            || self.regexp_modifiers
    }
}

pub(crate) fn hook(options: RegExpOptions) -> Option<impl VisitMutHook<TraverseCtx>> {
    if options.is_enabled() {
        Some(RegexpPass::new(options))
    } else {
        None
    }
}

pub(crate) fn pass(options: RegExpOptions) -> impl Pass {
    visit_mut_pass(RegexpPass::new(options))
}

struct RegexpPass {
    options: RegExpOptions,
    /// The addresses of regex literals that are the pattern argument of a
    /// `RegExp` call with flags that are not known. The call can replace the
    /// flags of the literal, so the literal must not be lowered with its own
    /// flags.
    constructor_literals: Vec<usize>,
    /// For each `RegExp` call that is being visited, the address of the call
    /// expression and the length of `constructor_literals` when the call was
    /// entered. When the expression at that address is left, even if another
    /// transform replaced it, the entries that it added are removed, so that
    /// no stale address stays in the list.
    constructor_marks: Vec<(usize, usize)>,
    /// The spans that a warning was reported for, so that a regex is reported
    /// once even when it is visited again as part of a generated call.
    warned: RefCell<FxHashSet<Span>>,
}

/// What a callee named `RegExp` refers to.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum RegExpCallee {
    /// The global `RegExp`, or an identifier in code that the resolver did
    /// not process.
    Global,
    /// A resolved identifier, but the pass does not know the unresolved
    /// context, so it cannot tell a local binding from the global one.
    Unknown,
}

impl RegexpPass {
    fn new(options: RegExpOptions) -> Self {
        Self {
            options,
            constructor_literals: Vec::new(),
            constructor_marks: Vec::new(),
            warned: Default::default(),
        }
    }

    /// Returns what `callee` refers to, or `None` if it is not `RegExp` or is a
    /// local binding named `RegExp`.
    ///
    /// Only direct references are recognized. Indirect ones, such as an alias
    /// (`const R = RegExp`), `RegExp.call`, `RegExp.apply` or
    /// `Reflect.construct`, are not followed. See
    /// [`RegExpOptions::regexp_modifiers`].
    fn regexp_callee(&self, callee: &Expr) -> Option<RegExpCallee> {
        match callee.unwrap_parens() {
            Expr::Ident(ident) if ident.sym == "RegExp" => self.global_ident(ident),
            // `globalThis.RegExp`, `window["RegExp"]` and `self?.RegExp`.
            Expr::Member(member) => self.global_member_regexp(member),
            Expr::OptChain(OptChainExpr { base, .. }) => match &**base {
                OptChainBase::Member(member) => self.global_member_regexp(member),
                OptChainBase::Call(_) => None,
            },
            _ => None,
        }
    }

    /// Returns what `RegExp` on the global object refers to.
    fn global_member_regexp(&self, member: &MemberExpr) -> Option<RegExpCallee> {
        let is_regexp = match &member.prop {
            MemberProp::Ident(prop) => prop.sym == "RegExp",
            MemberProp::Computed(prop) => matches!(
                prop.expr.unwrap_parens(),
                Expr::Lit(Lit::Str(name)) if name.value.as_str() == Some("RegExp")
            ),
            MemberProp::PrivateName(_) => false,
        };
        if !is_regexp {
            return None;
        }
        self.global_object(&member.obj)
    }

    /// Returns whether `expr` refers to the global object.
    fn global_object(&self, expr: &Expr) -> Option<RegExpCallee> {
        match expr.unwrap_parens() {
            Expr::Ident(ident) if matches!(&*ident.sym, "globalThis" | "window" | "self") => {
                self.global_ident(ident)
            }
            _ => None,
        }
    }

    /// Reports that a regular expression keeps syntax that the targets may not
    /// support. A span is reported once.
    fn warn(&self, span: Span, feature: &str, reason: impl std::fmt::Display) {
        self.warn_message(
            span,
            &format!(
                "Cannot lower {feature} in this regular expression for the configured targets: \
                 {reason}. The regular expression is kept, and it can fail on those targets."
            ),
        );
    }

    /// Reports `message` at `span`, unless a warning was already reported for
    /// the span.
    fn warn_message(&self, span: Span, message: &str) {
        if !span.is_dummy() && !self.warned.borrow_mut().insert(span) {
            return;
        }
        emit_warning(span, message);
    }

    /// Returns an identifier for the global `RegExp`, for generated calls.
    fn global_regexp_ident(&self) -> Ident {
        Ident::new(
            "RegExp".into(),
            DUMMY_SP,
            self.options.unresolved_ctxt.unwrap_or_default(),
        )
    }

    /// Classifies the flags argument of a `RegExp` call. `rest_args` are the
    /// arguments after the pattern.
    fn call_flags<'a>(&self, rest_args: &'a [ExprOrSpread]) -> CallFlags<'a> {
        match rest_args.first() {
            None => CallFlags::Absent,
            // A spread in the second position can supply the flags. A spread
            // after the flags argument cannot change it.
            Some(arg) if arg.spread.is_some() => CallFlags::Unknown,
            Some(arg) if self.is_global_undefined(&arg.expr) => CallFlags::Undefined,
            Some(arg) => match static_string(&arg.expr).and_then(|(_, flags)| flags.as_str()) {
                Some(flags) => CallFlags::Known(flags),
                None => CallFlags::Unknown,
            },
        }
    }

    /// Returns whether `ident` refers to a global binding, or `None` if it
    /// refers to a local binding.
    fn global_ident(&self, ident: &Ident) -> Option<RegExpCallee> {
        // An empty context means that the resolver has not run, so the
        // binding is unknown and the identifier is treated as global.
        if ident.ctxt == SyntaxContext::empty() {
            return Some(RegExpCallee::Global);
        }
        match self.options.unresolved_ctxt {
            Some(ctxt) if ident.ctxt == ctxt => Some(RegExpCallee::Global),
            Some(_) => None,
            None => Some(RegExpCallee::Unknown),
        }
    }

    /// Returns true if `expr` is the global `undefined`, or `void` of a
    /// literal (for example `void 0`).
    fn is_global_undefined(&self, expr: &Expr) -> bool {
        match expr.unwrap_parens() {
            Expr::Ident(ident) if ident.sym == "undefined" => {
                self.global_ident(ident) == Some(RegExpCallee::Global)
            }
            Expr::Unary(UnaryExpr {
                op: op!("void"),
                arg,
                ..
            }) => matches!(arg.unwrap_parens(), Expr::Lit(_)),
            _ => false,
        }
    }

    /// Returns true if `pattern` with `flags` has syntax that
    /// [`Self::lower_syntax`] lowers. A modifier group is confirmed on the
    /// parsed pattern. A pattern that cannot be parsed counts as one that
    /// needs lowering.
    fn has_syntax_to_lower(&self, pattern: &str, flags: &str) -> bool {
        if self.options.unicode_sets_regex && flags.contains('v') {
            return true;
        }
        if !(self.options.regexp_modifiers && may_have_modifiers(pattern)) {
            return false;
        }
        match LiteralParser::new(pattern, Some(flags), RegexpOptions::default()).parse() {
            Ok(ast) => has_modifiers(&ast),
            Err(_) => true,
        }
    }

    /// Removes the entries that a `RegExp` call added to
    /// `constructor_literals` when the expression at `address` is left. See
    /// `prepare_constructor`.
    fn leave_expr(&mut self, address: usize) {
        if let Some(&(call, len)) = self.constructor_marks.last() {
            if call == address {
                self.constructor_marks.pop();
                self.constructor_literals.truncate(len);
            }
        }
    }

    /// Prepares a `RegExp(/pattern/, flags)` call before the literal is
    /// visited.
    ///
    /// The call uses the source of the literal with the flags of the call. If
    /// the call has a flags argument (other than the global `undefined`), or
    /// the arguments are spread, the flags of the literal can be replaced, so
    /// lowering the literal with its own flags could change its meaning. Every
    /// regex literal that the pattern argument can evaluate to is then kept as
    /// it is (for example also in `cond ? /a/ : /b/` or `re || /a/`).
    fn prepare_constructor(&mut self, expr: &mut Expr) {
        let address = expr as *const Expr as usize;
        let Some((callee, args)) = regexp_call_parts(expr) else {
            return;
        };
        if self.regexp_callee(callee).is_none() {
            return;
        }
        // Removed in `transform_expr` when the expression at `address` is
        // left.
        self.constructor_marks
            .push((address, self.constructor_literals.len()));

        let Some(first) = args.first() else {
            return;
        };
        if first.spread.is_some() {
            // A spread can supply the pattern and the flags, or nothing, in
            // which case the next argument is the pattern. Keep the literals
            // of every argument.
            for arg in args.iter() {
                collect_pattern_literals(&arg.expr, &mut self.constructor_literals);
            }
            return;
        }
        let replaces_flags = !matches!(
            self.call_flags(&args[1..]),
            CallFlags::Absent | CallFlags::Undefined
        );
        if replaces_flags {
            collect_pattern_literals(&first.expr, &mut self.constructor_literals);
        }
    }

    /// Lowers the syntax that the target cannot parse: the `v` flag and
    /// modifiers such as `(?i:...)`.
    ///
    /// Returns the new pattern and flags, or `None` if nothing is lowered. If a
    /// pattern cannot be lowered, it is kept and the other transforms still
    /// apply to it.
    ///
    /// When a pattern cannot be lowered, a warning is reported at `span`,
    /// because the target may reject the kept pattern.
    fn lower_syntax(&self, span: Span, pattern: &str, flags: &str) -> Option<(String, String)> {
        let lower_unicode_sets = self.options.unicode_sets_regex && flags.contains('v');
        let lower_modifiers = self.options.regexp_modifiers && may_have_modifiers(pattern);
        if !lower_unicode_sets && !lower_modifiers {
            return None;
        }

        let mut ast =
            match LiteralParser::new(pattern, Some(flags), RegexpOptions::default()).parse() {
                Ok(ast) => ast,
                Err(err) => {
                    debug!(%pattern, %flags, ?err, "cannot parse a regex to lower its syntax");
                    // A `v` flag is lowered only after parsing, so a pattern that
                    // the parser rejects (for example a script name that it does
                    // not know) keeps the `v` flag.
                    if lower_unicode_sets {
                        self.warn(span, "the `v` flag", "the pattern cannot be parsed");
                    } else {
                        // The text check for modifier groups can report a false
                        // positive, so do not claim that the pattern has one.
                        self.warn(
                            span,
                            "possible regexp modifiers",
                            "the pattern cannot be parsed",
                        );
                    }
                    return None;
                }
            };
        // `may_have_modifiers` can report a false positive, such as `\(?i:`.
        // Confirm it on the AST, so that a supported `v` flag is not lowered
        // for nothing.
        let lower_modifiers = lower_modifiers && has_modifiers(&ast);
        if !lower_unicode_sets && !lower_modifiers {
            return None;
        }
        let mut flags = flags.to_string();
        let mut changed = false;

        // Modifiers are lowered on a `u` pattern, so the `v` flag is lowered
        // first even if the target supports it.
        if flags.contains('v') && (lower_unicode_sets || lower_modifiers) {
            if let Err(err) = transform_unicode_sets(&mut ast, flags.contains('i')) {
                debug!(%pattern, %flags, %err, "cannot lower the `v` flag");
                if lower_unicode_sets {
                    self.warn(span, "the `v` flag", err);
                } else {
                    // The target supports the `v` flag, but the modifiers can
                    // only be lowered in a `u` pattern.
                    self.warn(
                        span,
                        "regexp modifiers",
                        format!("the `v` flag must be lowered first, but {err}"),
                    );
                }
                return None;
            }
            flags = flags.replace('v', "u");
            changed = true;
            if self.options.unicode_regex {
                self.warn_message(
                    span,
                    "The `v` flag of this regular expression is lowered to the `u` flag, which \
                     the configured targets do not support. The regular expression can fail on \
                     those targets.",
                );
            }
        }

        if lower_modifiers {
            match transform_modifiers(&mut ast, &flags) {
                Ok(Some(new_flags)) => {
                    flags = new_flags;
                    changed = true;
                }
                Ok(None) => {}
                Err(err) => {
                    debug!(%pattern, %flags, %err, "cannot lower regexp modifiers");
                    self.warn(span, "regexp modifiers", err);
                    return None;
                }
            }
        }

        changed.then(|| (ast.to_string(), flags))
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
        // The expansion follows `u` mode rules. `v` mode has a different class
        // syntax (set operations) and complements `\P{...}` after case folding,
        // so expanding would change the meaning or produce an invalid pattern.
        // Leave `v` patterns unchanged.
        if flags.contains('v') {
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

    /// Transforms the arguments of a `RegExp` call. `callee` says whether the
    /// call is known to use the global `RegExp`.
    ///
    /// Only the pre-existing unicode property expansion rewrites the
    /// arguments. The `v` flag, modifiers and duplicate named groups are only
    /// reported, because a call can be a runtime feature check.
    fn transform_regexp_args(&self, args: &mut [ExprOrSpread], callee: RegExpCallee) {
        let Some((pattern_arg, rest_args)) = args.split_first_mut() else {
            return;
        };
        if pattern_arg.spread.is_some() {
            return;
        }
        let call_flags = self.call_flags(rest_args);

        if callee == RegExpCallee::Global {
            self.warn_unlowered_call(&pattern_arg.expr, call_flags);
        }

        if !self.options.unicode_property_regex {
            return;
        }
        let flags = match call_flags {
            CallFlags::Absent => "",
            CallFlags::Known(flags) => flags,
            CallFlags::Undefined | CallFlags::Unknown => return,
        };
        if !flags.contains(['u', 'v']) {
            return;
        }
        let Expr::Lit(Lit::Str(pattern_lit)) = &mut *pattern_arg.expr else {
            return;
        };
        let Some(pattern) = pattern_lit.value.as_str() else {
            return;
        };
        let Some(transformed_pattern) = self.transform_pattern(pattern, flags) else {
            return;
        };
        pattern_lit.value = transformed_pattern.into();
        pattern_lit.raw = None;
    }

    /// Reports syntax in the arguments of a `RegExp` call that the targets do
    /// not support. Regex literal patterns are reported where they are
    /// visited.
    fn warn_unlowered_call(&self, pattern: &Expr, flags: CallFlags) {
        const REASON: &str = "only regex literals are lowered, not a `RegExp` call";

        if !(self.options.unicode_sets_regex
            || self.options.regexp_modifiers
            || self.options.duplicate_named_capturing_groups_regex)
        {
            return;
        }

        let known_flags = match flags {
            CallFlags::Absent | CallFlags::Undefined => Some(""),
            CallFlags::Known(flags) => Some(flags),
            CallFlags::Unknown => None,
        };
        let uses_unicode_sets =
            self.options.unicode_sets_regex && known_flags.is_some_and(|flags| flags.contains('v'));

        let Some((span, value)) = static_string(pattern) else {
            // A regex literal with its own `v` flag is reported where it is
            // visited.
            let reported_by_literal = matches!(
                pattern.unwrap_parens(),
                Expr::Lit(Lit::Regex(regex)) if regex.flags.contains('v')
            );
            if uses_unicode_sets && !reported_by_literal {
                self.warn(pattern.span(), "the `v` flag", REASON);
            }
            return;
        };

        // A lone surrogate cannot be parsed, so check the rest of the
        // pattern.
        let lossy = value.to_atom_lossy();
        let pattern = &**lossy;
        if uses_unicode_sets {
            self.warn(span, "the `v` flag", REASON);
            return;
        }
        if self.options.regexp_modifiers
            && may_have_modifiers(pattern)
            && LiteralParser::new(pattern, known_flags, RegexpOptions::default())
                .parse()
                .map_or(true, |ast| has_modifiers(&ast))
        {
            self.warn(span, "regexp modifiers", REASON);
            return;
        }
        // Duplicate names do not depend on the flags.
        self.warn_duplicate_names_in_string(span, pattern, known_flags.unwrap_or(""));
    }

    /// Warns about a string pattern of a `RegExp` call with duplicate named
    /// groups. Only regex literals are wrapped with `_wrap_reg_exp`.
    fn warn_duplicate_names_in_string(&self, span: Span, pattern: &str, flags: &str) {
        if !self.options.duplicate_named_capturing_groups_regex || !pattern.contains("(?<") {
            return;
        }
        let Ok(ast) = LiteralParser::new(pattern, Some(flags), RegexpOptions::default()).parse()
        else {
            return;
        };
        let mut mapping = Vec::new();
        collect_named_groups(&ast.body, &mut 0, &mut mapping);
        if mapping.iter().any(|(_, indices)| indices.len() > 1) {
            self.warn(
                span,
                "duplicate named capturing groups",
                "only regex literals are lowered, not a `RegExp` call",
            );
        }
    }

    /// Parse a regex pattern, extract named capturing groups, strip them,
    /// convert named backreferences to indexed ones, and return the stripped
    /// pattern string along with the name-to-indices mapping.
    ///
    /// A name that is used by more than one group (allowed in different
    /// alternatives) maps to several indices.
    ///
    /// Returns `None` if parsing fails, if the pattern does not contain a group
    /// that an enabled option asks to lower, or if a `\k<name>` reference
    /// points to a duplicated name.
    ///
    /// A pattern with such a reference cannot be lowered, so a warning is
    /// reported at `span`.
    fn extract_and_strip_named_groups(
        &self,
        span: Span,
        pattern: &str,
        flags: &str,
    ) -> Option<(String, Vec<(Atom, Vec<u32>)>)> {
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

        let has_duplicates = mapping.iter().any(|(_, indices)| indices.len() > 1);
        if !(self.options.named_capturing_groups_regex
            || (self.options.duplicate_named_capturing_groups_regex && has_duplicates))
        {
            return None;
        }

        // Second pass: strip names from groups and convert named references
        let mut stripper = NamedGroupStripper {
            mapping: &mapping,
            unsupported: false,
        };
        stripper.strip_disjunction(&mut ast.body);
        if stripper.unsupported {
            self.warn(
                span,
                "duplicate named capturing groups",
                "a backreference refers to a duplicated group name",
            );
            return None;
        }

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
            // Modifiers that could not be lowered. In a `RegExp` call, the
            // target rejects only this expression when it runs, instead of
            // the whole script when it is parsed.
            || (self.options.regexp_modifiers
                && may_have_modifiers(pattern)
                && LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
                    .parse()
                    .map_or(true, |ast| has_modifiers(&ast)))
    }

    /// Build an object expression for the group name-to-index mapping.
    fn build_mapping_object(&self, mapping: Vec<(Atom, Vec<u32>)>) -> Expr {
        let props = mapping
            .into_iter()
            .map(|(name, indices)| {
                let num = |idx: u32| {
                    Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: idx as f64,
                        raw: None,
                    }))
                };
                // A unique name maps to a number, a duplicated one to an array
                // of numbers. `_wrap_reg_exp` picks the participating group.
                let value = match indices.as_slice() {
                    [idx] => num(*idx),
                    _ => Expr::Array(ArrayLit {
                        span: DUMMY_SP,
                        elems: indices
                            .into_iter()
                            .map(|idx| Some(num(idx).as_arg()))
                            .collect(),
                    }),
                };

                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        span: DUMMY_SP,
                        sym: name,
                    }),
                    value: Box::new(value),
                })))
            })
            .collect();

        Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props,
        })
    }
}

impl VisitMutHook<TraverseCtx> for RegexpPass {
    fn enter_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        self.prepare_constructor(expr);
    }

    fn exit_expr(&mut self, expr: &mut Expr, _: &mut TraverseCtx) {
        self.transform_expr(expr);
    }
}

impl VisitMut for RegexpPass {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        self.prepare_constructor(expr);
        expr.visit_mut_children_with(self);
        self.transform_expr(expr);
    }
}

impl RegexpPass {
    fn transform_expr(&mut self, expr: &mut Expr) {
        self.leave_expr(expr as *const Expr as usize);

        match expr {
            Expr::Lit(Lit::Regex(regex)) => {
                // See `prepare_constructor`.
                let address = &*regex as *const Regex as usize;
                let in_constructor = match self
                    .constructor_literals
                    .iter()
                    .position(|&literal| literal == address)
                {
                    Some(idx) => {
                        self.constructor_literals.swap_remove(idx);
                        true
                    }
                    None => false,
                };

                let lowers_named_groups = (self.options.named_capturing_groups_regex
                    || self.options.duplicate_named_capturing_groups_regex)
                    && may_have_named_groups(&regex.exp);
                if in_constructor
                    && (lowers_named_groups || self.has_syntax_to_lower(&regex.exp, &regex.flags))
                {
                    self.warn(
                        regex.span,
                        "the syntax",
                        "the enclosing `RegExp` call can replace the flags of this literal",
                    );
                }

                if let Some((exp, flags)) = (!in_constructor)
                    .then(|| self.lower_syntax(regex.span, &regex.exp, &regex.flags))
                    .flatten()
                {
                    regex.exp = exp.into();
                    regex.flags = flags.into();
                }

                // Try named groups transform first. A literal in a `RegExp` call
                // is kept, because the call copies only the pattern, not the
                // group names that `_wrap_reg_exp` restores.
                if !in_constructor && lowers_named_groups {
                    let original_exp = regex.exp.clone();

                    if let Some((stripped_exp, group_mapping)) =
                        self.extract_and_strip_named_groups(regex.span, &original_exp, &regex.flags)
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
                                callee: self.global_regexp_ident().as_callee(),
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

                // Non-named-group transforms (or named group extraction failed).
                // Named groups that a target may not parse are kept in a
                // `RegExp` call, so that the target rejects only this
                // expression, not the whole script.
                let needs_transform = self.needs_regexp_constructor(&regex.exp, &regex.flags)
                    || (in_constructor && lowers_named_groups);

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
                        callee: self.global_regexp_ident().as_callee(),
                        args,
                        ..Default::default()
                    }
                    .into()
                }
            }
            _ => {
                if let Some((callee, args)) = regexp_call_parts(expr) {
                    if let Some(callee) = self.regexp_callee(callee) {
                        self.transform_regexp_args(args, callee);
                    }
                }
            }
        }
    }
}

/// The flags argument of a `RegExp` call.
#[derive(Debug, Clone, Copy)]
enum CallFlags<'a> {
    /// No flags argument.
    Absent,
    /// The global `undefined`, which is the same as no flags argument.
    Undefined,
    /// A string literal.
    Known(&'a str),
    /// Flags that are not known when compiling.
    Unknown,
}

/// Returns the callee and the arguments of a call, a `new` expression or an
/// optional call.
fn regexp_call_parts(expr: &mut Expr) -> Option<(&Expr, &mut Vec<ExprOrSpread>)> {
    match expr {
        Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) => Some((&**callee, args)),
        Expr::New(NewExpr {
            callee,
            args: Some(args),
            ..
        }) => Some((&**callee, args)),
        Expr::OptChain(OptChainExpr { base, .. }) => match &mut **base {
            OptChainBase::Call(OptCall { callee, args, .. }) => Some((&**callee, args)),
            OptChainBase::Member(_) => None,
        },
        _ => None,
    }
}

/// Collects the addresses of the regex literals that the pattern argument of a
/// `RegExp` call can evaluate to.
///
/// Only direct value positions are followed: parentheses, both branches of a
/// conditional (not the test), logical operators, the last expression of a
/// sequence, the right side of an assignment and the elements of an array
/// (for a spread). A literal elsewhere, for example in a call that computes
/// the pattern, is not passed to `RegExp` directly, so it is lowered as
/// usual.
fn collect_pattern_literals(expr: &Expr, literals: &mut Vec<usize>) {
    match expr {
        Expr::Lit(Lit::Regex(regex)) => literals.push(regex as *const Regex as usize),
        Expr::Paren(paren) => collect_pattern_literals(&paren.expr, literals),
        Expr::Cond(cond) => {
            collect_pattern_literals(&cond.cons, literals);
            collect_pattern_literals(&cond.alt, literals);
        }
        Expr::Bin(bin) if matches!(bin.op, op!("||") | op!("&&") | op!("??")) => {
            collect_pattern_literals(&bin.left, literals);
            collect_pattern_literals(&bin.right, literals);
        }
        Expr::Seq(seq) => {
            if let Some(last) = seq.exprs.last() {
                collect_pattern_literals(last, literals);
            }
        }
        Expr::Assign(assign) => collect_pattern_literals(&assign.right, literals),
        Expr::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pattern_literals(&elem.expr, literals);
            }
        }
        _ => {}
    }
}

/// Returns the value of a string literal, or of a template literal without
/// expressions.
fn static_string(expr: &Expr) -> Option<(Span, &Wtf8Atom)> {
    match expr.unwrap_parens() {
        Expr::Lit(Lit::Str(lit)) => Some((lit.span, &lit.value)),
        Expr::Tpl(tpl) if tpl.exprs.is_empty() => tpl
            .quasis
            .first()
            .and_then(|quasi| quasi.cooked.as_ref())
            .map(|cooked| (tpl.span, cooked)),
        _ => None,
    }
}

/// Reports a warning at `span`.
fn emit_warning(span: Span, message: &str) {
    if !HANDLER.is_set() {
        return;
    }

    HANDLER.with(|handler| {
        handler.struct_span_warn(span, message).emit();
    });
}

/// Returns true if `pattern` may contain a named group such as `(?<name>`. A
/// lookbehind (`(?<=`, `(?<!`) is not a named group.
fn may_have_named_groups(pattern: &str) -> bool {
    pattern
        .match_indices("(?<")
        .any(|(idx, _)| !matches!(pattern.as_bytes().get(idx + 3), Some(b'=' | b'!')))
}

/// Returns true if `pattern` may contain a modifier group such as `(?i:` or
/// `(?-s:`. A false positive (for example an escaped `\(?i:`) only costs a
/// parse.
fn may_have_modifiers(pattern: &str) -> bool {
    pattern.match_indices("(?").any(|(idx, _)| {
        matches!(
            pattern.as_bytes().get(idx + 2),
            Some(b'i' | b'm' | b's' | b'-')
        )
    })
}

/// First pass: collect all named capturing groups and their 1-based indices.
/// Groups are counted in left-to-right order by the position of their opening
/// parenthesis. Groups that share a name are merged into one entry.
fn collect_named_groups(
    disjunction: &Disjunction,
    counter: &mut u32,
    mapping: &mut Vec<(Atom, Vec<u32>)>,
) {
    for alt in &disjunction.body {
        for term in &alt.body {
            collect_named_groups_term(term, counter, mapping);
        }
    }
}

fn collect_named_groups_term(term: &Term, counter: &mut u32, mapping: &mut Vec<(Atom, Vec<u32>)>) {
    match term {
        Term::CapturingGroup(g) => {
            *counter += 1;
            if let Some(name) = &g.name {
                match mapping.iter_mut().find(|(n, _)| n == name) {
                    Some((_, indices)) => indices.push(*counter),
                    None => mapping.push((name.clone(), vec![*counter])),
                }
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

/// Second pass: strips names from named groups and converts named references
/// to indexed references.
struct NamedGroupStripper<'a> {
    mapping: &'a [(Atom, Vec<u32>)],
    /// Set when a `\k<name>` reference targets a duplicated name. Such a
    /// reference means "the group that took part in the match", which has no
    /// indexed equivalent: `\1` and `\2` both match the empty string while
    /// their group is unset. The whole transform is abandoned in that case.
    unsupported: bool,
}

impl NamedGroupStripper<'_> {
    fn strip_disjunction(&mut self, disjunction: &mut Disjunction) {
        for alt in &mut disjunction.body {
            for term in &mut alt.body {
                self.strip_term(term);
            }
        }
    }

    fn strip_term(&mut self, term: &mut Term) {
        // Check if this is a NamedReference that needs conversion
        if let Term::NamedReference(nr) = &*term {
            match self.mapping.iter().find(|(n, _)| *n == nr.name) {
                Some((_, indices)) if indices.len() == 1 => {
                    *term = Term::IndexedReference(Box::new(IndexedReference {
                        span: nr.span,
                        index: indices[0],
                    }));
                }
                Some(_) => self.unsupported = true,
                None => {}
            }
            return;
        }

        // Recurse into children
        match term {
            Term::CapturingGroup(g) => {
                g.name = None;
                self.strip_disjunction(&mut g.body);
            }
            Term::Quantifier(q) => self.strip_term(&mut q.body),
            Term::LookAroundAssertion(la) => self.strip_disjunction(&mut la.body),
            Term::IgnoreGroup(ig) => self.strip_disjunction(&mut ig.body),
            _ => {}
        }
    }
}
