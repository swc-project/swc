//! Based on `modifiers.rs` of [oxc](https://github.com/oxc-project/oxc/blob/21c7b090dd61e6944356d3de9164395c9f7c10fb/crates/oxc_parser/src/modifiers.rs)

use bitflags::bitflags;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::Accessibility;

use super::{
    lexer::{Kind, Token},
    Result,
};
use crate::diagnostics::{self, Diagnostic};

bitflags! {
  /// Bitflag of modifiers and contextual modifiers.
  /// Useful to cheaply track all already seen modifiers of a member (instead of using a HashSet<ModifierKind>).
  #[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
  pub struct ModifierFlags: u16 {
      const DECLARE       = 1 << 0;
      const PRIVATE       = 1 << 1;
      const PROTECTED     = 1 << 2;
      const PUBLIC        = 1 << 3;
      const STATIC        = 1 << 4;
      const READONLY      = 1 << 5;
      const ABSTRACT      = 1 << 6;
      const OVERRIDE      = 1 << 7;
      const ASYNC         = 1 << 8;
      const CONST         = 1 << 9;
      const IN            = 1 << 10;
      const OUT           = 1 << 11;
      const EXPORT        = 1 << 12;
      const DEFAULT       = 1 << 13;
      const ACCESSOR      = 1 << 14;
      const ACCESSIBILITY = Self::PRIVATE.bits() | Self::PROTECTED.bits() | Self::PUBLIC.bits();
  }
}

/// It is the caller's safety to always check by `Kind::is_modifier_kind`
/// before converting [`Kind`] to [`ModifierFlags`] so that we can assume here
/// that the conversion always succeeds.
impl From<Kind> for ModifierFlags {
    fn from(value: Kind) -> Self {
        match value {
            Kind::Abstract => Self::ABSTRACT,
            Kind::Declare => Self::DECLARE,
            Kind::Private => Self::PRIVATE,
            Kind::Protected => Self::PROTECTED,
            Kind::Public => Self::PUBLIC,
            Kind::Static => Self::STATIC,
            Kind::Readonly => Self::READONLY,
            Kind::Override => Self::OVERRIDE,
            Kind::Async => Self::ASYNC,
            Kind::Const => Self::CONST,
            Kind::In => Self::IN,
            Kind::Out => Self::OUT,
            Kind::Export => Self::EXPORT,
            Kind::Default => Self::DEFAULT,
            Kind::Accessor => Self::ACCESSOR,
            _ => unreachable!(),
        }
    }
}

impl From<ModifierKind> for ModifierFlags {
    fn from(kind: ModifierKind) -> Self {
        match kind {
            ModifierKind::Abstract => Self::ABSTRACT,
            ModifierKind::Declare => Self::DECLARE,
            ModifierKind::Private => Self::PRIVATE,
            ModifierKind::Protected => Self::PROTECTED,
            ModifierKind::Public => Self::PUBLIC,
            ModifierKind::Static => Self::STATIC,
            ModifierKind::Readonly => Self::READONLY,
            ModifierKind::Override => Self::OVERRIDE,
            ModifierKind::Async => Self::ASYNC,
            ModifierKind::Const => Self::CONST,
            ModifierKind::In => Self::IN,
            ModifierKind::Out => Self::OUT,
            ModifierKind::Export => Self::EXPORT,
            ModifierKind::Default => Self::DEFAULT,
            ModifierKind::Accessor => Self::ACCESSOR,
        }
    }
}

impl ModifierFlags {
    pub(crate) fn accessibility(self) -> Option<Accessibility> {
        if self.contains(Self::PUBLIC) {
            return Some(Accessibility::Public);
        }
        if self.contains(Self::PROTECTED) {
            return Some(Accessibility::Protected);
        }

        if self.contains(Self::PRIVATE) {
            return Some(Accessibility::Private);
        }
        None
    }
}

#[derive(Debug, Hash)]
pub struct Modifier {
    pub span: Span,
    pub kind: ModifierKind,
}
impl Modifier {
    #[inline]
    pub fn is_static(&self) -> bool {
        matches!(self.kind, ModifierKind::Static)
    }
}
impl TryFrom<Token> for Modifier {
    type Error = <ModifierKind as TryFrom<Kind>>::Error;

    fn try_from(tok: Token) -> std::result::Result<Self, Self::Error> {
        ModifierKind::try_from(tok.kind).map(|kind| Self {
            span: tok.span(),
            kind,
        })
    }
}

