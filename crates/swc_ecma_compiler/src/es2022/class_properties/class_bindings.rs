//! Store for bindings for class.
//!
//! This module provides simplified binding management for class transformations
//! in SWC, replacing oxc's more complex semantic tracking system.

use swc_atoms::Atom;

use crate::context::TraverseCtx;

/// Store for bindings for class.
///
/// 1. Existing binding for class name (if class has a name).
/// 2. Temp var `_Class`, which may or may not be required.
///
/// Temp var is required in the following circumstances:
///
/// * Class expression has static properties. e.g. `C = class { static x = 1; }`
/// * Class declaration has static properties and one of the static prop's
///   initializers contains: a. `this` e.g. `class C { static x = this; }` b.
///   Reference to class name e.g. `class C { static x = C; }` c. A private
///   field referring to one of the class's static private props. e.g. `class C
///   { static #x; static y = obj.#x; }`
pub(super) struct ClassBindings {
    /// Binding for class name, if class has name
    pub name: Option<Atom>,
    /// Temp var for class.
    /// e.g. `_Class` in `_Class = class {}, _Class.x = 1, _Class`
    pub temp: Option<Atom>,
    /// Temp var for WeakSet (for private methods).
    pub brand: Option<Atom>,
    /// `true` if should use temp binding for references to class in transpiled
    /// static private fields, `false` if can use name binding
    pub static_private_fields_use_temp: bool,
    /// `true` if temp var for class has been inserted
    pub temp_var_is_created: bool,
}

impl ClassBindings {
    /// Create new `ClassBindings`.
    pub fn new(
        name_binding: Option<Atom>,
        temp_binding: Option<Atom>,
        brand_binding: Option<Atom>,
        static_private_fields_use_temp: bool,
        temp_var_is_created: bool,
    ) -> Self {
        Self {
            name: name_binding,
            temp: temp_binding,
            brand: brand_binding,
            static_private_fields_use_temp,
            temp_var_is_created,
        }
    }

    /// Create dummy `ClassBindings`.
    ///
    /// Used when class needs no transform, and for dummy entry at top of
    /// `ClassesStack`.
    pub fn dummy() -> Self {
        Self::new(None, None, None, false, false)
    }

    /// Get name as atom.
    pub fn name_atom(&self) -> Option<&Atom> {
        self.name.as_ref()
    }

    /// Get [`Atom`] for class brand.
    ///
    /// Only use this method when you are sure that [Self::brand] is not `None`,
    /// this will happen when there is a private method in the class.
    ///
    /// # Panics
    /// Panics if [Self::brand] is `None`.
    pub fn brand(&self) -> &Atom {
        self.brand.as_ref().unwrap()
    }

    /// Get binding to use for referring to class in transpiled static private
    /// fields.
    ///
    /// e.g. `Class` in `_assertClassBrand(Class, object, _prop)._` (class name)
    /// or `_Class` in `_assertClassBrand(_Class, object, _prop)._` (temp var)
    ///
    /// * In class expressions, this is always temp binding.
    /// * In class declarations, it's the name binding when code is inside class
    ///   body, and temp binding when code is outside class body.
    ///
    /// `static_private_fields_use_temp` is set accordingly at the right moments
    /// elsewhere in this transform.
    ///
    /// If a temp binding is required, and one doesn't already exist, a temp
    /// binding is created.
    pub fn get_or_init_static_binding(&mut self, _ctx: &mut TraverseCtx) -> &Atom {
        if self.static_private_fields_use_temp {
            // Create temp binding if doesn't already exist
            self.temp
                .get_or_insert_with(|| Self::create_temp_binding_name(self.name.as_ref()))
        } else {
            // `static_private_fields_use_temp` is always `true` for class expressions.
            // Class declarations always have a name binding if they have any static props.
            // So `unwrap` here cannot panic.
            self.name.as_ref().unwrap()
        }
    }

    /// Generate binding name for temp var.
    pub fn create_temp_binding(name_binding: Option<&Atom>, _ctx: &mut TraverseCtx) -> Atom {
        Self::create_temp_binding_name(name_binding)
    }

    /// Generate binding name for temp var.
    fn create_temp_binding_name(name_binding: Option<&Atom>) -> Atom {
        // Base temp binding name on class name, or "Class" if no name.
        let name = name_binding.map_or("Class", |atom| atom.as_str());
        // Simple UID generation - just prepend underscore
        // In a full implementation, this would check for conflicts
        Atom::from(format!("_{name}"))
    }
}
