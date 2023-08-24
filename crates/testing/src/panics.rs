use tracing_subscriber::Layer;

pub struct PanicStorageLayer;

impl<S> Layer<S> for PanicStorageLayer where S: tracing::Subscriber {}

pub fn enqueue_panic(payload: String) {}

pub fn capture_panic<F, Ret>(op: F) -> Option<Ret>
where
    F: FnOnce() -> Ret,
{
}
