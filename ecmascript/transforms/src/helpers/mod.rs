use crate::util::prepend_stmts;
use ast::*;
use scoped_tls::scoped_thread_local;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, Fold, FoldWith, Mark, SourceMap, Span, DUMMY_SP,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};

lazy_static! {
    static ref CM: Arc<SourceMap> = { Arc::new(SourceMap::new(FilePathMapping::empty())) };
    static ref HANDLER: Handler =
        { Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(CM.clone())) };
    static ref SESSION: Session<'static> = { Session { handler: &*HANDLER } };
}

#[macro_export]
macro_rules! helper {
    ($i:ident) => {{
        $crate::helpers::HELPERS.with(|helpers| {
            helpers.$i();
            helpers.mark
        })
    }};
}

macro_rules! add_to {
    ($buf:expr, $name:ident, $b:expr, $mark:expr) => {{
        lazy_static! {
            static ref STMTS: Vec<Stmt> = {
                let code = include_str!(concat!("_", stringify!($name), ".js"));
                let fm =
                    CM.new_source_file(FileName::Custom(stringify!($name).into()), code.into());

                let stmts = Parser::new(
                    *SESSION,
                    Syntax::default(),
                    SourceFileInput::from(&*fm),
                    None,
                )
                .parse_script()
                .map(|stmts| stmts.fold_with(&mut DropSpan))
                .map_err(|mut e| {
                    e.emit();
                    ()
                })
                .unwrap();
                stmts
            };
        }

        let enable = $b.load(Ordering::Relaxed);
        if enable {
            $buf.extend(
                STMTS
                    .iter()
                    .cloned()
                    .map(|stmt| stmt.fold_with(&mut Marker($mark))),
            )
        }
    }};
}

scoped_thread_local!(pub static HELPERS: Helpers);

/// Tracks used helper methods. (e.g. __extends)
#[derive(Default)]
pub struct Helpers {
    pub mark: HelperMark,
    inner: Inner,
}

#[derive(Clone, Copy)]
pub struct HelperMark(pub Mark);
impl Default for HelperMark {
    fn default() -> Self {
        HelperMark(Mark::fresh(Mark::root()))
    }
}

macro_rules! define_helpers {
    (
        Helpers {
            $( $name:ident : ( $( $dep:ident ),* ), )*
        }
    ) => {
        #[derive(Default)]
        struct Inner {
            $( $name: AtomicBool, )*
        }

        impl Helpers {
            $(
                pub fn $name(&self) {
                    self.inner.$name.store(true, Ordering::Relaxed);

                    $(
                        self.$dep();
                    )*
                }
            )*
        }

        impl InjectHelpers {
            fn mk_helpers(&self) -> Vec<Stmt>{
                let mut buf = vec![];

                HELPERS.with(|helpers|{
                    $(
                        add_to!(buf, $name, helpers.inner.$name, helpers.mark.0);
                    )*
                });

                buf
            }
        }
    };
}

define_helpers!(Helpers {
    apply_decorated_descriptor: (),
    array_with_holes: (),
    array_without_holes: (),
    assert_this_initialized: (),
    async_generator: (await_value),
    async_generator_delegate: (),
    async_iterator: (),
    async_to_generator: (),
    await_async_generator: (await_value),
    await_value: (),
    class_call_check: (),
    class_name_tdz_error: (),
    class_private_field_get: (),
    class_private_field_loose_base: (),
    // class_private_field_loose_key: (),
    class_private_field_set: (),
    class_private_method_get: (),
    class_private_method_set: (),
    class_static_private_field_spec_get: (),
    class_static_private_field_spec_set: (),
    construct: (set_prototype_of),
    create_class: (),
    decorate: (to_array, to_property_key),
    defaults: (),
    define_enumerable_properties: (),
    define_property: (),
    extends: (),
    get: (super_prop_base),
    get_prototype_of: (),
    inherits: (set_prototype_of),
    inherits_loose: (),
    initializer_define_property: (),
    initializer_warning_helper: (),
    instanceof: (),
    interop_require_default: (),
    interop_require_wildcard: (),
    is_native_function: (),
    iterable_to_array: (),
    iterable_to_array_limit: (),
    iterable_to_array_limit_loose: (),
    jsx: (),
    new_arrow_check: (),
    non_iterable_rest: (),
    non_iterable_spread: (),
    object_spread: (define_property),
    object_without_properties: (object_without_properties_loose),
    object_without_properties_loose: (),
    possible_constructor_return: (type_of, assert_this_initialized),
    read_only_error: (),
    set: (super_prop_base, define_property),
    set_prototype_of: (),
    skip_first_generator_next: (),
    sliced_to_array: (array_with_holes, iterable_to_array_limit, non_iterable_rest),
    sliced_to_array_loose: (
        array_with_holes,
        iterable_to_array_limit_loose,
        non_iterable_rest
    ),
    super_prop_base: (get_prototype_of),
    tagged_template_literal: (),
    tagged_template_literal_loose: (),
    // temporal_ref: (temporal_undefined),
    // temporal_undefined: (),
    throw: (),
    to_array: (array_with_holes, iterable_to_array, non_iterable_rest),
    to_consumable_array: (array_with_holes, iterable_to_array, non_iterable_spread),
    to_primitive: (type_of),
    to_property_key: (type_of, to_primitive),
    type_of: (),
    wrap_async_generator: (async_generator),
    wrap_native_super: (
        construct,
        get_prototype_of,
        set_prototype_of,
        is_native_function
    ),
});

#[derive(Clone)]
pub struct InjectHelpers {
    pub cm: Arc<SourceMap>,
}

impl Fold<Module> for InjectHelpers {
    fn fold(&mut self, mut module: Module) -> Module {
        let helpers = self.mk_helpers().into_iter().map(ModuleItem::Stmt);

        prepend_stmts(&mut module.body, helpers.into_iter());
        module
    }
}

struct DropSpan;
impl Fold<Span> for DropSpan {
    fn fold(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}

struct Marker(Mark);
impl Fold<Span> for Marker {
    fn fold(&mut self, sp: Span) -> Span {
        sp.apply_mark(self.0)
    }
}

#[cfg(test)]
mod tests {
    use super::InjectHelpers;

    #[test]
    fn use_strict_before_helper() {
        ::tests::test_transform(
            Default::default(),
            |tester| {
                helper!(throw);
                InjectHelpers {
                    cm: tester.cm.clone(),
                }
            },
            "",
            "function _throw(e) {
    throw e;
}
",
            false,
        )
    }
}
