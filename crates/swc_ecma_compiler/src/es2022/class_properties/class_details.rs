//! Details of a class and private properties tracking.
//!
//! This module provides a simplified version of oxc's ClassDetails,
//! adapted for SWC's architecture without full semantic analysis.

use swc_atoms::Atom;
use swc_ecma_ast::*;

use super::{ClassBindings, ClassProperties, FxIndexMap};

/// Details of a class.
///
/// These are stored in `ClassesStack`.
pub(super) struct ClassDetails {
    /// `true` for class declaration, `false` for class expression
    pub is_declaration: bool,
    /// `true` if class requires no transformation
    pub is_transform_required: bool,
    /// Private properties.
    /// Mapping private prop name to binding for temp var.
    /// This is then used as lookup when transforming e.g. `this.#x`.
    /// `None` if class has no private properties.
    pub private_props: Option<FxIndexMap<Atom, PrivateProp>>,
    /// Bindings for class name and temp var for class
    pub bindings: ClassBindings,
}

impl ClassDetails {
    /// Create dummy `ClassDetails`.
    ///
    /// Used for dummy entry at top of `ClassesStack`.
    pub fn dummy(is_declaration: bool) -> Self {
        Self {
            is_declaration,
            is_transform_required: false,
            private_props: None,
            bindings: ClassBindings::dummy(),
        }
    }
}

/// Details of a private property.
pub(super) struct PrivateProp {
    pub binding: Atom,
    pub is_static: bool,
    pub method_kind: Option<MethodKind>,
    pub is_accessor: bool,
    // For accessor methods, they have two bindings,
    // one for getter and another for setter.
    pub binding2: Option<Atom>,
}

impl PrivateProp {
    pub fn new(
        binding: Atom,
        is_static: bool,
        method_kind: Option<MethodKind>,
        is_accessor: bool,
    ) -> Self {
        Self {
            binding,
            is_static,
            method_kind,
            is_accessor,
            binding2: None,
        }
    }

    pub fn is_method(&self) -> bool {
        self.method_kind.is_some()
    }

    pub fn is_accessor(&self) -> bool {
        self.is_accessor
            || self
                .method_kind
                .as_ref()
                .is_some_and(MethodKind::is_accessor)
    }

    pub fn set_binding2(&mut self, binding: Atom) {
        self.binding2 = Some(binding);
    }
}

/// Stack of `ClassDetails`.
///
/// Pushed to when entering a class, popped when exiting.
///
/// We use a custom stack to make `last` and `last_mut` cheap (these are used
/// a lot). The first entry is a dummy.
///
/// This is a separate structure, rather than just storing stack as a property
/// of `ClassProperties` to work around borrow-checker. You can call
/// `find_private_prop` and retain the return value without holding a mut borrow
/// of the whole of `&mut ClassProperties`. This allows accessing other
/// properties of `ClassProperties` while that borrow is held.
pub(super) struct ClassesStack {
    stack: Vec<ClassDetails>,
}

impl ClassesStack {
    /// Create new `ClassesStack`.
    pub fn new() -> Self {
        // Default stack capacity is 4. That's probably good. More than 4 nested
        // classes is rare.
        let mut stack = Vec::with_capacity(4);
        stack.push(ClassDetails::dummy(false));
        Self { stack }
    }

    /// Push an entry to stack.
    #[inline]
    pub fn push(&mut self, class: ClassDetails) {
        self.stack.push(class);
    }

    /// Pop last entry from stack.
    #[inline]
    pub fn pop(&mut self) -> ClassDetails {
        self.stack
            .pop()
            .expect("ClassesStack should never be empty")
    }

    /// Get details of current class.
    #[inline]
    pub fn last(&self) -> &ClassDetails {
        self.stack
            .last()
            .expect("ClassesStack should never be empty")
    }

    /// Get details of current class as `&mut` reference.
    #[inline]
    pub fn last_mut(&mut self) -> &mut ClassDetails {
        self.stack
            .last_mut()
            .expect("ClassesStack should never be empty")
    }

    fn lookup_private_prop<
        'b,
        Ret,
        RetFn: Fn(&'b PrivateProp, &'b mut ClassBindings, bool) -> Ret,
    >(
        &'b mut self,
        ident: &PrivateName,
        ret_fn: RetFn,
    ) -> Ret {
        // Check for binding in closest class first, then enclosing classes.
        // We skip the first, because it's a dummy first entry.
        for class in self.stack[1..].iter_mut().rev() {
            if let Some(private_props) = &mut class.private_props {
                if let Some(prop) = private_props.get(&ident.id.sym) {
                    return ret_fn(prop, &mut class.bindings, class.is_declaration);
                }
            }
        }
        unreachable!("Private property not found: {:?}", ident.id.sym);
    }

