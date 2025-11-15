use oxc_ast::ast::*;
use oxc_data_structures::stack::NonEmptyStack;
use oxc_span::Atom;
use oxc_traverse::BoundIdentifier;

use super::{ClassBindings, ClassProperties, FxIndexMap};

/// Details of a class.
///
/// These are stored in `ClassesStack`.
pub(super) struct ClassDetails<'a> {
    /// `true` for class declaration, `false` for class expression
    pub is_declaration: bool,
    /// `true` if class requires no transformation
    pub is_transform_required: bool,
    /// Private properties.
    /// Mapping private prop name to binding for temp var.
    /// This is then used as lookup when transforming e.g. `this.#x`.
    /// `None` if class has no private properties.
    pub private_props: Option<FxIndexMap<Atom<'a>, PrivateProp<'a>>>,
    /// Bindings for class name and temp var for class
    pub bindings: ClassBindings<'a>,
}

impl ClassDetails<'_> {
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
pub(super) struct PrivateProp<'a> {
    pub binding: BoundIdentifier<'a>,
    pub is_static: bool,
    pub method_kind: Option<MethodDefinitionKind>,
    pub is_accessor: bool,
    // For accessor methods, they have two bindings,
    // one for getter and another for setter.
    pub binding2: Option<BoundIdentifier<'a>>,
}

impl<'a> PrivateProp<'a> {
    pub fn new(
        binding: BoundIdentifier<'a>,
        is_static: bool,
        method_kind: Option<MethodDefinitionKind>,
        is_accessor: bool,
    ) -> Self {
        Self { binding, is_static, method_kind, is_accessor, binding2: None }
    }

    pub fn is_method(&self) -> bool {
        self.method_kind.is_some()
    }

    pub fn is_accessor(&self) -> bool {
        self.is_accessor || self.method_kind.is_some_and(MethodDefinitionKind::is_accessor)
    }

    pub fn set_binding2(&mut self, binding: BoundIdentifier<'a>) {
        self.binding2 = Some(binding);
    }
}

/// Stack of `ClassDetails`.
///
/// Pushed to when entering a class, popped when exiting.
///
/// We use a `NonEmptyStack` to make `last` and `last_mut` cheap (these are used a lot).
/// The first entry is a dummy.
///
/// This is a separate structure, rather than just storing stack as a property of `ClassProperties`
/// to work around borrow-checker. You can call `find_private_prop` and retain the return value
/// without holding a mut borrow of the whole of `&mut ClassProperties`. This allows accessing other
/// properties of `ClassProperties` while that borrow is held.
pub(super) struct ClassesStack<'a> {
    stack: NonEmptyStack<ClassDetails<'a>>,
}

impl<'a> ClassesStack<'a> {
    /// Create new `ClassesStack`.
    pub fn new() -> Self {
        // Default stack capacity is 4. That's is probably good. More than 4 nested classes is rare.
        Self { stack: NonEmptyStack::new(ClassDetails::dummy(false)) }
    }

    /// Push an entry to stack.
    #[inline]
    pub fn push(&mut self, class: ClassDetails<'a>) {
        self.stack.push(class);
    }

