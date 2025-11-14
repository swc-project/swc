//! ES2022: Class Properties
//! Transform `super` expressions in class properties.
//!
//! Stub implementation for SWC.

/// Mode for super converter
pub(super) enum ClassPropertiesSuperConverterMode {
    /// Normal mode
    Normal,
    /// Static mode
    Static,
}

/// Converter for super expressions
pub(super) struct ClassPropertiesSuperConverter {
    /// Mode
    pub mode: ClassPropertiesSuperConverterMode,
}

impl ClassPropertiesSuperConverter {
    /// Create new converter
    pub fn new(mode: ClassPropertiesSuperConverterMode) -> Self {
        Self { mode }
    }
}
