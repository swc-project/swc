use tracing_subscriber::Layer;

pub struct PanicStorageLayer;

impl<S> Layer<S> for PanicStorageLayer where S: tracing::Subscriber {}
