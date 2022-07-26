use preset_env_base::query::Query;
pub use preset_env_base::query::Targets;
use serde::Deserialize;

#[derive(Debug, Default, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct Options {
    #[serde(default = "default_targets")]
    pub env: Option<Targets>,
}

fn default_targets() -> Option<Targets> {
    Some(Targets::Query(Query::Single("".into())))
}
