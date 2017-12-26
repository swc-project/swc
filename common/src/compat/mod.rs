//! Tracking for used html5 features.

use fnv::FnvHashSet;
use std::ops::{Add, AddAssign};

/// # Derive
///
/// This trait can be derived with `#[derive(AstNode)]`.
///
/// `#[caniuse = "feature-a"]` has different meaning depending on context.
///
///
/// - type means
/// "feature-a is required if the type is constructed"
///
/// ```rust,ignore
///
/// #[ast_node]
/// #[caniuse = "es6-class"]
/// pub struct Class {
///   pub span: Span,
///   pub super_class: Option<Box<Expr>>,
///   pub body: Vec<MethodDef>,
/// }
/// ```
///
///
/// - enum variant means
/// "feature-a is required if value of enum is this variant"
///
/// ```rust,ignore
///
/// #[ast_node]
/// pub enum VarDeclKind {
///   Var,
///   #[caniuse = "let"]
///   Let,
///   #[caniuse = "const"]
///   Const,
/// }
/// ```
///
///
///
/// - bool field means
/// "feature-a is required if value is true"
///
/// ```rust,ignore
///
/// #[ast_node]
/// pub struct Func {
///   #[caniuse = "es6-generators"]
///   pub is_generator: bool,
///   #[caniuse = "async-functions"]
///   pub is_async: bool,
/// }
/// ```
///
///
pub trait CanIUse {
    fn report_used_features(&self, features: &mut UsedFeatures);
}

/// Feature from `caniuse.com`.
/// TODO: Make this enum?
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Feature(&'static str);

impl Feature {
    /// not public api
    #[doc(hidden)]
    pub const fn new(s: &'static str) -> Self {
        Feature(s)
    }

    pub fn as_str(self) -> &'static str {
        self.0
    }
}

/// Creates a `caniuse::compat::Feature` with given string.
#[macro_export]
macro_rules! caniuse_feature {
    ($s:expr) => {{
        $crate::compat::Feature::new($s)
    }}
}

#[derive(Debug, Clone, Default)]
pub struct UsedFeatures {
    feats: FnvHashSet<Feature>,
}

impl UsedFeatures {
    pub fn finalize(self) -> FnvHashSet<Feature> {
        self.feats
    }
}

impl Add<Feature> for UsedFeatures {
    type Output = Self;
    fn add(mut self, rhs: Feature) -> Self {
        self += rhs;
        self
    }
}

impl AddAssign<Feature> for UsedFeatures {
    fn add_assign(&mut self, rhs: Feature) {
        self.feats.insert(rhs);
    }
}
