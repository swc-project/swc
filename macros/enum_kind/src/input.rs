use syn::*;

/// Parsed input.
#[derive(Debug)]
pub struct Input {
    pub attrs: EnumAttrs,
    /// Name of enum.
    pub name: Ident,
    pub vis: Visibility,
    pub generics: Generics,

    pub variants: Vec<EnumVar>,
}

///
#[derive(Debug, Default)]
pub struct EnumAttrs {
    pub fns: Vec<FnDef>,
    pub extras: Vec<Attribute>,
}

/// Function to generate.
///
/// `#[kind(function(name = "bool"))]`
#[derive(Debug)]
pub struct FnDef {
    /// Name of function.
    pub name: Ident,
    pub return_type: Type,

    pub default_value: Option<Expr>,
}

/// Variant of enum.
#[derive(Debug)]
pub struct EnumVar {
    /// Name of variant.
    pub name: Ident,
    pub attrs: VariantAttrs,
    pub data: Fields,
}

/// Parsed attributes.
#[derive(Debug, Default)]
pub struct VariantAttrs {
    pub fn_values: Vec<VariantAttr>,
    pub extras: Vec<Attribute>,
    /// Does this variant has `#[kind(delegate)]`?
    pub has_delegate: bool,
}

#[derive(Debug)]
pub struct VariantAttr {
    pub fn_name: Ident,
    pub value: Option<Expr>,
}
