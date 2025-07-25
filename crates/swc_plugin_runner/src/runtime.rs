use std::any::Any;
use std::path::Path;


pub type Value = i32;

pub struct ModuleCache(pub Box<dyn Any + Send + Sync>);

pub enum Module {
    Cache(ModuleCache),
    Bytes(Box<[u8]>)
}

pub struct Func {
    pub sign: (u8, u8),
    pub func: Box<dyn Fn(&mut dyn Caller<'_>, &[Value], &mut [Value]) + Send + Sync>
}

pub trait Builder: Send {
    fn prepare_module(&self, bytes: &[u8]) -> anyhow::Result<ModuleCache>;
    fn module_hash(&self, module: &[u8]) -> anyhow::Result<String>;
    
    fn init(
        &self,
        name: &str,
        imports: Vec<(String, Func)>,
        envs: Vec<(String, String)>,
        module: Module,
    )
        -> anyhow::Result<Box<dyn Instance>>;


    fn clone_cache(&self, _cache: &ModuleCache) -> Option<ModuleCache> {
        None
    }

    unsafe fn load_cache(&self, _path: &Path) -> Option<ModuleCache> {
        None
    }

    fn store_cache(&self, _path: &Path, _cache: &ModuleCache) -> anyhow::Result<()> {
        Ok(())
    }
}

pub trait Caller<'a> {
    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()>;
    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()>;

    fn alloc(&mut self, size: u32) -> anyhow::Result<u32>;
    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32>;    
}

pub trait Instance: Send {
    fn transform(
        &mut self,
        program_ptr: u32,
        program_len: u32,
        unresolved_mark: u32,
        should_enable_comments_proxy: u32
    ) -> anyhow::Result<u32>;

    fn caller(&mut self) -> anyhow::Result<Box<dyn Caller<'_> + '_>>;
    fn cache(&self) -> Option<ModuleCache>;

    fn cleanup(&mut self) -> anyhow::Result<()> {
        Ok(())
    }
}

impl Func {
    pub fn from_fn<const A: usize, const R: usize, F>(f: F) -> Self
    where
        F: Fn(&mut dyn Caller<'_>, [i32; A]) -> [i32; R] + Send + Sync + 'static
    {
        Func {
            sign: (A.try_into().unwrap(), R.try_into().unwrap()),
            func: Box::new(move |store, args, rv| {
                let args = args.try_into().unwrap();
                rv.copy_from_slice(&f(store, args));
            })
        }
    }
}
