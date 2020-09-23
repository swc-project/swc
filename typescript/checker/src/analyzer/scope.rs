use super::{control_flow::CondFacts, Analyzer};
use crate::{
    builtin_types,
    debug::print_backtrace,
    errors::Error,
    name::Name,
    ty::{
        self, Alias, EnumVariant, IndexSignature, Interface, PropertySignature, QueryExpr,
        QueryType, Ref, Tuple, Type, TypeElement, TypeExt, TypeLit, Union,
    },
    type_facts::TypeFacts,
    util::TypeEq,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use fxhash::{FxHashMap, FxHashSet};
use once_cell::sync::Lazy;
use smallvec::SmallVec;
use std::{
    borrow::Cow,
    collections::hash_map::Entry,
    iter,
    iter::{once, repeat},
    slice,
};
use swc_atoms::js_word;
use swc_common::{Mark, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ts_types::{FoldWith as _, Id, TupleElement, VisitWith};

#[derive(Debug, Clone, Copy)]
pub(super) struct Config {
    ///  WHen applied to a type, it prevents expansion of the type.
    no_expand_mark: Mark,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            no_expand_mark: Mark::fresh(Mark::root()),
        }
    }
}

macro_rules! no_ref {
    ($t:expr) => {{
        match $t {
            Some(box Type::Ref(..)) => panic!("cannot store a variable with type `Ref`"),
            _ => {}
        }
    }};
}

#[derive(Debug)]
pub(crate) struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,
    pub declaring: SmallVec<[Id; 8]>,

    pub(super) vars: FxHashMap<Id, VarInfo>,
    pub(super) types: FxHashMap<Id, Vec<Box<Type>>>,
    pub(super) facts: CondFacts,

    pub(super) declaring_fn: Option<Id>,
    /// [Some] while declaring a class property.
    pub(super) declaring_prop: Option<Id>,

    pub(super) this: Option<Id>,
    /// Required to handle static properies.
    pub(super) this_class_name: Option<Id>,
    /// Only contains instance members.
    ///
    /// The value of usze should be ignored by methods except
    /// `Validate<Class>`
    pub(super) this_class_members: Vec<(usize, ty::ClassMember)>,
}

impl Scope<'_> {
    pub fn get_type_facts(&self, name: &Name) -> TypeFacts {
        if let Some(&f) = self.facts.facts.get(name) {
            return f;
        }

        match self.parent {
            Some(parent) => parent.get_type_facts(name),
            _ => TypeFacts::None,
        }
    }

    pub fn is_root(&self) -> bool {
        self.parent.is_none()
    }

    pub fn class_members(&self) -> &[(usize, ty::ClassMember)] {
        if let ScopeKind::Class = self.kind {
            return &self.this_class_members;
        }

        match self.parent {
            Some(parent) => parent.class_members(),
            None => &[],
        }
    }

    pub fn remove_parent(self) -> Scope<'static> {
        Scope {
            parent: None,
            kind: self.kind,
            declaring: self.declaring,
            vars: self.vars,
            types: self.types,
            facts: self.facts,
            declaring_fn: self.declaring_fn,
            declaring_prop: self.declaring_prop,
            this: self.this,
            this_class_members: self.this_class_members,
            this_class_name: self.this_class_name,
        }
    }

    pub fn copy_hoisted_vars_from(&mut self, from: &mut Scope) {
        match from.kind {
            // We don't copy variable information from nested function.
            ScopeKind::Method | ScopeKind::Fn | ScopeKind::ArrowFn => return,
            _ => {}
        }

        for (name, var) in from.vars.drain() {
            if var.kind == VarDeclKind::Var {
                self.vars.insert(name, var);
            }
        }
    }

    pub fn remove_declaring<I>(&mut self, names: impl IntoIterator<IntoIter = I, Item = Id>)
    where
        I: Iterator<Item = Id> + DoubleEndedIterator,
    {
        for n in names.into_iter().rev() {
            let idx = self
                .declaring
                .iter()
                .rposition(|name| n == *name)
                .expect("failed to find inserted name");
            self.declaring.remove(idx);
        }
    }

    pub fn insert_var(&mut self, name: Id, v: VarInfo) {
        no_ref!(v.ty);

        self.vars.insert(name, v);
    }

    /// This method does **not** search for parent scope.
    pub fn get_var_mut(&mut self, name: &Id) -> Option<&mut VarInfo> {
        self.vars.get_mut(name)
    }

    /// Add a type to the scope.
    fn register_type(&mut self, name: Id, ty: Box<Type>) {
        match *ty {
            Type::Param(..) => {
                // Override type parameter.
                // As if store type parameter two time, this is required.

                let v = self.types.entry(name).or_default();
                if let Some(index) = v.iter().position(|v| match &**v {
                    Type::Param(..) => true,
                    _ => false,
                }) {
                    v.remove(index);
                }
                v.push(ty);

                return;
            }
            _ => {}
        }
        self.types.entry(name).or_default().push(ty);
    }

    pub fn this(&self) -> Option<Cow<Box<Type>>> {
        if let Some(ref this) = self.this {
            if this.as_str() == "" {
                return Some(Cow::Owned(Type::any(DUMMY_SP)));
            }

            return Some(Cow::Owned(box Type::Ref(Ref {
                span: DUMMY_SP,
                type_name: this.clone().into(),
                type_args: None,
            })));
        }

        match self.parent {
            Some(ref parent) => parent.this(),
            None => None,
        }
    }

    pub fn get_var(&self, sym: &Id) -> Option<&VarInfo> {
        if let Some(ref v) = self.vars.get(sym) {
            return Some(v);
        }

        self.search_parent(sym)
    }

    pub fn search_parent(&self, sym: &Id) -> Option<&VarInfo> {
        let mut parent = self.parent;

        while let Some(p) = parent {
            if let Some(var_info) = p.vars.get(sym) {
                return Some(var_info);
            }

            parent = p.parent;
        }

        None
    }
}

