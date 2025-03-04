pub struct JsonEmitter {
    pub config: JsonEmitterConfig,
}

#[derive(Debug, Clone, Default)]
pub struct JsonEmitterConfig {
    pub skip_filename: bool,
}
