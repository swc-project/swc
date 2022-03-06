use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("invalid regex")]
    Regex(#[from] swc_cached::regex::Error),
}