impl Analyzer<'_, '_> {
    /// Overrides a variable. Used for removing lazily-typed stuffs.
    pub(super) fn override_var(
        &mut self,
        kind: VarDeclKind,
        name: Id,
        ty: Box<Type>,
    ) -> Result<(), Error> {
        self.declare_var(ty.span(), kind, name, Some(ty), true, true)?;

        Ok(())
    }

    /// Expands
    ///
    ///   - Type alias
    pub(super) fn expand(&mut self, span: Span, ty: Box<Type>) -> ValidationResult {
        if self.is_builtin {
            return Ok(ty);
        }

        let mut v = Expander {
            span,
            analyzer: self,
            dejavu: Default::default(),
            full: false,
            expand_union: false,
        };
        Ok(box ty.into_owned().fold_with(&mut v))
    }

    /// Expands
    ///
    /// // TODO: Add an option to expand union (this is required to assign)
    ///
    ///
    ///  - `expand_union` should be true if you are going to use it in
    ///    assignment, and false if you are going to use it in user-visible
    ///    stuffs (e.g. type annotation for .d.ts file)
    pub(super) fn expand_fully(
        &mut self,
        span: Span,
        ty: Box<Type>,
        expand_union: bool,
    ) -> ValidationResult {
        if self.is_builtin {
            return Ok(ty);
        }

        let mut v = Expander {
            span,
            analyzer: self,
            dejavu: Default::default(),
            full: true,
            expand_union,
        };

        Ok(box ty.into_owned().fold_with(&mut v))
    }

    pub(super) fn register_type(&mut self, name: Id, ty: Box<Type>) -> Result<(), Error> {
        if self.is_builtin
            && match ty.normalize() {
                Type::EnumVariant(_)
                | Type::Interface(_)
                | Type::Enum(_)
                | Type::Mapped(_)
                | Type::Alias(_)
                | Type::Namespace(_)
                | Type::Module(_)
                | Type::Class(_)
                | Type::ClassInstance(_)
                | Type::Intersection(_)
                | Type::Function(_)
                | Type::Constructor(_)
                | Type::Union(_)
                | Type::Array(_)
                | Type::Tuple(_)
                | Type::Keyword(_)
                | Type::Conditional(_)
                | Type::TypeLit(_)
                | Type::Ref(_)
                | Type::IndexedAccessType(_)
                | Type::Import(_)
                | Type::Query(_)
                | Type::Lit(_)
                | Type::This(_) => true,

                _ => false,
            }
        {
            self.info
                .exports
                .types
                .entry(name)
                .or_default()
                .push(ty.freeze());
        } else {
            log::trace!("register_type({})", name);
            self.scope.register_type(name, ty);
        }

        Ok(())
    }

    pub fn declare_vars(&mut self, kind: VarDeclKind, pat: &mut Pat) -> Result<(), Error> {
        self.declare_vars_inner_with_ty(kind, pat, false, None)
    }

