use ast::*;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, FilePathMapping, Fold, FoldWith, SourceMap, Span, DUMMY_SP,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};

lazy_static! {
    static ref CM: Lrc<SourceMap> = { Lrc::new(SourceMap::new(FilePathMapping::empty())) };
    static ref HANDLER: Handler =
        { Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(CM.clone())) };
    static ref SESSION: Session<'static> = { Session { handler: &*HANDLER } };
}

macro_rules! add_to {
    ($buf:expr, $name:tt, $b:expr) => {{
        lazy_static! {
            static ref STMTS: Vec<Stmt> = {
                let code = include_str!(concat!("_", stringify!($name), ".js"));
                let fm =
                    CM.new_source_file(FileName::Custom(stringify!($name).into()), code.into());

                let stmts = Parser::new(*SESSION, Syntax::default(), SourceFileInput::from(&*fm))
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
            $buf.extend_from_slice(&STMTS)
        }
    }};
}

macro_rules! define_helpers {
    (
        Helpers {
            $( $name:ident : ( $( $dep:ident ),* ), )*
        }
    ) => {
        /// Tracks used helper methods. (e.g. __extends)
        #[derive(Default)]
        pub struct Helpers {
            $( $name: AtomicBool, )*
        }

        impl Helpers {
            $(
                pub fn $name(&self) {
                    self.$name.store(true, Ordering::Relaxed);
                    $(
                        self.$dep();
                    )*
                }
            )*
        }

        impl InjectHelpers {
            fn mk_helpers(&self) -> Vec<Stmt>{
                let mut buf = vec![];

                $(
                    add_to!(buf, $name, self.helpers.$name);
                )*


                buf
            }
        }

        impl Fold<Module> for HelperResetter {
            fn fold(&mut self, module:Module)->Module{
                $(
                    self.helpers.$name.store(false, Ordering::Relaxed);
                )*
                
                module
            }
        }
    };
}

/// Disables all helpers.
/// Used to reset list of injected helpers.
#[derive(Clone)]
pub struct HelperResetter {
    pub helpers: Arc<Helpers>,
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
    pub cm: Lrc<SourceMap>,
    pub helpers: Arc<Helpers>,
}

impl Fold<Module> for InjectHelpers {
    fn fold(&mut self, module: Module) -> Module {
        let body = self
            .mk_helpers()
            .into_iter()
            .map(ModuleItem::Stmt)
            .chain(module.body)
            .collect();

        Module { body, ..module }
    }
}

struct DropSpan;
impl Fold<Span> for DropSpan {
    fn fold(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}
