use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{errors::HANDLER, util::take::Take, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_compat_regexp::{
    has_modifiers, isolate_lone_surrogates, transform_modifiers,
    transform_unicode_property_escapes, transform_unicode_sets,
};
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_regexp::{
    ast::{Alternative, CharacterKind, Disjunction, Dot, IgnoreGroup, IndexedReference, Term},
    decode_group_name, LiteralParser, Options as RegexpOptions,
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
    /// `groups` object. A `\k<name>` reference to such a name becomes
    /// `(?:\1\2)`: only one of the groups can take part in a match, and a
    /// reference to a group that did not take part matches the empty string.
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
    /// flag. A flag that a `(?-i:...)`, `(?-m:...)` or `(?-s:...)` group
    /// disables is removed from the flags when the rest of the pattern does
    /// not need it, so the `flags` property of the result can differ from
    /// the input. A literal that is the direct pattern argument of a
    /// `RegExp(...)` call with a flags argument is kept, because the call
    /// replaces its flags. Like Babel, other ways to reuse a literal with
    /// other flags are not followed, and they can match differently: a
    /// variable, an alias such as `const R = RegExp`, `RegExp.call`,
    /// `RegExp.apply`, `Reflect.construct` and `.source`. This applies to
    /// the `v` flag as well. An optional call such as `RegExp?.(...)` is
    /// protected only while it is still an optional call: when the targets
    /// also need optional chaining lowered, the call is rewritten before this
    /// pass sees it, and its literal is lowered.
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
    /// The addresses of regex literals that can be the pattern argument of a
    /// `RegExp` call, and how the call uses them. See `prepare_constructor`.
    constructor_literals: Vec<(usize, ConstructorUse)>,
    /// For each `RegExp` call that is being visited, the address of the call
    /// expression and the length of `constructor_literals` when the call was
    /// entered. When the expression at that address is left, even if another
    /// transform replaced it, the entries that it added are removed, so that
    /// no stale address stays in the list.
    constructor_marks: Vec<(usize, usize)>,
    /// The spans that a warning was reported for, so that a regex is reported
    /// once even when it is visited again as part of a generated call.
    warned: FxHashSet<Span>,
}

/// How a `RegExp` call uses a regex literal that is its pattern argument.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ConstructorUse {
    /// The call can replace the flags of the literal, so the literal must not
    /// be lowered with its own flags. The value is the Unicode mode of the
    /// flags of the call, if they are known.
    ReplacesFlags(Option<UnicodeMode>),
    /// The call keeps the flags. The literal can be lowered, but a new regex
    /// copies only its pattern and flags, not the `groups` that
    /// `_wrap_reg_exp` restores.
    CopiesPattern,
}

/// Which of the `u` and `v` flags a set of flags has. Unicode property
/// escapes expand the same way for two sets of flags with the same mode.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum UnicodeMode {
    None,
    Unicode,
    UnicodeSets,
}

