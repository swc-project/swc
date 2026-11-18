/// Reads a pipeline selection from the fixture's containing group.
pub fn case_pipeline<P: serde::de::DeserializeOwned>(input: &std::path::Path) -> P {
    #[derive(serde::Deserialize)]
    #[serde(deny_unknown_fields)]
    struct Options<P> {
        pipeline: P,
    }

    let path = input
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .join("options.json");
    let options: Options<P> = serde_json::from_slice(&std::fs::read(&path).unwrap())
        .unwrap_or_else(|error| panic!("invalid {}: {error}", path.display()));
    options.pipeline
}
