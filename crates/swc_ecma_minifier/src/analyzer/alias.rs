#[derive(Debug, Default)]
pub(crate) struct AliasData {}

pub(crate) struct AliasAnalyzer<'a> {
    pub data: &'a mut AliasData,
}
