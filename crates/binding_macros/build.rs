#[cfg(all(feature = "binding_node", feature = "binding_wasm",))]
compile_error!(
    "Macro cannot enable multiple bindings builder at once. Enable only one binding feature"
);

fn main() {
    //noop
}
