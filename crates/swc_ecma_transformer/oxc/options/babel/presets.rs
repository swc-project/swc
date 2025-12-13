use serde::Deserialize;

use crate::{EnvOptions, JsxOptions, TypeScriptOptions};

use super::PluginPresetEntries;

#[derive(Debug, Default, Clone, Deserialize)]
#[serde(try_from = "PluginPresetEntries")]
pub struct BabelPresets {
    pub errors: Vec<String>,
    pub unsupported: Vec<String>,

    pub env: Option<EnvOptions>,

    pub jsx: Option<JsxOptions>,

    pub typescript: Option<TypeScriptOptions>,
}

impl TryFrom<PluginPresetEntries> for BabelPresets {
    type Error = String;

    fn try_from(entries: PluginPresetEntries) -> Result<Self, Self::Error> {
        let mut p = Self::default();
        for entry in entries.0 {
            match entry.name() {
                "env" => {
                    p.env = entry.value::<EnvOptions>().map_err(|err| p.errors.push(err)).ok();
                }
                "typescript" => {
                    p.typescript =
                        entry.value::<TypeScriptOptions>().map_err(|err| p.errors.push(err)).ok();
                }
                "react" => {
                    p.jsx = entry.value::<JsxOptions>().map_err(|err| p.errors.push(err)).ok();
                }
                s => p.unsupported.push(s.to_string()),
            }
        }
        Ok(p)
    }
}