/// Symbol modifiers. Primarily used in TypeScript code, but some are also used
/// in JavaScript.
///
/// ```ts
/// class Foo {
///     public readonly x: number
/// //  ^^^^^^ ^^^^^^^^
/// // these are modifiers
/// }
/// export const f = new foo()
/// // ^^^ This also counts as a modifier, but is also recorded separately as a
/// // named export declaration
/// ```
#[derive(Debug, Hash)]
pub struct Modifiers<'a> {
    /// May contain duplicates.
    modifiers: Option<Vec<'a, Modifier>>,
    /// Bitflag representation of modifier kinds stored in [`Self::modifiers`].
    /// Pre-computed to save CPU cycles on [`Self::contains`] checks (`O(1)`
    /// bitflag intersection vs `O(n)` linear search).
    flags: ModifierFlags,
}

impl<'a> Default for Modifiers<'a> {
    fn default() -> Self {
        Self::empty()
    }
}

impl<'a> Modifiers<'a> {
    /// Create a new set of modifiers
    ///
    /// # Invariants
    /// `flags` must correctly reflect the [`ModifierKind`]s within
    ///  `modifiers`. E.g., if `modifiers` is empty, then so is `flags``.
    #[must_use]
    pub(crate) fn new(modifiers: Vec<'a, Modifier>, flags: ModifierFlags) -> Self {
        if modifiers.is_empty() {
            debug_assert!(flags.is_empty());
            Self::empty()
        } else {
            Self {
                modifiers: Some(modifiers),
                flags,
            }
        }
    }

    pub fn empty() -> Self {
        Self {
            modifiers: None,
            flags: ModifierFlags::empty(),
        }
    }

    pub fn contains(&self, target: ModifierKind) -> bool {
        self.flags.contains(target.into())
    }

    pub fn iter(&self) -> impl Iterator<Item = &Modifier> + '_ {
        self.modifiers
            .as_ref()
            .into_iter()
            .flat_map(|modifiers| modifiers.iter())
    }

    pub fn accessibility(&self) -> Option<Accessibility> {
        self.flags.accessibility()
    }

    #[inline]
    pub fn contains_async(&self) -> bool {
        self.flags.contains(ModifierFlags::ASYNC)
    }

    #[inline]
    pub fn contains_const(&self) -> bool {
        self.flags.contains(ModifierFlags::CONST)
    }

    #[inline]
    pub fn contains_declare(&self) -> bool {
        self.flags.contains(ModifierFlags::DECLARE)
    }

    #[inline]
    pub fn contains_abstract(&self) -> bool {
        self.flags.contains(ModifierFlags::ABSTRACT)
    }

    #[inline]
    pub fn contains_readonly(&self) -> bool {
        self.flags.contains(ModifierFlags::READONLY)
    }

    #[inline]
    pub fn contains_override(&self) -> bool {
        self.flags.contains(ModifierFlags::OVERRIDE)
    }
}

impl Spanned for Modifiers<'_> {
    fn span(&self) -> Span {
        let Some(modifiers) = &self.modifiers else {
            return DUMMY_SP;
        };
        debug_assert!(!modifiers.is_empty());
        // SAFETY: One of Modifier's invariants is that Some(modifiers) always
        // contains a non-empty Vec; otherwise it must be `None`.

        unsafe {
            modifiers
                .iter()
                .map(|m| m.span)
                .reduce(|a, b| a.merge(&b))
                .unwrap_unchecked()
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ModifierKind {
    Abstract,
    Accessor,
    Async,
    Const,
    Declare,
    Default,
    Export,
    In,
    Public,
    Private,
    Protected,
    Readonly,
    Static,
    Out,
    Override,
}

impl ModifierKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Abstract => "abstract",
            Self::Accessor => "accessor",
            Self::Async => "async",
            Self::Const => "const",
            Self::Declare => "declare",
            Self::Default => "default",
            Self::Export => "export",
            Self::In => "in",
            Self::Public => "public",
            Self::Private => "private",
            Self::Protected => "protected",
            Self::Readonly => "readonly",
            Self::Static => "static",
            Self::Out => "out",
            Self::Override => "override",
        }
    }
}
impl TryFrom<Kind> for ModifierKind {
    type Error = ();

    fn try_from(kind: Kind) -> std::result::Result<Self, Self::Error> {
        match kind {
            Kind::Abstract => Ok(Self::Abstract),
            Kind::Declare => Ok(Self::Declare),
            Kind::Private => Ok(Self::Private),
            Kind::Protected => Ok(Self::Protected),
            Kind::Public => Ok(Self::Public),
            Kind::Static => Ok(Self::Static),
            Kind::Readonly => Ok(Self::Readonly),
            Kind::Override => Ok(Self::Override),
            Kind::Async => Ok(Self::Async),
            Kind::Const => Ok(Self::Const),
            Kind::In => Ok(Self::In),
            Kind::Out => Ok(Self::Out),
            Kind::Export => Ok(Self::Export),
            Kind::Default => Ok(Self::Default),
            Kind::Accessor => Ok(Self::Accessor),
            _ => Err(()),
        }
    }
}