    pub fn declare_vars_with_ty(
        &mut self,
        kind: VarDeclKind,
        pat: &mut Pat,
        ty: Option<Box<Type>>,
    ) -> Result<(), Error> {
        self.declare_vars_inner_with_ty(kind, pat, false, ty)
    }

    pub(super) fn declare_vars_inner(
        &mut self,
        kind: VarDeclKind,
        pat: &mut Pat,
        export: bool,
    ) -> Result<(), Error> {
        self.declare_vars_inner_with_ty(kind, pat, export, None)
    }

    /// Updates variable list.
    ///
    /// This method should be called for function parameters including error
    /// variable from a catch clause.
    fn declare_vars_inner_with_ty(
        &mut self,
        kind: VarDeclKind,
        pat: &mut Pat,
        export: bool,
        ty: Option<Box<Type>>,
    ) -> Result<(), Error> {
        let span = ty
            .as_ref()
            .map(|v| v.span())
            .and_then(|span| if span.is_dummy() { None } else { Some(span) })
            .unwrap_or_else(|| pat.span());
        if !self.is_builtin {
            assert_ne!(span, DUMMY_SP);
        }

        match *pat {
            Pat::Ident(ref mut i) => {
                let name: Id = Id::from(i.clone());
                if !self.is_builtin {
                    debug_assert_ne!(span, DUMMY_SP);
                }
                let ty = match ty {
                    None => try_opt!(i.type_ann.as_mut().map(|v| v.type_ann.validate_with(self))),
                    Some(ty) => Some(ty),
                };
                self.declare_var(
                    span,
                    kind,
                    name.clone(),
                    ty.clone(),
                    // initialized
                    true,
                    // allow_multiple
                    kind == VarDeclKind::Var,
                )?;
                if export {
                    if let Some(..) = self
                        .info
                        .exports
                        .vars
                        .insert(name, ty.unwrap_or(Type::any(i.span)))
                    {
                        unimplemented!("multiple exported variables with same name")
                    }
                }
                return Ok(());
            }
            Pat::Assign(ref mut p) => {
                let ty = self.validate(&mut p.right)?;
                log::debug!(
                    "({}) declare_vars: Assign({:?}), ty = {:?}",
                    self.scope.depth(),
                    p.left,
                    ty
                );
                self.declare_vars_inner_with_ty(kind, &mut p.left, export, Some(ty))?;

                return Ok(());
            }

            Pat::Array(ArrayPat {
                span,
                ref mut elems,
                ref mut type_ann,
                ref mut optional,
            }) => {
                // TODO: Handle type annotation

                if type_ann.is_none() {
                    if let Some(ty) = ty {
                        *type_ann = Some(ty.generalize_lit().generalize_tuple().into());
                        *optional = true;
                    }
                }

                if type_ann.is_none() {
                    *type_ann = Some(TsTypeAnn {
                        span,
                        type_ann: box TsType::TsTypeRef(TsTypeRef {
                            span,
                            type_name: TsEntityName::Ident(Ident::new("Iterable".into(), DUMMY_SP)),
                            type_params: Some(TsTypeParamInstantiation {
                                span,
                                params: vec![box TsType::TsKeywordType(TsKeywordType {
                                    span: DUMMY_SP,
                                    kind: TsKeywordTypeKind::TsAnyKeyword,
                                })],
                            }),
                        }),
                    });
                }

                for elem in elems.iter_mut() {
                    match *elem {
                        Some(ref mut elem) => {
                            self.declare_vars_inner(kind, elem, export)?;
                        }
                        // Skip
                        None => {}
                    }
                }

                return Ok(());
            }

            Pat::Object(ObjectPat {
                ref props,
                ref mut type_ann,
                ..
            }) => {
                if type_ann.is_none() {
                    *type_ann = Some(
                        Type::TypeLit(TypeLit {
                            span,
                            // TODO: Fill it
                            members: vec![],
                        })
                        .into(),
                    );
                }
                for prop in props {
                    match *prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp { .. }) => {
                            unimplemented!("ket value pattern in object pattern")
                        }
                        ObjectPatProp::Assign(AssignPatProp { .. }) => {
                            unimplemented!("assign pattern in object pattern")
                        }
                        ObjectPatProp::Rest(RestPat { .. }) => {
                            unimplemented!("rest pattern in object pattern")
                        }
                    }
                }

                return Ok(());
            }

