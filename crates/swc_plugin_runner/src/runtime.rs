use std::any::Any;
use std::sync::Arc;
use std::collections::HashMap;


pub type Value = i32;

pub struct Func(pub Box<dyn Any + Send>);
pub struct Store(pub Box<dyn Any + Send + Sync>);

#[derive(Clone)]
pub struct PluginFunc {
    pub sign: (u8, u8),
    pub func: Arc<dyn Fn(&mut dyn MemoryView<'_>, &[Value], &mut [Value]) + Send + Sync>
}

pub trait Builder: Send {
    fn new_store(&self) -> anyhow::Result<Store>;
    fn new_func(&self, store: &mut Store, func: PluginFunc)
        -> anyhow::Result<Func>;

    fn init(
        &self,
        store: Store,
        imports: HashMap<String, Func>,
        module: Box<[u8]>,
        cache: Option<Box<[u8]>>
    )
        -> anyhow::Result<Box<dyn Instance>>;
}

pub trait MemoryView<'a> {
    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()>;
    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()>;
}

pub trait Instance: Send {
    fn alloc(&mut self, size: u32) -> anyhow::Result<u32>;
    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32>;
    fn transform(&mut self);

    fn memory(&mut self) -> anyhow::Result<Box<dyn MemoryView<'_> + '_>>;
    fn cache(&self) -> anyhow::Result<Option<Box<[u8]>>>;
}

impl PluginFunc {
    pub fn from_fn<const A: usize, const R: usize, F>(f: F) -> Self
    where
        F: Fn(&mut dyn MemoryView<'_>, [i32; A]) -> [i32; R] + Send + Sync + 'static
    {
        PluginFunc {
            sign: (A.try_into().unwrap(), R.try_into().unwrap()),
            func: Arc::new(move |store, args, rv| {
                let args = args.try_into().unwrap();
                rv.copy_from_slice(&f(store, args));
            })
        }
    }
}
