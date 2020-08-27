//! https://www.w3.org/TR/selectors-3/#w3cselgrammar

use crate::{
    util::{skip_ws, span, PResultExt},
    Input, PResult,
};
use nom::{
    bytes::complete::{tag, take_while},
    multi::separated_list,
};
use swc_css_ast::*;

pub(crate) fn parse_selectors(i: Input) -> PResult<Vec<Selector>> {
    separated_list(|c| c == ',', parse_selector)(i)
}

fn parse_selector(i: Input) -> PResult<Selector> {
    let i = skip_ws(i);
    let base = parse_base_selector(i)?;
}

fn parse_base_selector(i: Input) -> PResult<BaseSelector> {
    if i.starts_with('#') {
        return parse_id_selector(i).map_from();
    }

    if i.starts_with('.') {
        return parse_class_selector(i).map_from();
    }

    parse_tag_selector(i).map_from()
}

fn parse_id_selector(i: Input) -> PResult<IdSelector> {
    let start = i.start_pos();

    let (i, _) = tag("#")(i)?;
    let (i, text) = take_while(|c| {})(i).map_from()?;

    Ok((
        i,
        IdSelector {
            span: span(i, start),
            text,
        },
    ))
}

fn parse_class_selector(i: Input) -> PResult<ClassSelector> {
    let (i, _) = tag(".")(i)?;
}

fn parse_tag_selector(i: Input) -> PResult<TagSelector> {}
