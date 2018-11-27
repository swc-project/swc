use ast::*;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, Fold, SourceMap,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput};

/// Tracks used helper methods. (e.g. __extends)
#[derive(Debug, Default)]
pub struct Helpers {
    /// `_extends({}, b)`
    pub extends: AtomicBool,
    pub to_consumable_array: AtomicBool,
    /// `_classCallCheck`
    pub class_call_check: AtomicBool,
    /// `_inherits`
    pub inherits: AtomicBool,
    /// `_possibleConstructorReturn`
    pub possible_constructor_return: AtomicBool,
    ///`_createClass`
    pub create_class: AtomicBool,
    /// `_get`
    pub get: AtomicBool,
    /// `_instanceof`
    pub instance_of: AtomicBool,
    /// `_typeof`
    pub type_of: AtomicBool,
    /// `_taggedTemplateLiteral`
    pub tagged_template_literal: AtomicBool,
    /// `_defineProperty`
    pub define_property: AtomicBool,
    /// `_defineEnumerableProperties`
    pub define_enumerable_property: AtomicBool,
    /// `_set`
    pub set: AtomicBool,
}

pub struct InjectHelpers {
    pub cm: Lrc<SourceMap>,
    pub helpers: Arc<Helpers>,
}

impl InjectHelpers {
    fn mk_helpers(&self) -> Vec<Stmt> {
        let mut buf = vec![];

        let handler =
            Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(self.cm.clone()));

        let session = Session {
            cfg: Default::default(),
            logger: &slog::Logger::root(slog::Discard, o!()),
            handler: &handler,
        };

        let mut add = |name: &str, flag: &AtomicBool, code: &'static str| {
            if !flag.load(Ordering::SeqCst) {
                return;
            }
            let fm = self
                .cm
                .new_source_file(FileName::Custom(name.into()), code.into());

            let mut stmts = Parser::new(session, SourceFileInput::from(&*fm))
                .parse_script()
                .unwrap();

            buf.append(&mut stmts);
        };
        macro_rules! add {
            ($name:tt,$b:expr) => {
                add($name, &self.helpers.extends, include_str!($name));
            };
        }

        add!("_extends.js", &self.helpers.extends);
        add!("_toConsumableArray.js", &self.helpers.to_consumable_array);
        add!("_classCallCheck.js", &self.helpers.class_call_check);
        add!("_inherits.js", &self.helpers.inherits);
        add!(
            "_possibleConstructorReturn.js",
            &self.helpers.possible_constructor_return
        );
        add!("_createClass.js", &self.helpers.create_class);
        add!("_get.js", &self.helpers.get);
        add!("_instanceof.js", &self.helpers.instance_of);
        add!("_typeof.js", &self.helpers.type_of);
        add!(
            "_taggedTemplateLiteral.js",
            &self.helpers.tagged_template_literal
        );
        add!("_defineProperty.js", &self.helpers.define_property);
        add!(
            "_defineEnumerableProperties.js",
            &self.helpers.define_enumerable_property
        );
        add!("_set.js", &self.helpers.set);
        add!("_getPrototypeOf.js", &self.helpers.get_prototype_of);

        buf
    }
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
