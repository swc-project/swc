use rkyv::{AlignedVec, Deserialize};
use swc_plugin::{ModuleItem, Program, VisitMut};

struct Dummy;

impl VisitMut for Dummy {
    fn visit_mut_module_item(&mut self, _module: &mut ModuleItem) {
        // noop
    }
}

#[no_mangle]
// TODO:
// - this is not complete signature, need to take config_json
// - swc_plugin macro to support ergonomic interfaces
// - better developer experience: println / dbg!() doesn't emit anything
// - typed json config instead of str, which requires additional deserialization
pub fn process(ast_ptr: *mut u8, len: u32) -> (i32, i32) {
    let mut vec = AlignedVec::with_capacity(len.try_into().unwrap());
    let v = unsafe { std::slice::from_raw_parts(ast_ptr, len.try_into().unwrap()) };
    vec.extend_from_slice(v);

    // TODO: trait bound complaining in deserialize_for_plugin<T>
    let archived = unsafe { rkyv::archived_root::<Program>(&vec[..]) };
    let _v: Program = archived.deserialize(&mut rkyv::Infallible).unwrap();

    (0, 0)
}
