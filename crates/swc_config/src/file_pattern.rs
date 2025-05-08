use swc_cached::regex::CachedRegex;

#[serde(untagged)]
pub enum FilePattern {
    Regex(CachedRegex),
    Glob(CachedGlob),
}
