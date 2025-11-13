use serde::Deserialize;

use super::babel::BabelPlugins;
use crate::options::babel::BabelModule;

/// Specify what module code is generated.
///
/// References:
/// - esbuild: <https://esbuild.github.io/api/#format>
/// - Babel: <https://babeljs.io/docs/babel-preset-env#modules>
/// - TypeScript: <https://www.typescriptlang.org/tsconfig/#module>
#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(try_from = "BabelModule")]
#[non_exhaustive]
pub enum Module {
    #[default]
    Preserve,
    Esm,
    CommonJS,
}

impl Module {
    /// Check if the module is ECMAScript Module(ESM).
    pub fn is_esm(self) -> bool {
        matches!(self, Self::Esm)
    }

    /// Check if the module is CommonJS.
    pub fn is_commonjs(self) -> bool {
        matches!(self, Self::CommonJS)
    }

    /// Check if the module is a script (not ESM).
    ///
    /// In the context of JavaScript modules, a "script" refers to code that
    /// doesn't use ES module syntax (import/export). This includes CommonJS
    /// modules and code that preserves the original module format.
    pub fn is_script(self) -> bool {
        !self.is_esm()
    }
}

impl TryFrom<BabelModule> for Module {
    type Error = String;

    fn try_from(value: BabelModule) -> Result<Self, Self::Error> {
        match value {
            BabelModule::Commonjs => Ok(Self::CommonJS),
            BabelModule::Auto | BabelModule::Boolean(false) => Ok(Self::Preserve),
            _ => Err(format!("{value:?} module is not implemented.")),
        }
    }
}

impl TryFrom<&BabelPlugins> for Module {
    type Error = String;

    fn try_from(value: &BabelPlugins) -> Result<Self, Self::Error> {
        if value.modules_commonjs {
            Ok(Self::CommonJS)
        } else {
            Err("Doesn't find any transform-modules-* plugin.".to_string())
        }
    }
}
