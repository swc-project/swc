use crate::{id::ModuleId, module::TransformedModule};
use dashmap::DashMap;
use fxhash::FxBuildHasher;
use std::fmt::Debug;

pub trait Atomicity {
    type ModulesCache: Debug;
}

pub struct Atomic;

impl Atomicity for Atomic {
    type ModulesCache = DashMap<ModuleId, TransformedModule, FxBuildHasher>;
}

pub struct NonAtomic;

impl Atomicity for NonAtomic {}