    /// Lookup details of private property referred to by `ident`.
    pub fn find_private_prop<'b>(&'b mut self, ident: &PrivateName) -> ResolvedPrivateProp<'b> {
        self.lookup_private_prop(ident, move |prop, class_bindings, is_declaration| {
            ResolvedPrivateProp {
                prop_binding: &prop.binding,
                class_bindings,
                is_static: prop.is_static,
                is_method: prop.is_method(),
                is_accessor: prop.is_accessor(),
                is_declaration,
            }
        })
    }

    /// Lookup details of readable private property referred to by `ident`.
    pub fn find_readable_private_prop<'b>(
        &'b mut self,
        ident: &PrivateName,
    ) -> Option<ResolvedPrivateProp<'b>> {
        self.lookup_private_prop(ident, move |prop, class_bindings, is_declaration| {
            let prop_binding = if matches!(prop.method_kind, Some(MethodKind::Setter)) {
                prop.binding2.as_ref()
            } else {
                Some(&prop.binding)
            };
            prop_binding.map(|prop_binding| ResolvedPrivateProp {
                prop_binding,
                class_bindings,
                is_static: prop.is_static,
                is_method: prop.is_method(),
                is_accessor: prop.is_accessor(),
                is_declaration,
            })
        })
    }

    /// Lookup details of writeable private property referred to by `ident`.
    /// Returns `Some` if it refers to a private prop and setter method
    pub fn find_writeable_private_prop<'b>(
        &'b mut self,
        ident: &PrivateName,
    ) -> Option<ResolvedPrivateProp<'b>> {
        self.lookup_private_prop(ident, move |prop, class_bindings, is_declaration| {
            let prop_binding = if matches!(prop.method_kind, Some(MethodKind::Setter) | None) {
                Some(&prop.binding)
            } else {
                prop.binding2.as_ref()
            };
            prop_binding.map(|prop_binding| ResolvedPrivateProp {
                prop_binding,
                class_bindings,
                is_static: prop.is_static,
                is_method: prop.is_method(),
                is_accessor: prop.is_accessor(),
                is_declaration,
            })
        })
    }

    /// Look up details of the private property referred to by ident and it can
    /// either be read or written.
    pub fn find_get_set_private_prop<'b>(
        &'b mut self,
        ident: &PrivateName,
    ) -> ResolvedGetSetPrivateProp<'b> {
        self.lookup_private_prop(ident, move |prop, class_bindings, is_declaration| {
            let (get_binding, set_binding) = match prop.method_kind {
                Some(MethodKind::Setter) => (prop.binding2.as_ref(), Some(&prop.binding)),
                Some(_) => (Some(&prop.binding), prop.binding2.as_ref()),
                _ => (Some(&prop.binding), Some(&prop.binding)),
            };
            ResolvedGetSetPrivateProp {
                get_binding,
                set_binding,
                class_bindings,
                is_static: prop.is_static,
                is_method: prop.is_method(),
                is_accessor: prop.is_accessor(),
                is_declaration,
            }
        })
    }
}

/// Details of a private property resolved for a private field.
///
/// This is the return value of [`ClassesStack::find_private_prop`],
/// [`ClassesStack::find_readable_private_prop`] and
/// [`ClassesStack::find_writeable_private_prop`].
pub(super) struct ResolvedPrivateProp<'b> {
    /// Binding for temp var representing the property
    pub prop_binding: &'b Atom,
    /// Bindings for class name and temp var for class
    pub class_bindings: &'b mut ClassBindings,
    /// `true` if is a static property
    pub is_static: bool,
    /// `true` if is a private method or accessor property
    pub is_method: bool,
    /// `true` if is a private accessor property or [`PrivateProp::method_kind`]
    /// is `Some(MethodKind::Getter)` or `Some(MethodKind::Setter)`
    pub is_accessor: bool,
    /// `true` if class which defines this property is a class declaration
    pub is_declaration: bool,
}

/// Details of a private property resolved for a private field.
///
/// This is the return value of [`ClassesStack::find_get_set_private_prop`].
pub(super) struct ResolvedGetSetPrivateProp<'b> {
    /// Binding for temp var representing the property or getter method
    pub get_binding: Option<&'b Atom>,
    /// Binding for temp var representing the property or setter method
    pub set_binding: Option<&'b Atom>,
    /// Bindings for class name and temp var for class
    pub class_bindings: &'b mut ClassBindings,
    /// `true` if is a static property
    pub is_static: bool,
    /// `true` if is a private method or accessor property
    pub is_method: bool,
    /// `true` if is a private accessor property or [`PrivateProp::method_kind`]
    /// is `Some(MethodKind::Getter)` or `Some(MethodKind::Setter)`
    #[expect(unused)]
    pub is_accessor: bool,
    /// `true` if class which defines this property is a class declaration
    pub is_declaration: bool,
}

// Shortcut methods to get current class
impl<'a> ClassProperties<'a, '_> {
    /// Get details of current class.
    pub(super) fn current_class(&self) -> &ClassDetails {
        self.classes_stack.last()
    }

    /// Get details of current class as `&mut` reference.
    pub(super) fn current_class_mut(&mut self) -> &mut ClassDetails {
        self.classes_stack.last_mut()
    }
}
