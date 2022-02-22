/// A map without allocation.
#[derive(Debug, Default, Deserialize, Clone, Copy, StaticMap)]
#[serde(deny_unknown_fields)]
pub struct BrowserData<T: Default> {
    #[serde(default)]
    pub chrome: T,
    #[serde(default)]
    pub and_chr: T,
    #[serde(default)]
    pub and_ff: T,
    #[serde(default)]
    pub op_mob: T,
    #[serde(default)]
    pub ie: T,
    #[serde(default)]
    pub edge: T,
    #[serde(default)]
    pub firefox: T,
    #[serde(default)]
    pub safari: T,
    #[serde(default)]
    pub node: T,
    #[serde(default)]
    pub ios: T,
    #[serde(default)]
    pub samsung: T,
    #[serde(default)]
    pub opera: T,
    #[serde(default)]
    pub android: T,
    #[serde(default)]
    pub electron: T,
    #[serde(default)]
    pub phantom: T,
    #[serde(default)]
    pub opera_mobile: T,
    #[serde(default)]
    pub rhino: T,
}