            Pat::Rest(RestPat {
                ref arg,
                type_ann: ref ty,
                ..
            }) => {
                let ty = ty.clone();
                let mut arg = arg.clone();
                return self.declare_vars_inner(kind, &mut arg, export);
            }

            Pat::Invalid(..) | Pat::Expr(box Expr::Invalid(..)) => Ok(()),

            _ => unimplemented!("declare_vars for patterns other than ident: {:#?}", pat),
        }
    }

    #[inline(never)]
    pub(super) fn find_var(&self, name: &Id) -> Option<&VarInfo> {
        static ERR_VAR: Lazy<VarInfo> = Lazy::new(|| VarInfo {
            ty: Some(Type::any(DUMMY_SP)),
            kind: VarDeclKind::Const,
            initialized: true,
            copied: false,
        });
        static ANY_VAR: Lazy<VarInfo> = Lazy::new(|| VarInfo {
            ty: Some(Type::any(DUMMY_SP)),
            kind: VarDeclKind::Const,
            initialized: true,
            copied: false,
        });

        if self.errored_imports.get(name).is_some() {
            return Some(&ERR_VAR);
        }

        let mut scope = Some(&self.scope);

        while let Some(s) = scope {
            if let Some(var) = s.vars.get(name) {
                return Some(var);
            }
            if let Some(ref cls) = s.this_class_name {
                if cls == name {
                    return Some(&ANY_VAR);
                }
            }

            scope = s.parent;
        }

        None
    }

    pub(super) fn find_var_type(&self, name: &Id) -> Option<Cow<Box<Type>>> {
        // println!("({}) find_var_type({})", self.scope.depth(), name);
        let mut scope = Some(&self.scope);
        while let Some(s) = scope {
            if let Some(ref v) = s.facts.vars.get(&Name::from(name)) {
                println!(
                    "({}) find_var_type({}): Handled from facts",
                    self.scope.depth(),
                    name
                );
                return Some(Cow::Borrowed(v));
            }

            scope = s.parent;
        }

        if let Some(var) = self.find_var(name) {
            println!(
                "({}) find_var_type({}): Handled from scope.find_var",
                self.scope.depth(),
                name
            );

            let name = Name::from(name);

            let mut ty = match var.ty {
                Some(ref ty) => ty.clone(),
                _ => return None,
            };

            if let Some(ref excludes) = self.scope.facts.excludes.get(&name) {
                match *ty {
                    Type::Union(ty::Union { ref mut types, .. }) => {
                        for ty in types {
                            let span = (*ty).span();
                            for excluded_ty in excludes.iter() {
                                if ty.type_eq(excluded_ty) {
                                    *ty = Type::never(span)
                                }
                            }
                        }
                    }
                    _ => {}
                }
            }

            return Some(Cow::Owned(ty));
        }

        None
    }

    #[inline(never)]
    pub(super) fn find_type(&self, name: &Id) -> Option<ItemRef<Type>> {
        log::debug!("Scope.find_type('{}')", name);

        #[allow(dead_code)]
        static ANY: Type = Type::Keyword(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        });

        if self.errored_imports.get(name).is_some() {
            return Some(ItemRef::Single(iter::once(&ANY)));
        }

        if let Some(ty) = self.resolved_import_types.get(name) {
            return Some(ItemRef::Multi(ty.iter()));
        }

        if !self.is_builtin {
            if let Ok(box Type::Static(s)) = builtin_types::get_type(self.libs, DUMMY_SP, name) {
                return Some(ItemRef::Single(once(s.ty)));
            }
        }

        if let Some(ty) = self.scope.find_type(name) {
            return Some(ty);
        }

        if !self.is_builtin {
            log::debug!("Scope.find_type: failed to find type '{}'", name);
        }

        None
    }

    pub fn declare_var(
        &mut self,
        span: Span,
        kind: VarDeclKind,
        name: Id,
        ty: Option<Box<Type>>,
        initialized: bool,
        allow_multiple: bool,
    ) -> Result<(), Error> {
        match self.scope.vars.entry(name.clone()) {
            Entry::Occupied(e) => {
                if !allow_multiple {
                    print_backtrace();
                    panic!(
                        "{}: {:?}",
                        self.path.display(),
                        Error::DuplicateName { name, span }
                    );
                }
                //println!("\tdeclare_var: found entry");
                let (k, mut v) = e.remove_entry();

                macro_rules! restore {
                    () => {{
                        self.scope.vars.insert(k, v);
                    }};
                }

                v.ty = if let Some(ty) = ty {
                    let ty = ty.generalize_lit().into_owned();

                    Some(if let Some(var_ty) = v.ty {
                        let var_ty = var_ty.generalize_lit().into_owned();

                        match ty {
                            Type::Query(..) | Type::Function(..) => {}
                            _ => {
                                let generalized_var_ty = var_ty.clone().generalize_lit();

                                match var_ty {
                                    // Allow override query type.
                                    Type::Query(..) => {}
                                    _ => {
                                        let ty = self.expand_fully(span, box ty.clone(), true)?;
                                        let var_ty = self.expand_fully(
                                            span,
                                            box generalized_var_ty.into_owned(),
                                            true,
                                        )?;
                                        let res = self.assign(&ty, &var_ty, span);

                                        if res.is_err() {
                                            v.ty = Some(var_ty);
                                            restore!();
                                            return Ok(());

                                            // TODO:
                                            //  return Err(Error::
                                            //      RedeclaredVarWithDifferentType {
                                            //          span,
                                            //      }
                                            //  );
                                        }
                                    }
                                }
                            }
                        }
                        Type::union(vec![box var_ty, box ty])
                    } else {
                        box ty
                    })
                } else {
                    if let Some(var_ty) = v.ty {
                        Some(var_ty)
                    } else {
                        None
                    }
                };

                self.scope.vars.insert(k, v);
            }
            Entry::Vacant(e) => {
                //println!("\tdeclare_var: no entry");

                let info = VarInfo {
                    kind,
                    ty,
                    initialized,
                    copied: false,
                };
                e.insert(info);
            }
        }

        Ok(())
    }

    pub fn declare_complex_vars(
        &mut self,
        kind: VarDeclKind,
        pat: &Pat,
        ty: Box<Type>,
    ) -> ValidationResult<()> {
        let span = pat.span();

        match *pat {
            Pat::Ident(ref i) => {
                println!("declare_complex_vars: declaring {}", i.sym);
                self.declare_var(
                    span,
                    kind,
                    i.into(),
                    Some(ty),
                    // initialized
                    true,
                    // let/const declarations does not allow multiple declarations with
                    // same name
                    kind == VarDeclKind::Var,
                )?;
                Ok(())
            }

            Pat::Array(ArrayPat { ref elems, .. }) => {
                // Handle tuple
                //
                //      const [a , setA] = useState();
                //

                // TODO: Normalize static
                match *ty {
                    Type::Tuple(Tuple {
                        elems: ref tuple_elements,
                        ..
                    }) => {
                        if tuple_elements.len() < elems.len() {
                            return Err(Error::TooManyTupleElements { span });
                        }

                        for (elem, tuple_element) in elems.into_iter().zip(tuple_elements) {
                            match *elem {
                                Some(ref elem) => {
                                    self.declare_complex_vars(
                                        kind,
                                        elem,
                                        tuple_element.ty.clone(),
                                    )?;
                                }
                                None => {
                                    // Skip
                                }
                            }
                        }

                        return Ok(());
                    }

                    // [a, b] | [c, d] => [a | c, b | d]
                    Type::Union(Union { types, .. }) => {
                        let mut errors = vec![];
                        let mut buf = vec![];
                        for ty in types.iter() {
                            match *ty.normalize() {
                                Type::Tuple(Tuple {
                                    elems: ref elem_types,
                                    ..
                                }) => {
                                    buf.push(elem_types);
                                }
                                _ => {
                                    errors.push(Error::NotTuple { span: ty.span() });
                                }
                            }
                        }
                        if !errors.is_empty() {
                            return Err(Error::UnionError { span, errors });
                        }

                        for (elem, tuple_elements) in
                            elems.into_iter().zip(buf.into_iter().chain(repeat(&vec![
                                TupleElement {
                                    span: DUMMY_SP,
                                    label: None,
                                    ty: Type::undefined(span),
                                },
                            ])))
                        {
                            match *elem {
                                Some(ref elem) => {
                                    let ty = box Union {
                                        span,
                                        types: tuple_elements
                                            .into_iter()
                                            .map(|element| &element.ty)
                                            .cloned()
                                            .collect(),
                                    }
                                    .into();
                                    self.declare_complex_vars(kind, elem, ty)?;
                                }
                                None => {}
                            }
                        }

                        return Ok(());
                    }

                    _ => unimplemented!("declare_complex_vars(pat={:?}\nty={:?}\n)", pat, ty),
                }
            }

            Pat::Object(ObjectPat { ref props, .. }) => {
                fn find<'a>(members: &[TypeElement], key: &PropName) -> Option<Box<Type>> {
                    let mut index_el = None;
                    // First, we search for Property
                    for m in members {
                        match *m {
                            TypeElement::Property(PropertySignature { ref type_ann, .. }) => {
                                return match *type_ann {
                                    Some(ref ty) => Some(ty.clone()),
                                    None => Some(Type::any(key.span())),
                                }
                            }

                            TypeElement::Index(IndexSignature { ref type_ann, .. }) => {
                                index_el = Some(match *type_ann {
                                    Some(ref ty) => ty.clone(),
                                    None => Type::any(key.span()),
                                });
                            }
                            _ => {}
                        }
                    }

                    return index_el;
                }

                /// Handle TypeElements.
                ///
                /// Used for interfaces and type literals.
                macro_rules! handle_elems {
                    ($members:expr) => {{
                        for p in props.iter() {
                            match *p {
                                ObjectPatProp::KeyValue(KeyValuePatProp {
                                    ref key,
                                    ref value,
                                    ..
                                }) => {
                                    if let Some(ty) = find(&$members, key) {
                                        self.declare_complex_vars(kind, value, ty)?;
                                        return Ok(());
                                    }
                                }

                                _ => unimplemented!("handle_elems({:#?})", p),
                            }
                        }

                        return Err(Error::NoSuchProperty {
                            span,
                            prop: None,
                            prop_ty: None,
                        });
                    }};
                }

                // TODO: Normalize static
                match *ty {
                    Type::TypeLit(TypeLit { members, .. }) => {
                        handle_elems!(members);
                    }

                    // TODO: Handle extends
                    Type::Interface(Interface { body, .. }) => {
                        handle_elems!(body);
                    }

                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) => {
                        for p in props.iter() {
                            match *p {
                                ObjectPatProp::KeyValue(ref kv) => {
                                    self.declare_complex_vars(
                                        kind,
                                        &kv.value,
                                        Type::any(kv.span()),
                                    )?;
                                }

                                _ => unimplemented!("handle_elems({:#?})", p),
                            }
                        }

                        return Ok(());
                    }

                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsUnknownKeyword,
                        ..
                    }) => {
                        // TODO: Somehow get precise logic of determining span.
                        //
                        // let { ...a } = x;
                        //          ^
                        //

                        // WTF...
                        for p in props.iter().rev() {
                            let span = match p {
                                ObjectPatProp::Rest(RestPat { ref arg, .. }) => arg.span(),
                                _ => p.span(),
                            };
                            return Err(Error::Unknown { span });
                        }

                        return Err(Error::Unknown { span });
                    }

                    _ => unimplemented!("declare_complex_vars({:#?}, {:#?})", pat, ty),
                }
            }

            _ => unimplemented!("declare_complex_vars({:#?}, {:#?})", pat, ty),
        }
    }

    pub(crate) fn prevent_expansion(&self, ty: &mut Type) {
        let span = ty.span();
        let span = span.apply_mark(self.expander.no_expand_mark);

        ty.respan(span)
    }

    fn is_expansion_prevented(&self, ty: &Type) -> bool {
        let mut ctxt: SyntaxContext = ty.span().ctxt();
        loop {
            let mark = ctxt.remove_mark();

            if mark == Mark::root() {
                break;
            }

            if mark == self.expander.no_expand_mark {
                return true;
            }
        }

        false
    }
}

