pub use self::class_properties::class_properties;
use swc_ecma_visit::Fold;

pub mod class_properties;

pub fn es2022(config: Config) -> impl Fold {
    class_properties(class_properties::Config {
        loose: config.loose,
    })
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub loose: bool,
}
