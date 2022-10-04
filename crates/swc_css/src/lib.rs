pub extern crate swc_css_ast as ast;
pub extern crate swc_css_codegen as codegen;
#[cfg(feature = "swc_css_minifier")]
#[cfg_attr(docsrs, doc(cfg(feature = "minifier")))]
pub extern crate swc_css_minifier as minifier;
#[cfg(feature = "swc_css_modules")]
#[cfg_attr(docsrs, doc(cfg(feature = "modules")))]
pub extern crate swc_css_modules as modules;
pub extern crate swc_css_parser as parser;
pub extern crate swc_css_utils as utils;
pub extern crate swc_css_visit as visit;
