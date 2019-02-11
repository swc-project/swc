use crate::pass::Pass;
use serde::{Deserialize, Serialize};

pub fn amd(config: Config) -> impl Pass + Clone {
    Amd { config }
}

#[derive(Clone)]
struct Amd {
    config: Config,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {}

#[cfg(test)]
mod tests;
