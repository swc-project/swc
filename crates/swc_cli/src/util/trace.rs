use tracing_chrome::{ChromeLayerBuilder, FlushGuard};
use tracing_subscriber::{
    filter, prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt, Layer,
};

/// Register a tracing subscriber generated event trace format output.
pub(crate) fn init_trace(out_file: Option<&str>) -> FlushGuard {
    let mut layer = ChromeLayerBuilder::new().include_args(true);

    if let Some(trace_out_file) = out_file {
        layer = layer.file(trace_out_file);
    }

    let (chrome_layer, guard) = layer.build();
    tracing_subscriber::registry()
        .with(chrome_layer.with_filter(filter::filter_fn(|metadata| {
            !metadata.target().contains("cranelift") && !metadata.name().contains("log ")
        })))
        .try_init()
        .expect("Should able to register trace");

    guard
}