#[derive(Debug, Clone)]
pub(crate) struct VarInfo {
    pub kind: VarDeclKind,
    pub initialized: bool,
    pub ty: Option<Box<Type>>,
    /// Copied from parent scope. If this is true, it's not a variable
    /// declaration.
    pub copied: bool,
}

impl<'a> Scope<'a> {
    pub const fn kind(&self) -> ScopeKind {
        self.kind
    }

    /// Returns true if `this` (from javascript) is a reference to class.
    pub fn is_this_ref_to_class(&self) -> bool {
        match self.kind {
            ScopeKind::Fn | ScopeKind::ArrowFn => return false,
            ScopeKind::Class => return true,
            ScopeKind::Method | ScopeKind::Flow | ScopeKind::Block => {}
        }

        match self.parent {
            Some(parent) => parent.is_this_ref_to_class(),
            None => false,
        }
    }

    pub fn new(parent: &'a Scope<'a>, kind: ScopeKind, facts: CondFacts) -> Self {
        Self::new_inner(Some(parent), kind, facts)
    }

    pub fn root() -> Self {
        Self::new_inner(None, ScopeKind::Fn, Default::default())
    }

    fn new_inner(parent: Option<&'a Scope<'a>>, kind: ScopeKind, facts: CondFacts) -> Self {
        Scope {
            parent,

            kind,
            declaring: Default::default(),
            vars: Default::default(),
            types: Default::default(),
            facts,
            this: None,
            declaring_prop: None,
            declaring_fn: None,
            this_class_members: Default::default(),
            this_class_name: Default::default(),
        }
    }

