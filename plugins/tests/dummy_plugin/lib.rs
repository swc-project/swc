#[macro_use]
extern crate swc_plugins;
extern crate swc_common;

use swc_common::Fold;
use swc_plugins::Registrar;

register_plugin!(register);

pub struct Increment;

impl Fold<u32> for Increment {
    #[no_mangle]
    fn fold(&mut self, n: u32) -> u32 {
        n + 1
    }
}

fn register(reg: &mut Registrar) {
    reg.register::<u32, _>(Increment);
}