impl std::fmt::Display for ModifierKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}

impl<'a> ParserImpl<'a> {
    pub(crate) fn eat_modifiers_before_declaration(&mut self) -> Result<Modifiers<'a>> {
        let mut flags = ModifierFlags::empty();
        let mut modifiers = self.ast.vec();
        while self.at_modifier() {
            let span = self.start_span();
            let modifier_flag = self.cur_kind().into();
            let kind = self.cur_kind();
            self.bump_any();
            let modifier = self.modifier(kind, self.end_span(span))?;
            self.check_for_duplicate_modifiers(flags, &modifier);
            flags.set(modifier_flag, true);
            modifiers.push(modifier);
        }
        Ok(Modifiers::new(modifiers, flags))
    }

    fn at_modifier(&mut self) -> bool {
        self.lookahead(Self::at_modifier_worker)
    }

    fn at_modifier_worker(&mut self) -> bool {
        if !self.cur_kind().is_modifier_kind() {
            return false;
        }

        match self.cur_kind() {
            Kind::Const => !self.peek_token().is_on_new_line && self.peek_kind() == Kind::Enum,
            Kind::Export => {
                self.bump_any();
                match self.cur_kind() {
                    Kind::Default => self.next_token_can_follow_default_keyword(),
                    Kind::Type => {
                        self.bump_any();
                        self.can_follow_export_modifier()
                    }
                    _ => self.can_follow_modifier(),
                }
            }
            Kind::Default => self.next_token_can_follow_default_keyword(),
            Kind::Accessor | Kind::Static | Kind::Get | Kind::Set => {
                // These modifiers can cross line.
                self.bump_any();
                self.can_follow_modifier()
            }
            // Rest modifiers cannot cross line
            _ => {
                self.bump_any();
                self.can_follow_modifier() && !self.cur_token().is_on_new_line
            }
        }
    }

    fn modifier(&mut self, kind: Kind, span: Span) -> Result<Modifier> {
        Ok(Modifier {
            span,
            kind: kind.try_into().map_err(|()| self.unexpected())?,
        })
    }

    pub(crate) fn parse_modifiers(
        &mut self,
        allow_decorators: bool,
        permit_const_as_modifier: bool,
        stop_on_start_of_class_static_block: bool,
    ) -> Modifiers<'a> {
        let mut has_seen_static_modifier = false;
        let mut has_leading_modifier = false;
        let mut has_trailing_decorator = false;

        let mut modifiers = self.ast.vec();
        let mut modifier_flags = ModifierFlags::empty();

        // parse leading decorators
        if allow_decorators && matches!(self.cur_kind(), Kind::At) {
            self.try_parse(Self::eat_decorators);
        }

        // parse leading modifiers
        while let Some(modifier) = self.try_parse_modifier(
            has_seen_static_modifier,
            permit_const_as_modifier,
            stop_on_start_of_class_static_block,
        ) {
            if modifier.is_static() {
                has_seen_static_modifier = true;
            }
            self.check_for_duplicate_modifiers(modifier_flags, &modifier);
            modifier_flags.set(modifier.kind.into(), true);
            modifiers.push(modifier);
            has_leading_modifier = true;
        }

        // parse trailing decorators, but only if we parsed any leading modifiers
        if allow_decorators && has_leading_modifier && matches!(self.cur_kind(), Kind::At) {
            has_trailing_decorator = self.try_parse(Self::eat_decorators).is_some();
        }

        // parse trailing modifiers, but only if we parsed any trailing decorators
        if has_trailing_decorator {
            while let Some(modifier) = self.try_parse_modifier(
                has_seen_static_modifier,
                permit_const_as_modifier,
                stop_on_start_of_class_static_block,
            ) {
                if modifier.is_static() {
                    has_seen_static_modifier = true;
                }
                self.check_for_duplicate_modifiers(modifier_flags, &modifier);
                modifier_flags.set(modifier.kind.into(), true);
                modifiers.push(modifier);
            }
        }

        Modifiers::new(modifiers, modifier_flags)
    }

    fn try_parse_modifier(
        &mut self,
        has_seen_static_modifier: bool,
        permit_const_as_modifier: bool,
        stop_on_start_of_class_static_block: bool,
    ) -> Option<Modifier> {
        let span = self.start_span();
        let kind = self.cur_kind();

        if matches!(self.cur_kind(), Kind::Const) {
            if !permit_const_as_modifier {
                return None;
            }

            // We need to ensure that any subsequent modifiers appear on the same line
            // so that when 'const' is a standalone declaration, we don't issue
            // an error.
            self.try_parse(Self::try_next_token_is_on_same_line_and_can_follow_modifier)?;
        } else if
        // we're at the start of a static block
        (stop_on_start_of_class_static_block
            && matches!(self.cur_kind(), Kind::Static)
            && self.lookahead(Self::next_token_is_open_brace))
            // we may be at the start of a static block
            || (has_seen_static_modifier && matches!(self.cur_kind(), Kind::Static))
            // next token is not a modifier
            || (!self.parse_any_contextual_modifier())
        {
            return None;
        }
        self.modifier(kind, self.end_span(span)).ok()
    }

    fn next_token_is_open_brace(&mut self) -> bool {
        self.bump_any();
        self.at(Kind::LCurly)
    }

    fn parse_any_contextual_modifier(&mut self) -> bool {
        self.cur_kind().is_modifier_kind()
            && self
                .try_parse(Self::next_token_can_follow_modifier)
                .is_some()
    }

    fn next_token_can_follow_modifier(&mut self) -> Result<()> {
        let b = match self.cur_kind() {
            Kind::Const => self.peek_at(Kind::Enum),
            Kind::Export => {
                self.bump_any();
                match self.cur_kind() {
                    Kind::Default => self.lookahead(Self::next_token_can_follow_default_keyword),
                    Kind::Type => self.lookahead(Self::next_token_can_follow_export_modifier),
                    _ => self.can_follow_export_modifier(),
                }
            }
            Kind::Default => self.next_token_can_follow_default_keyword(),
            Kind::Static | Kind::Get | Kind::Set => {
                self.bump_any();
                self.can_follow_modifier()
            }
            _ => self.next_token_is_on_same_line_and_can_follow_modifier(),
        };
        if b {
            Ok(())
        } else {
            Err(self.unexpected())
        }
    }

    fn try_next_token_is_on_same_line_and_can_follow_modifier(&mut self) -> Result<()> {
        if self.next_token_is_on_same_line_and_can_follow_modifier() {
            Ok(())
        } else {
            Err(self.unexpected())
        }
    }

    fn next_token_is_on_same_line_and_can_follow_modifier(&mut self) -> bool {
        self.bump_any();
        if self.cur_token().is_on_new_line {
            return false;
        }
        self.can_follow_modifier()
    }

    fn next_token_can_follow_default_keyword(&mut self) -> bool {
        self.bump_any();
        match self.cur_kind() {
            Kind::Class | Kind::Function | Kind::Interface | Kind::At => true,
            Kind::Abstract if self.lookahead(Self::next_token_is_class_keyword_on_same_line) => {
                true
            }
            Kind::Async if self.lookahead(Self::next_token_is_function_keyword_on_same_line) => {
                true
            }
            _ => false,
        }
    }

    fn next_token_can_follow_export_modifier(&mut self) -> bool {
        self.bump_any();
        self.can_follow_export_modifier()
    }

    fn can_follow_export_modifier(&mut self) -> bool {
        let kind = self.cur_kind();
        kind == Kind::At
            && kind != Kind::Star
            && kind != Kind::As
            && kind != Kind::LCurly
            && self.can_follow_modifier()
    }

    fn can_follow_modifier(&mut self) -> bool {
        match self.cur_kind() {
            Kind::PrivateIdentifier | Kind::LBrack | Kind::LCurly | Kind::Star | Kind::Dot3 => true,
            kind => kind.is_identifier_or_keyword(),
        }
    }

    fn next_token_is_class_keyword_on_same_line(&mut self) -> bool {
        self.bump_any();
        self.cur_kind() == Kind::Class && !self.cur_token().is_on_new_line
    }

    fn next_token_is_function_keyword_on_same_line(&mut self) -> bool {
        self.bump_any();
        self.cur_kind() == Kind::Function && !self.cur_token().is_on_new_line
    }

    fn check_for_duplicate_modifiers(&mut self, seen_flags: ModifierFlags, modifier: &Modifier) {
        if seen_flags.contains(modifier.kind.into()) {
            self.error(diagnostics::modifier_already_seen(modifier));
        }
    }

    pub(crate) fn verify_modifiers<F>(
        &mut self,
        modifiers: &Modifiers<'a>,
        allowed: ModifierFlags,
        diagnose: F,
    ) where
        F: Fn(&Modifier) -> Diagnostic,
    {
        for modifier in modifiers.iter() {
            if !allowed.contains(modifier.kind.into()) {
                self.error(diagnose(modifier));
            }
        }
    }
}