    /// Push last entry from stack.
    #[inline]
    pub fn pop(&mut self) -> ClassDetails<'a> {
        self.stack.pop()
    }

    /// Get details of current class.
    #[inline]
    pub fn last(&self) -> &ClassDetails<'a> {
        self.stack.last()
    }

    /// Get details of current class as `&mut` reference.
    #[inline]
    pub fn last_mut(&mut self) -> &mut ClassDetails<'a> {
        self.stack.last_mut()
    }

    fn lookup_private_prop<
        'b,
        Ret,
        RetFn: Fn(&'b PrivateProp<'a>, &'b mut ClassBindings<'a>, bool) -> Ret,
    >(
        &'b mut self,
        ident: &PrivateIdentifier<'a>,
        ret_fn: RetFn,
    ) -> Ret {
        // Check for binding in closest class first, then enclosing classes.
        // We skip the first, because this is a `NonEmptyStack` with dummy first entry.
        // TODO: Check there are tests for bindings in enclosing classes.
        for class in self.stack[1..].iter_mut().rev() {
            if let Some(private_props) = &mut class.private_props
                && let Some(prop) = private_props.get(&ident.name)
            {
                return ret_fn(prop, &mut class.bindings, class.is_declaration);
            }
        }
        unreachable!();
    }

    /// Lookup details of private property referred to by `ident`.
    pub fn find_private_prop<'b>(
        &'b mut self,
        ident: &PrivateIdentifier<'a>,
    ) -> ResolvedPrivateProp<'a, 'b> {
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
        ident: &PrivateIdentifier<'a>,
    ) -> Option<ResolvedPrivateProp<'a, 'b>> {
        self.lookup_private_prop(ident, move |prop, class_bindings, is_declaration| {
            let prop_binding = if matches!(prop.method_kind, Some(MethodDefinitionKind::Set)) {
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
        ident: &PrivateIdentifier<'a>,
    ) -> Option<ResolvedPrivateProp<'a, 'b>> {
        self.lookup_private_prop(ident, move |prop, class_bindings, is_declaration| {
            let prop_binding = if matches!(prop.method_kind, Some(MethodDefinitionKind::Set) | None)
            {
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

    /// Look up details of the private property referred to by ident and it can either be read or written.
    pub fn find_get_set_private_prop<'b>(
        &'b mut self,
        ident: &PrivateIdentifier<'a>,
    ) -> ResolvedGetSetPrivateProp<'a, 'b> {
        self.lookup_private_prop(ident, move |prop, class_bindings, is_declaration| {
            let (get_binding, set_binding) = match prop.method_kind {
                Some(MethodDefinitionKind::Set) => (prop.binding2.as_ref(), Some(&prop.binding)),
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
pub(super) struct ResolvedPrivateProp<'a, 'b> {
    /// Binding for temp var representing the property
    pub prop_binding: &'b BoundIdentifier<'a>,
    /// Bindings for class name and temp var for class
    pub class_bindings: &'b mut ClassBindings<'a>,
    /// `true` if is a static property
    pub is_static: bool,
    /// `true` if is a private method or accessor property
    pub is_method: bool,
    /// `true` if is a private accessor property or [`PrivateProp::method_kind`] is
    /// `Some(MethodDefinitionKind::Get)` or `Some(MethodDefinitionKind::Set)`
    pub is_accessor: bool,
    /// `true` if class which defines this property is a class declaration
    pub is_declaration: bool,
}

/// Details of a private property resolved for a private field.
///
/// This is the return value of [`ClassesStack::find_get_set_private_prop`].
pub(super) struct ResolvedGetSetPrivateProp<'a, 'b> {
    /// Binding for temp var representing the property or getter method
    pub get_binding: Option<&'b BoundIdentifier<'a>>,
    /// Binding for temp var representing the property or setter method
    pub set_binding: Option<&'b BoundIdentifier<'a>>,
    /// Bindings for class name and temp var for class
    pub class_bindings: &'b mut ClassBindings<'a>,
    /// `true` if is a static property
    pub is_static: bool,
    /// `true` if is a private method or accessor property
    pub is_method: bool,
    /// `true` if is a private accessor property or [`PrivateProp::method_kind`] is
    /// `Some(MethodDefinitionKind::Get)` or `Some(MethodDefinitionKind::Set)`
    #[expect(unused)]
    pub is_accessor: bool,
    /// `true` if class which defines this property is a class declaration
    pub is_declaration: bool,
}

// Shortcut methods to get current class
impl<'a> ClassProperties<'a, '_> {
    /// Get details of current class.
    pub(super) fn current_class(&self) -> &ClassDetails<'a> {
        self.classes_stack.last()
    }

    /// Get details of current class as `&mut` reference.
    pub(super) fn current_class_mut(&mut self) -> &mut ClassDetails<'a> {
        self.classes_stack.last_mut()
    }
}