    pub(super) fn depth(&self) -> usize {
        match self.parent {
            Some(ref p) => p.depth() + 1,
            None => 0,
        }
    }

    /// This method does **not** handle imported types.
    fn find_type(&self, name: &Id) -> Option<ItemRef<Type>> {
        log::debug!("Analyzer.find_type('{}')", name);

        if let Some(ty) = self.facts.types.get(name) {
            // println!("({}) find_type({}): Found (cond facts)", self.depth(), name);
            return Some(ItemRef::Single(iter::once(&ty)));
        }

        if let Some(ty) = self.types.get(name) {
            // println!("({}) find_type({}): Found", self.depth(), name);

            return Some(ItemRef::Multi(ty.iter()));
        }

        if let Some(v) = self.get_var(name) {
            return v.ty.as_ref().map(|v| ItemRef::Boxed(once(v)));
        }

        match self.parent {
            Some(ref parent) => parent.find_type(name),
            None => None,
        }
    }
}

#[derive(Debug, Clone)]
pub enum ItemRef<'a, T> {
    Single(iter::Once<&'a T>),
    Boxed(iter::Once<&'a Box<T>>),
    Multi(slice::Iter<'a, Box<T>>),
}

impl<'a, T> Iterator for ItemRef<'a, T> {
    type Item = &'a T;

    fn next(&mut self) -> Option<Self::Item> {
        match self {
            ItemRef::Single(v) => v.next(),
            ItemRef::Boxed(v) => v.next().map(|v| &**v),
            ItemRef::Multi(v) => v.next().map(|v| &**v),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum ScopeKind {
    Block,
    Fn,
    /// This does not affect `this`.
    Method,
    ArrowFn,
    Class,
    /// If statement, conditional expression, switch case
    Flow,
}

struct Expander<'a, 'b, 'c> {
    span: Span,
    analyzer: &'a mut Analyzer<'b, 'c>,
    dejavu: FxHashSet<Id>,
    full: bool,
    expand_union: bool,
}

impl ty::Fold for Expander<'_, '_, '_> {
    fn fold_type(&mut self, ty: Type) -> Type {
        if self.analyzer.is_builtin {
            return ty;
        }

        log::debug!("Expanding type");

        self.full |= match ty {
            Type::Mapped(..) => true,
            _ => false,
        };

        let ty = ty.into_owned();
        if self.analyzer.is_expansion_prevented(&ty) {
            return ty;
        }

        match ty {
            Type::Param(..) => return ty.fold_children_with(self),
            Type::Ref(..) if !self.full => return ty.fold_children_with(self),
            Type::Interface(..) | Type::Class(..) if !self.full => return ty,
            _ => {}
        }

        if !self.expand_union {
            let mut finder = UnionFinder { found: false };
            ty.visit_with(&ty, &mut finder);
            if finder.found {
                return ty;
            }
        }

        let span = self.span;

        let ty = ty.fold_children_with(self);

        let res: ValidationResult = try {
            macro_rules! verify {
                ($ty:expr) => {{
                    if cfg!(debug_assertions) {
                        match $ty.normalize() {
                            Type::Ref(ref s) => unreachable!("ref: {:?}", s),
                            _ => {}
                        }
                    }
                }};
            }

            match ty.normalize() {
                Type::Ref(Ref {
                    ref type_name,
                    ref type_args,
                    ..
                }) => {
                    if !self.full || self.analyzer.ctx.preserve_ref {
                        return ty;
                    }

                    match *type_name {
                        TsEntityName::Ident(ref i) => {
                            if self.dejavu.contains(&i.into()) {
                                return ty;
                            }
                            self.dejavu.insert(i.into());
                            log::error!(
                                "({}): expand_fully: failed to find {}",
                                self.analyzer.scope.depth(),
                                Id::from(i)
                            );

                            if let Some(types) = self.analyzer.find_type(&i.into()) {
                                log::info!(
                                    "expand: expanding using analyzer: {}",
                                    types.clone().into_iter().count()
                                );

                                for t in types {
                                    if !self.expand_union {
                                        let mut finder = UnionFinder { found: false };
                                        t.visit_with(&t, &mut finder);
                                        if finder.found {
                                            return ty;
                                        }
                                    }

                                    match t.normalize() {
                                        ty @ Type::Enum(..) => {
                                            if let Some(..) = *type_args {
                                                Err(Error::NotGeneric { span })?;
                                            }
                                            verify!(ty);
                                            return ty.clone();
                                        }

                                        ty @ Type::Param(..) => {
                                            if let Some(..) = *type_args {
                                                Err(Error::NotGeneric { span })?;
                                            }

                                            verify!(ty);
                                            return ty.clone();
                                        }

                                        Type::Interface(Interface { type_params, .. })
                                        | Type::Alias(Alias { type_params, .. })
                                        | Type::Class(ty::Class { type_params, .. }) => {
                                            if let Some(type_params) = type_params.clone() {
                                                log::info!("expand: expanding type parameters");
                                                let ty = t.clone();
                                                let inferred = self.analyzer.infer_arg_types(
                                                    self.span,
                                                    type_args.as_ref(),
                                                    &type_params.params,
                                                    &[],
                                                    &[],
                                                )?;
                                                return *self
                                                    .analyzer
                                                    .expand_type_params(&inferred, box ty)?;
                                            }

                                            return t.clone().fold_with(self);
                                        }

                                        _ => unimplemented!(
                                            "Handling result of find_type() -> {:#?}",
                                            ty
                                        ),
                                    }
                                }
                            } else {
                                println!("Failed to find type: {}", i.sym)
                            }
                        }

                        // Handle enum variant type.
                        //
                        //  let a: StringEnum.Foo = x;
                        TsEntityName::TsQualifiedName(box TsQualifiedName {
                            left: TsEntityName::Ident(ref left),
                            ref right,
                        }) => {
                            if left.sym == js_word!("void") {
                                return *Type::any(span);
                            }

                            if let Some(types) = self.analyzer.find_type(&left.into()) {
                                for ty in types {
                                    match *ty {
                                        Type::Enum(..) => {
                                            return EnumVariant {
                                                span,
                                                enum_name: left.into(),
                                                name: right.sym.clone(),
                                            }
                                            .into();
                                        }
                                        Type::Param(..)
                                        | Type::Namespace(..)
                                        | Type::Module(..) => return ty.clone(),
                                        _ => {}
                                    }
                                }
                            }
                        }
                        _ => {
                            unimplemented!("TsEntityName: {:?}", type_name);
                        }
                    }

                    Err(Error::NameNotFound {
                        name: type_name.clone().into(),
                        type_args: type_args.clone(),
                        span: type_name.span(),
                    })?;
                }

                Type::Param(..) => return ty,

                Type::Query(QueryType {
                    expr: QueryExpr::TsEntityName(ref name),
                    ..
                }) => return *self.analyzer.type_of_ts_entity_name(span, name, None)?,

                _ => {}
            }

            match ty.into_owned() {
                ty @ Type::TypeLit(..) => return ty,

                Type::Interface(i) => {
                    // TODO: Handle type params
                    return Type::TypeLit(TypeLit {
                        span,
                        members: i.body,
                    });
                }

                Type::Union(Union { span, types }) => {
                    return *Type::union(types);
                }

                Type::Function(ty::Function {
                    span,
                    type_params,
                    params,
                    ret_ty,
                }) => {
                    let ret_ty = self.analyzer.rename_type_params(span, ret_ty, None)?;

                    return ty::Function {
                        span,
                        type_params,
                        params,
                        ret_ty,
                    }
                    .into();
                }

                ty => box ty,
            }
        };

        match res {
            Ok(ty) => *ty,
            Err(err) => {
                self.analyzer.info.errors.push(err);
                *Type::any(span)
            }
        }
    }
}

#[derive(Debug, Default)]
struct UnionFinder {
    found: bool,
}

impl ty::Visit for UnionFinder {
    fn visit_property_signature(&mut self, _: &PropertySignature, _: &dyn ty::TypeNode) {}

    fn visit_method_signature(&mut self, _: &ty::MethodSignature, _: &dyn ty::TypeNode) {}

    fn visit_union(&mut self, u: &Union, _: &dyn ty::TypeNode) {
        log::debug!("Found union: {:?}", u);
        self.found = true;
    }
}