impl UnicodeMode {
    fn of(flags: &str) -> Self {
        if flags.contains('v') {
            Self::UnicodeSets
        } else if flags.contains('u') {
            Self::Unicode
        } else {
            Self::None
        }
    }
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
    /// Returns the pattern argument of a `RegExp` call and its flags, or
    /// `None` if a leading spread makes the pattern position unknown. The
    /// pattern is `None` if a hole of a spread array supplies it.
    fn pattern_and_flags<'a>(
        &self,
        args: &'a [ExprOrSpread],
    ) -> Option<(Option<&'a Expr>, CallFlags<'a>)> {
        let (prefix, complete) = static_call_prefix(args);
        let pattern = *prefix.first()?;
        let flags = match prefix.get(1) {
            Some(Some(flags)) => self.flags_of(Some(flags)),
            // A hole supplies `undefined`.
            Some(None) => CallFlags::Undefined,
            None if complete => CallFlags::Absent,
            // A spread after the pattern can supply the flags.
            None => CallFlags::Unknown,
        };
        Some((pattern, flags))
    }

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
    fn warn(&mut self, span: Span, feature: &str, reason: impl std::fmt::Display) {
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
    fn warn_message(&mut self, span: Span, message: &str) {
        if !span.is_dummy() && !self.warned.insert(span) {
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
            // A spread in the second position can supply the flags. A spread
            // after the flags argument cannot change it.
            Some(arg) if arg.spread.is_some() => CallFlags::Unknown,
            arg => self.flags_of(arg.map(|arg| &*arg.expr)),
        }
    }

    /// Classifies a flags argument, or a missing one.
    fn flags_of<'a>(&self, flags: Option<&'a Expr>) -> CallFlags<'a> {
        match flags {
            None => CallFlags::Absent,
            Some(expr) if self.is_global_undefined(expr) => CallFlags::Undefined,
            Some(expr) => match static_string(expr).and_then(|(_, flags)| flags.as_str()) {
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

    /// Returns true if `expr` is the global `undefined`, or a `void`
    /// expression (for example `void 0`), which always evaluates to
    /// `undefined`.
    fn is_global_undefined(&self, expr: &Expr) -> bool {
        match expr.unwrap_parens() {
            Expr::Ident(ident) if ident.sym == "undefined" => {
                self.global_ident(ident) == Some(RegExpCallee::Global)
            }
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => true,
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
    /// it is (for example also in `cond ? /a/ : /b/` or `re || /a/`). Without
    /// flags, the literals are recorded too, because the call does not copy
    /// the `groups` of a lowered named group.
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

        // A spread of an array literal supplies its elements in order, so the
        // pattern and the flags are known by position.
        if let Some((pattern, flags)) = self.pattern_and_flags(args) {
            let Some(pattern) = pattern else {
                return;
            };
            let kind = match flags {
                CallFlags::Absent | CallFlags::Undefined => ConstructorUse::CopiesPattern,
                CallFlags::Known(flags) => {
                    ConstructorUse::ReplacesFlags(Some(UnicodeMode::of(flags)))
                }
                CallFlags::Unknown => ConstructorUse::ReplacesFlags(None),
            };
            collect_pattern_literals(pattern, kind, &mut self.constructor_literals);
            return;
        }

        // A leading spread can supply the pattern and the flags, or nothing.
        // The pattern is then the first argument that is not spread, or an
        // element of a spread before it. A later argument cannot be the
        // pattern.
        for arg in args.iter() {
            collect_pattern_literals(
                &arg.expr,
                ConstructorUse::ReplacesFlags(None),
                &mut self.constructor_literals,
            );
            if arg.spread.is_none() {
                break;
            }
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
    fn lower_syntax(&mut self, span: Span, pattern: &str, flags: &str) -> Option<(String, String)> {
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
        let mut lowered_unicode_sets = false;

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
            lowered_unicode_sets = true;
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

        // Reported only when every step succeeded, because the pattern is
        // kept as written otherwise.
        if lowered_unicode_sets && self.options.unicode_regex {
            self.warn_message(
                span,
                "The `v` flag of this regular expression is lowered to the `u` flag, which the \
                 configured targets do not support. The regular expression can fail on those \
                 targets.",
            );
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
        // The expansion can put a lone lead surrogate next to a lone trail
        // surrogate, which a `u` pattern reads as one code point.
        // `v` patterns are not expanded, so there is no `\q{...}`.
        if flags.contains('u') {
            let printable = isolate_lone_surrogates(&mut ast);
            debug_assert!(printable);
        }

        // Serialize back to string
        Some(ast.to_string())
    }

    /// Transforms the arguments of a `RegExp` call. `callee` says whether the
    /// call is known to use the global `RegExp`.
    ///
    /// Only the pre-existing unicode property expansion rewrites the
    /// arguments. The `v` flag, modifiers and duplicate named groups are only
    /// reported, because a call can be a runtime feature check.
    fn transform_regexp_args(&mut self, args: &mut [ExprOrSpread], callee: RegExpCallee) {
        if callee == RegExpCallee::Global {
            match self.pattern_and_flags(args) {
                Some((Some(pattern), flags)) => self.warn_unlowered_call(pattern, flags),
                // A hole of a spread array supplies an `undefined` pattern,
                // which is the empty pattern. Only the flags can need support.
                Some((None, CallFlags::Known(flags)))
                    if self.options.unicode_sets_regex && flags.contains('v') =>
                {
                    if let Some(first) = args.first() {
                        let span = first.expr.span();
                        self.warn(
                            span,
                            "the `v` flag",
                            "only regex literals are lowered, not a `RegExp` call",
                        );
                    }
                }
                _ => {}
            }
        }

        let Some((pattern_arg, rest_args)) = args.split_first_mut() else {
            return;
        };
        if pattern_arg.spread.is_some() {
            return;
        }
        let call_flags = self.call_flags(rest_args);

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
    fn warn_unlowered_call(&mut self, pattern: &Expr, flags: CallFlags) {
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
    fn warn_duplicate_names_in_string(&mut self, span: Span, pattern: &str, flags: &str) {
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
    /// Returns `None` if parsing fails or if the pattern does not contain a
    /// group that an enabled option asks to lower.
    ///
    /// `keep_spelling` is set when an enclosing `RegExp` call can replace the
    /// flags. The pattern is then read with other flags, so it is lowered
    /// only if printing it again keeps every other term as written.
    fn extract_and_strip_named_groups(
        &mut self,
        span: Span,
        pattern: &str,
        flags: &str,
        keep_spelling: bool,
    ) -> Option<(String, Vec<(Atom, Vec<u32>)>)> {
        let mut ast =
            match LiteralParser::new(pattern, Some(flags), RegexpOptions::default()).parse() {
                Ok(ast) => ast,
                Err(_) => {
                    // A pattern that the parser rejects can still be valid on newer
                    // engines. Report it if it seems to reuse a group name.
                    if self.options.duplicate_named_capturing_groups_regex
                        && has_repeated_group_name(pattern)
                    {
                        self.warn(
                            span,
                            "possible duplicate named capturing groups",
                            "the pattern cannot be parsed",
                        );
                    }
                    return None;
                }
            };

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
        // The parser checks only roughly whether groups with the same name can
        // both take part in a match (it scans for `|` outside the AST). Keep
        // such a pattern: it is invalid, and the target must still reject it.
        if has_duplicates && !duplicate_groups_are_exclusive(&ast.body) {
            debug!(%pattern, "groups with the same name can both take part in a match");
            return None;
        }

        // An escape can be printed in another form (`\u{61}` as `\u0061`),
        // which another set of flags reads differently.
        if keep_spelling && ast.to_string() != pattern {
            self.warn(
                span,
                "named capturing groups",
                "the enclosing `RegExp` call can replace the flags, and the pattern cannot be \
                 printed again as written",
            );
            return None;
        }

        // Second pass: strip names from groups and convert named references
        NamedGroupStripper { mapping: &mapping }.strip_disjunction(&mut ast.body);
        // A `u` or `v` pattern reads two printed surrogates as one code point.
        // A `\q{...}` string with such surrogates cannot be printed, so the
        // pattern is kept as written.
        if flags.contains(['u', 'v']) && !isolate_lone_surrogates(&mut ast) {
            debug!(%pattern, "a `\\q{{...}}` string cannot be printed with separate surrogates");
            self.warn(
                span,
                "named capturing groups",
                "a `\\q{...}` string has a lone lead surrogate followed by a lone trail \
                 surrogate, which cannot be printed again as two characters",
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
                // A pattern that the parser rejects can still be valid on newer
                // engines (for example with a script name that the parser does
                // not know), so it is treated as one with modifiers.
                && LiteralParser::new(pattern, Some(flags), RegexpOptions::default())
                    .parse()
                    .map_or(true, |ast| has_modifiers(&ast)))
    }

    /// Build an object expression for the group name-to-index mapping.
    fn build_mapping_object(&self, mapping: Vec<(Atom, Vec<u32>)>) -> Expr {
        let num = |idx: u32| {
            Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: idx as f64,
                raw: None,
            }))
        };

        let mut proto = None;
        let mut props = Vec::with_capacity(mapping.len());
        for (name, indices) in mapping {
            // A unique name maps to a number, a duplicated one to an array of
            // numbers. `_wrap_reg_exp` picks the participating group.
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

            if name == "__proto__" {
                proto = Some(value);
                continue;
            }

            props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(IdentName {
                    span: DUMMY_SP,
                    sym: name,
                }),
                value: Box::new(value),
            }))));
        }

        let object = Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props,
        });

        // `__proto__: value` sets the prototype of the object, but the helper
        // reads the own properties. A computed key creates an own property,
        // but loose mode lowers it to an assignment, which sets the prototype
        // again. `_define_property` creates an own property in every mode.
        match proto {
            None => object,
            Some(value) => CallExpr {
                span: DUMMY_SP,
                callee: helper!(define_property),
                args: vec![
                    object.as_arg(),
                    Expr::from(Atom::from("__proto__")).as_arg(),
                    value.as_arg(),
                ],
                ..Default::default()
            }
            .into(),
        }
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
                let constructor_use = self
                    .constructor_literals
                    .iter()
                    .position(|&(literal, _)| literal == address)
                    .map(|idx| self.constructor_literals.swap_remove(idx).1);
                let in_constructor =
                    matches!(constructor_use, Some(ConstructorUse::ReplacesFlags(_)));
                // Unicode property escapes expand the same way for flags of
                // the same Unicode mode, so they are expanded only then (see
                // `transform_pattern` below).
                let expand_properties = match constructor_use {
                    Some(ConstructorUse::ReplacesFlags(mode)) => {
                        mode == Some(UnicodeMode::of(&regex.flags))
                    }
                    _ => true,
                };

                let property_escape = self.options.unicode_property_regex
                    && regex.flags.contains('u')
                    && (regex.exp.contains("\\p{") || regex.exp.contains("\\P{"));
                if in_constructor
                    && ((property_escape && !expand_properties)
                        || self.has_syntax_to_lower(&regex.exp, &regex.flags))
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

                // Try named groups transform first.
                if (self.options.named_capturing_groups_regex
                    || self.options.duplicate_named_capturing_groups_regex)
                    && may_have_named_groups(&regex.exp)
                {
                    let original_exp = regex.exp.clone();

                    if let Some((stripped_exp, group_mapping)) = self
                        .extract_and_strip_named_groups(
                            regex.span,
                            &original_exp,
                            &regex.flags,
                            in_constructor,
                        )
                    {
                        if constructor_use.is_some() {
                            // The call can copy the pattern of the wrapped
                            // regex, but not the group names that
                            // `_wrap_reg_exp` restores.
                            self.warn_message(
                                regex.span,
                                "The named capturing groups of this regular expression are \
                                 lowered for the configured targets, but the enclosing `RegExp` \
                                 call can copy only the pattern, so its matches can have no \
                                 `groups`.",
                            );
                        }

                        let Regex { flags, span, .. } = regex.take();

                        // Check if other transforms also need the regex to be a
                        // RegExp() constructor call
                        let needs_constructor =
                            self.needs_regexp_constructor(&stripped_exp, &flags);

                        let regex_arg: Expr = if needs_constructor {
                            // Apply unicode property transform if needed. When
                            // the enclosing call replaces the flags with flags
                            // of another Unicode mode, the expansion could be
                            // invalid with them.
                            let pattern = expand_properties
                                .then(|| self.transform_pattern(&stripped_exp, &flags))
                                .flatten()
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
                if self.needs_regexp_constructor(&regex.exp, &regex.flags) {
                    let Regex { exp, flags, span } = regex.take();

                    // Transform the pattern if it contains unicode property
                    // escapes. When the enclosing call replaces the flags with
                    // flags of another Unicode mode, the expansion could be
                    // invalid with them, so the pattern is kept.
                    let transformed_pattern = expand_properties
                        .then(|| self.transform_pattern(&exp, &flags))
                        .flatten()
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

/// Returns the leading arguments of a call whose positions are known, with
/// spreads of array literals expanded, and whether that is all of the
/// arguments. `None` is a hole of a spread array, which supplies `undefined`.
///
/// The prefix ends at the first spread of something else or at a nested
/// spread, because the number of values that they supply is not known. Only
/// the first two positions are needed, so the walk stops there.
fn static_call_prefix(args: &[ExprOrSpread]) -> (Vec<Option<&Expr>>, bool) {
    const NEEDED: usize = 2;

    let mut prefix = Vec::with_capacity(NEEDED);
    for arg in args {
        if prefix.len() >= NEEDED {
            // The later arguments cannot change the known positions.
            return (prefix, false);
        }
        if arg.spread.is_none() {
            prefix.push(Some(&*arg.expr));
            continue;
        }
        let Expr::Array(array) = arg.expr.unwrap_parens() else {
            return (prefix, false);
        };
        for elem in &array.elems {
            if prefix.len() >= NEEDED {
                return (prefix, false);
            }
            match elem {
                Some(elem) if elem.spread.is_none() => prefix.push(Some(&*elem.expr)),
                None => prefix.push(None),
                // A nested spread has an unknown length.
                Some(_) => return (prefix, false),
            }
        }
    }
    (prefix, true)
}

/// Collects the addresses of the regex literals that the pattern argument of a
/// `RegExp` call can evaluate to.
///
/// Only direct value positions are followed: parentheses, both branches of a
/// conditional (not the test), logical operators, the last expression of a
/// sequence, the right side of a plain or logical assignment and the elements
/// of an array (for a spread). A literal elsewhere, for example in a call that
/// computes the pattern, is not passed to `RegExp` directly, so it is lowered
/// as usual.
fn collect_pattern_literals(
    expr: &Expr,
    kind: ConstructorUse,
    literals: &mut Vec<(usize, ConstructorUse)>,
) {
    match expr {
        Expr::Lit(Lit::Regex(regex)) => literals.push((regex as *const Regex as usize, kind)),
        Expr::Paren(paren) => collect_pattern_literals(&paren.expr, kind, literals),
        Expr::Cond(cond) => {
            collect_pattern_literals(&cond.cons, kind, literals);
            collect_pattern_literals(&cond.alt, kind, literals);
        }
        Expr::Bin(bin) if matches!(bin.op, op!("||") | op!("??")) => {
            collect_pattern_literals(&bin.left, kind, literals);
            collect_pattern_literals(&bin.right, kind, literals);
        }
        // `a && b` evaluates to `a` only if `a` is falsy, and a regex is
        // truthy.
        Expr::Bin(bin) if bin.op == op!("&&") => {
            collect_pattern_literals(&bin.right, kind, literals);
        }
        Expr::Seq(seq) => {
            if let Some(last) = seq.exprs.last() {
                collect_pattern_literals(last, kind, literals);
            }
        }
        // `a = b` and the logical assignments can evaluate to `b`. The other
        // assignments compute a new value.
        Expr::Assign(assign)
            if matches!(assign.op, op!("=") | op!("||=") | op!("&&=") | op!("??=")) =>
        {
            collect_pattern_literals(&assign.right, kind, literals)
        }
        Expr::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pattern_literals(&elem.expr, kind, literals);
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

/// Returns true if the text of `pattern` has two `(?<name>` with the same
/// name. It is a check for a pattern that cannot be parsed, so escapes and
/// classes are not considered; a false positive only adds a warning.
fn has_repeated_group_name(pattern: &str) -> bool {
    let mut names = FxHashSet::default();
    pattern.match_indices("(?<").any(|(idx, _)| {
        let rest = &pattern[idx + 3..];
        if rest.starts_with(['=', '!']) {
            return false;
        }
        rest.find('>')
            .is_some_and(|end| !names.insert(&rest[..end]))
    })
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
                let name = decode_group_name(name);
                match mapping.iter_mut().find(|(n, _)| *n == name) {
                    Some((_, indices)) => indices.push(*counter),
                    None => mapping.push((name, vec![*counter])),
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
}

impl NamedGroupStripper<'_> {
    fn strip_disjunction(&self, disjunction: &mut Disjunction) {
        for alt in &mut disjunction.body {
            for term in &mut alt.body {
                self.strip_term(term);
            }

            // `\k<z>0` would become `\30`, which is another reference (or an
            // octal escape). Delimit a reference that a digit follows.
            for i in 1..alt.body.len() {
                if matches!(alt.body[i - 1], Term::IndexedReference(_))
                    && starts_with_digit(&alt.body[i])
                {
                    let reference =
                        std::mem::replace(&mut alt.body[i - 1], Term::Dot(Dot { span: DUMMY_SP }));
                    let span = reference.span();
                    alt.body[i - 1] = Term::IgnoreGroup(Box::new(IgnoreGroup {
                        span,
                        modifiers: None,
                        body: Disjunction {
                            span,
                            body: vec![Alternative {
                                span,
                                body: vec![reference],
                            }],
                        },
                    }));
                }
            }
        }
    }

    fn strip_term(&self, term: &mut Term) {
        // Check if this is a NamedReference that needs conversion
        if let Term::NamedReference(nr) = &*term {
            let name = decode_group_name(&nr.name);
            if let Some((_, indices)) = self.mapping.iter().find(|(n, _)| *n == name) {
                let span = nr.span;
                let reference =
                    |index: u32| Term::IndexedReference(Box::new(IndexedReference { span, index }));
                *term = match indices.as_slice() {
                    [index] => reference(*index),
                    // Groups that share a name are in different alternatives,
                    // so at most one of them takes part in a match. A
                    // reference to a group that did not take part matches the
                    // empty string, so `(?:\1\2)` matches the text of the
                    // group that took part, like `\k<name>`.
                    _ => Term::IgnoreGroup(Box::new(IgnoreGroup {
                        span,
                        modifiers: None,
                        body: Disjunction {
                            span,
                            body: vec![Alternative {
                                span,
                                body: indices.iter().map(|&index| reference(index)).collect(),
                            }],
                        },
                    })),
                };
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

/// Returns true if `term` is printed with a leading decimal digit.
fn starts_with_digit(term: &Term) -> bool {
    match term {
        Term::Character(ch) => {
            ch.kind == CharacterKind::Symbol
                && char::from_u32(ch.value).is_some_and(|c| c.is_ascii_digit())
        }
        Term::Quantifier(q) => starts_with_digit(&q.body),
        _ => false,
    }
}

/// Returns true if no two capturing groups with the same name can both take
/// part in a match (`MightBothParticipate` of ECMA-262 is false for each
/// pair): for each pair, the innermost disjunction that contains both has
/// them in different alternatives.
fn duplicate_groups_are_exclusive(disjunction: &Disjunction) -> bool {
    /// The disjunctions from the root to a group, as (disjunction id,
    /// alternative index) pairs.
    type Path = Vec<(u32, usize)>;

    fn visit_disjunction(
        disjunction: &Disjunction,
        path: &mut Path,
        next_id: &mut u32,
        groups: &mut Vec<(Atom, Path)>,
    ) {
        let id = *next_id;
        *next_id += 1;
        for (index, alt) in disjunction.body.iter().enumerate() {
            path.push((id, index));
            for term in &alt.body {
                visit_term(term, path, next_id, groups);
            }
            path.pop();
        }
    }

    fn visit_term(term: &Term, path: &mut Path, next_id: &mut u32, groups: &mut Vec<(Atom, Path)>) {
        match term {
            Term::CapturingGroup(g) => {
                if let Some(name) = &g.name {
                    groups.push((decode_group_name(name), path.clone()));
                }
                visit_disjunction(&g.body, path, next_id, groups);
            }
            Term::Quantifier(q) => visit_term(&q.body, path, next_id, groups),
            Term::LookAroundAssertion(la) => visit_disjunction(&la.body, path, next_id, groups),
            Term::IgnoreGroup(ig) => visit_disjunction(&ig.body, path, next_id, groups),
            _ => {}
        }
    }

    let mut groups = Vec::new();
    visit_disjunction(disjunction, &mut Vec::new(), &mut 0, &mut groups);

    // Insert the path of each group into a trie for its name. Two groups are
    // exclusive if their paths part at a disjunction, in different
    // alternatives. They can both take part if their paths part at two
    // different disjunctions in one alternative, or if one group is inside
    // the other. Each insertion takes time linear in the path length.
    #[derive(Default)]
    struct Node {
        /// The disjunction that every child edge goes through.
        child_disjunction: Option<u32>,
        has_children: bool,
        /// A group ends at this node.
        terminal: bool,
    }

    let mut nodes: Vec<Node> = Vec::new();
    let mut roots: FxHashMap<Atom, usize> = FxHashMap::default();
    let mut edges: FxHashMap<(usize, u32, usize), usize> = FxHashMap::default();

    for (name, path) in groups {
        let mut node = *roots.entry(name).or_insert_with(|| {
            nodes.push(Node::default());
            nodes.len() - 1
        });
        for (disjunction, alternative) in path {
            let current = &mut nodes[node];
            if current.terminal {
                // An earlier group contains this one.
                return false;
            }
            match current.child_disjunction {
                Some(existing) if existing != disjunction => return false,
                _ => current.child_disjunction = Some(disjunction),
            }
            current.has_children = true;
            node = *edges
                .entry((node, disjunction, alternative))
                .or_insert_with(|| {
                    nodes.push(Node::default());
                    nodes.len() - 1
                });
        }
        let end = &mut nodes[node];
        if end.terminal || end.has_children {
            // The groups are in one alternative, or this group contains an
            // earlier one.
            return false;
        }
        end.terminal = true;
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The pass is part of public pass types, which callers can require to be
    /// `Send` and `Sync`.
    #[test]
    fn pass_is_send_and_sync() {
        fn assert_send_sync<T: Send + Sync>(_: &T) {}
        assert_send_sync(&pass(Default::default()));
    }
}
