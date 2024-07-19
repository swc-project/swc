use swc_atoms::Atom;
use swc_common::{collections::AHashMap, Span};
use swc_css_ast::*;

use super::Compressor;
use crate::compressor::math::{is_calc_function_name, transform_calc_value_into_component_value};

// Calc-operator node of the calculation tree
// https://www.w3.org/TR/css-values-4/#calculation-tree-calc-operator-nodes
#[derive(Debug, Clone)]
enum CalcOperatorNode {
    Sum(Vec<CalcNode>),
    Product(Vec<CalcNode>),
    Negate(CalcNode),
    Invert(CalcNode),
}

#[derive(Debug, Clone)]
enum CalcNode {
    Number(Number),
    Dimension(Dimension),
    Percentage(Percentage),
    Constant(Ident),
    Function(Function),
    OperatorNode(Box<CalcOperatorNode>),
}

fn get_precision(n: f64) -> u32 {
    let n_as_str = n.to_string();
    n_as_str
        .find('.')
        .map_or(0, |sep| (n_as_str.len() - sep) as u32 - 1)
}

// Parse our AST (subtree) into a calculation tree (as defined by the spec)
// https://www.w3.org/TR/css-values-4/#parse-a-calculation
fn collect_calc_sum_into_calc_node(calc_sum: &CalcSum) -> CalcNode {
    let mut is_negated = false;
    let mut operands: Vec<CalcNode> = Vec::new();
    for node in &calc_sum.expressions {
        match &node {
            CalcProductOrOperator::Product(calc_product) => {
                let mut node = collect_calc_product_into_calc_node(calc_product);
                if is_negated {
                    node = CalcNode::OperatorNode(Box::new(CalcOperatorNode::Negate(node)));
                }
                operands.push(node);
            }
            CalcProductOrOperator::Operator(CalcOperator {
                value: CalcOperatorType::Sub,
                ..
            }) => {
                is_negated = true;
            }
            CalcProductOrOperator::Operator(CalcOperator {
                value: CalcOperatorType::Add,
                ..
            }) => {
                is_negated = false;
            }
            _ => {}
        }
    }

    if operands.len() == 1 {
        operands[0].clone()
    } else {
        CalcNode::OperatorNode(Box::new(CalcOperatorNode::Sum(operands)))
    }
}

fn collect_calc_product_into_calc_node(calc_product: &CalcProduct) -> CalcNode {
    let mut is_inverted = false;
    let mut operands: Vec<CalcNode> = Vec::new();
    for node in &calc_product.expressions {
        match &node {
            CalcValueOrOperator::Value(calc_value) => {
                let mut node = collect_calc_value_into_calc_node(calc_value);
                if is_inverted {
                    node = CalcNode::OperatorNode(Box::new(CalcOperatorNode::Invert(node)));
                }
                operands.push(node);
            }
            CalcValueOrOperator::Operator(CalcOperator {
                value: CalcOperatorType::Div,
                ..
            }) => {
                is_inverted = true;
            }
            CalcValueOrOperator::Operator(CalcOperator {
                value: CalcOperatorType::Mul,
                ..
            }) => {
                is_inverted = false;
            }
            _ => {}
        }
    }

    if operands.len() == 1 {
        operands[0].clone()
    } else {
        CalcNode::OperatorNode(Box::new(CalcOperatorNode::Product(operands)))
    }
}

fn collect_calc_value_into_calc_node(calc_value: &CalcValue) -> CalcNode {
    match calc_value {
        CalcValue::Number(n) => CalcNode::Number(n.clone()),
        CalcValue::Dimension(d) => CalcNode::Dimension(d.clone()),
        CalcValue::Percentage(p) => CalcNode::Percentage(p.clone()),
        CalcValue::Constant(c) => CalcNode::Constant(c.clone()),
        CalcValue::Function(f @ Function { name, value, .. })
            if is_calc_function_name(name) && value.len() == 1 =>
        {
            match &value[0] {
                ComponentValue::CalcSum(calc_sum) => collect_calc_sum_into_calc_node(calc_sum),
                _ => CalcNode::Function(f.clone()),
            }
        }
        CalcValue::Function(f) => CalcNode::Function(f.clone()),
        CalcValue::Sum(calc_sum) => collect_calc_sum_into_calc_node(calc_sum),
    }
}

// https://www.w3.org/TR/css-values-4/#calc-simplification
// Impl. note: our "simplify" implementation does not always return a canonical
// result For example:
// * we do not want to transform calc(10px / 3) in to 3.33333333333333px (we'd
//   lose precision)
// * we can not transform relative unit (em, vh, etc) into their canonical form
//   (we do not have the screen/browser context to compute it)
fn simplify_calc_node(calc_node: &CalcNode) -> CalcNode {
    match calc_node {
        CalcNode::Number(_)
        | CalcNode::Dimension(_)
        | CalcNode::Percentage(_)
        | CalcNode::Constant(_)
        | CalcNode::Function(_) => calc_node.clone(),
        CalcNode::OperatorNode(op) => simplify_calc_operator_node(op),
    }
}

fn simplify_calc_operator_node(calc_operator_node: &CalcOperatorNode) -> CalcNode {
    match calc_operator_node {
        CalcOperatorNode::Invert(inverted_calc_node) => {
            simplify_calc_operator_node_invert(inverted_calc_node)
        }
        CalcOperatorNode::Negate(negated_calc_node) => {
            simplify_calc_operator_node_negate(negated_calc_node)
        }
        CalcOperatorNode::Product(nodes) => simplify_calc_operator_node_product(nodes),
        CalcOperatorNode::Sum(nodes) => simplify_calc_operator_node_sum(nodes),
    }
}

// https://www.w3.org/TR/css-values-4/#calc-simplification - Step 7
// TODO for a better compress we should not always compute the reciprocal
// TODO currently we transform "x / 2" => "x * .5"... we should avoid it
fn simplify_calc_operator_node_invert(calc_node: &CalcNode) -> CalcNode {
    let calc_node = simplify_calc_node(calc_node);
    match &calc_node {
        CalcNode::Number(n) => {
            // If root’s child is a number (not a percentage or dimension) return the
            // reciprocal of the child’s value.
            if let Some(result) = try_to_divide_values(1.0, n.value) {
                CalcNode::Number(Number {
                    value: result,
                    span: n.span,
                    raw: n.raw.clone(),
                })
            } else {
                CalcNode::OperatorNode(Box::new(CalcOperatorNode::Invert(calc_node.clone())))
            }
        }
        CalcNode::OperatorNode(op) => {
            match &**op {
                // If root’s child is an Invert node, return the child’s child.
                CalcOperatorNode::Invert(node) => node.clone(),
                CalcOperatorNode::Product(children) => {
                    // Impl. note: not in spec, try to invert a fraction
                    if let Some(inverted_fraction) =
                        try_to_invert_if_children_are_fraction(children)
                    {
                        inverted_fraction
                    } else {
                        CalcNode::OperatorNode(Box::new(CalcOperatorNode::Invert(
                            calc_node.clone(),
                        )))
                    }
                }
                _ => CalcNode::OperatorNode(Box::new(CalcOperatorNode::Invert(calc_node.clone()))),
            }
        }
        _ => CalcNode::OperatorNode(Box::new(CalcOperatorNode::Invert(calc_node.clone()))),
    }
}

// https://www.w3.org/TR/css-values-4/#calc-simplification - Step 6
fn simplify_calc_operator_node_negate(calc_node: &CalcNode) -> CalcNode {
    try_to_switch_sign_of_nodes(&[simplify_calc_node(calc_node)]).unwrap_or_else(|| {
        CalcNode::OperatorNode(Box::new(CalcOperatorNode::Negate(calc_node.clone())))
    })
}

// https://www.w3.org/TR/css-values-4/#calc-simplification - Step 9
fn simplify_calc_operator_node_product(nodes: &[CalcNode]) -> CalcNode {
    let mut nodes = nodes.to_vec();

    // For each of root’s children that are Product nodes, replace them with their
    // children.
    let mut idx = 0;
    while idx < nodes.len() {
        nodes[idx] = simplify_calc_node(&nodes[idx]);
        if let Some(children) = get_children_if_node_is_product_operator(&nodes[idx]) {
            nodes.remove(idx);
            let mut i = idx;
            for nested_node in children {
                nodes.insert(i, nested_node);
                i += 1;
            }
        } else {
            idx += 1;
        }
    }

    // If root has multiple children that are numbers (not percentages or
    // dimensions), remove them and replace them with a single number containing
    // the product of the removed nodes.
    let mut number: Option<usize> = None;
    let mut idx = 0;
    while idx < nodes.len() {
        match &nodes[idx] {
            CalcNode::Number(_) => {
                if let Some(prev_idx) = number {
                    let previous_value = get_value(&nodes[prev_idx]);
                    let value = get_value(&nodes[idx]);
                    if let Some(result) = try_to_multiply_values(previous_value, value) {
                        set_value(&mut nodes[prev_idx], result);
                        nodes.remove(idx);
                    } else {
                        idx += 1;
                    }
                } else {
                    number = Some(idx);
                    idx += 1;
                }
            }
            _ => {
                idx += 1;
            }
        }
    }

    // If root contains only two children, one of which is a number (not a
    // percentage or dimension) and the other of which is a Sum whose children
    // are all numeric values, multiply all of the Sum’s children by the number,
    // then return the Sum.
    if nodes.len() == 2 {
        match (&nodes[0], &nodes[1]) {
            (CalcNode::Number(Number { value, .. }), CalcNode::OperatorNode(op))
            | (CalcNode::OperatorNode(op), CalcNode::Number(Number { value, .. })) => {
                if let CalcOperatorNode::Sum(children) = &**op {
                    if let Some(sum) =
                        try_to_multiply_all_numeric_sum_children_by_value(children, *value)
                    {
                        return sum;
                    }
                }
            }
            _ => {}
        }
    }

    // If root contains only numeric values and/or Invert nodes containing numeric
    // values, and multiplying the types of all the children (noting that the
    // type of an Invert node is the inverse of its child’s type) results in a
    // type that matches any of the types that a math function can resolve to,
    // return the result of multiplying all the values of the children
    // (noting that the value of an Invert node is the reciprocal of its child’s
    // value), expressed in the result’s canonical unit.
    nodes = try_to_multiply_all_numeric_and_invert_nodes(&nodes);

    if nodes.len() == 1 {
        nodes[0].clone()
    } else {
        CalcNode::OperatorNode(Box::new(CalcOperatorNode::Product(nodes.clone())))
    }
}

// https://www.w3.org/TR/css-values-4/#calc-simplification - Step 8
fn simplify_calc_operator_node_sum(nodes: &[CalcNode]) -> CalcNode {
    let mut nodes = nodes.to_vec();

    // For each of root’s children that are Sum nodes, replace them with their
    // children.
    let mut idx = 0;
    while idx < nodes.len() {
        nodes[idx] = simplify_calc_node(&nodes[idx]);
        if let Some(children) = get_children_if_node_is_sum_operator(&nodes[idx]) {
            nodes.remove(idx);
            let mut i = idx;
            for nested_node in children {
                nodes.insert(i, nested_node);
                i += 1;
            }
        } else {
            idx += 1;
        }
    }

    // For each set of root’s children that are numeric values with identical units,
    // remove those children and replace them with a single numeric value
    // containing the sum of the removed nodes, and with the same unit. (E.g.
    // combine numbers, combine percentages, combine px values, etc.)
    let mut number: Option<usize> = None;
    let mut percentage: Option<usize> = None;
    let mut dimensions: AHashMap<String, usize> = AHashMap::default();
    let mut idx = 0;
    while idx < nodes.len() {
        match &nodes[idx] {
            CalcNode::Number(_) => {
                if let Some(prev_idx) = number {
                    if try_to_sum_nodes(&mut nodes, prev_idx, idx) {
                        nodes.remove(idx);
                    } else {
                        idx += 1;
                    }
                } else {
                    number = Some(idx);
                    idx += 1;
                }
            }
            CalcNode::Dimension(d) => {
                let unit = get_dimension_unit_lowercase(d);
                match &dimensions.get(&*unit) {
                    Some(prev_idx) => {
                        if try_to_sum_nodes(&mut nodes, **prev_idx, idx) {
                            nodes.remove(idx);
                        } else {
                            idx += 1;
                        }
                    }
                    None => {
                        dimensions.insert(unit.to_string(), idx);
                        idx += 1;
                    }
                }
            }
            CalcNode::Percentage(_) => {
                if let Some(prev_idx) = percentage {
                    if try_to_sum_nodes(&mut nodes, prev_idx, idx) {
                        nodes.remove(idx);
                    } else {
                        idx += 1;
                    }
                } else {
                    percentage = Some(idx);
                    idx += 1;
                }
            }
            _ => {
                idx += 1;
            }
        }
    }

    // Impl. node: try to convert some units
    try_to_reduce_node_with_dimensions(&mut dimensions, &mut nodes);

    // If root has only a single child at this point, return the child. Otherwise,
    // return root.
    if nodes.len() == 1 {
        nodes[0].clone()
    } else {
        CalcNode::OperatorNode(Box::new(CalcOperatorNode::Sum(nodes.clone())))
    }
}

fn get_children_if_node_is_sum_operator(calc_node: &CalcNode) -> Option<Vec<CalcNode>> {
    match calc_node {
        CalcNode::OperatorNode(op) => match &**op {
            CalcOperatorNode::Sum(children) => Some(children.clone()),
            _ => None,
        },
        _ => None,
    }
}

fn get_children_if_node_is_product_operator(calc_node: &CalcNode) -> Option<Vec<CalcNode>> {
    match calc_node {
        CalcNode::OperatorNode(op) => match &**op {
            CalcOperatorNode::Product(children) => Some(children.clone()),
            _ => None,
        },
        _ => None,
    }
}

// Recursive impl. of https://www.w3.org/TR/css-values-4/#calc-simplification - Step 6
fn try_to_switch_sign_of_nodes(nodes: &[CalcNode]) -> Option<CalcNode> {
    let mut nodes = nodes.to_vec();
    let mut idx = 0;
    while idx < nodes.len() {
        let calc_node = &nodes[idx];
        nodes[idx] = match calc_node {
            // If root’s child is a numeric value, return an equivalent numeric value, but with the
            // value negated (0 - value).
            CalcNode::Number(_) | CalcNode::Dimension(_) | CalcNode::Percentage(_) => {
                let mut negated_node = calc_node.clone();
                set_value(&mut negated_node, -get_value(calc_node));
                negated_node
            }
            CalcNode::OperatorNode(op) => {
                match &**op {
                    // If root’s child is a Negate node, return the child’s child.
                    CalcOperatorNode::Negate(node) => node.clone(),
                    CalcOperatorNode::Sum(nodes) => {
                        // Impl. note: not in the spec, but we try to propagate the sign before
                        // continuing the simplification process
                        try_to_switch_sign_of_nodes(nodes)?
                    }
                    _ => return None,
                }
            }
            _ => {
                // Just wrap the constant (or function)
                CalcNode::OperatorNode(Box::new(CalcOperatorNode::Negate(calc_node.clone())))
            }
        };
        idx += 1;
    }

    if nodes.len() == 1 {
        Some(nodes[0].clone())
    } else {
        Some(CalcNode::OperatorNode(Box::new(CalcOperatorNode::Sum(
            nodes.to_vec(),
        ))))
    }
}

fn try_to_reduce_node_with_dimensions(
    dimensions: &mut AHashMap<String, usize>,
    nodes: &mut Vec<CalcNode>,
) {
    try_to_reduce_node_with_absolute_lengths(dimensions, nodes);
    try_to_reduce_node_with_durations(dimensions, nodes);
    try_to_reduce_node_with_frequencies(dimensions, nodes);
    try_to_reduce_node_with_resolutions(dimensions, nodes);
}

// https://www.w3.org/TR/css-values-4/#absolute-lengths
fn try_to_reduce_node_with_absolute_lengths(
    dimensions: &mut AHashMap<String, usize>,
    nodes: &mut Vec<CalcNode>,
) {
    if let (Some(idx_cm), Some(idx_mm)) = (dimensions.get("cm"), dimensions.get("mm")) {
        let value_cm = get_value(&nodes[*idx_cm]);
        let value_mm = get_value(&nodes[*idx_mm]);
        if let Some(result) = try_to_sum_values(value_cm, value_mm, Some(10.0)) {
            set_value(&mut nodes[*idx_mm], result);
            nodes.remove(*idx_cm);
        }
    }

    if let (Some(idx_mm), Some(idx_q)) = (dimensions.get("mm"), dimensions.get("q")) {
        let value_mm = get_value(&nodes[*idx_mm]);
        let value_q = get_value(&nodes[*idx_q]);
        if let Some(result) = try_to_sum_values(value_mm, value_q, Some(4.0)) {
            set_value(&mut nodes[*idx_q], result);
            nodes.remove(*idx_mm);
        }
    }

    if let (Some(idx_cm), Some(idx_q)) = (dimensions.get("cm"), dimensions.get("q")) {
        let value_cm = get_value(&nodes[*idx_cm]);
        let value_q = get_value(&nodes[*idx_q]);
        if let Some(result) = try_to_sum_values(value_cm, value_q, Some(40.0)) {
            set_value(&mut nodes[*idx_q], result);
            nodes.remove(*idx_cm);
        }
    }

    if let (Some(idx_in), Some(idx_px)) = (dimensions.get("in"), dimensions.get("px")) {
        let value_in = get_value(&nodes[*idx_in]);
        let value_px = get_value(&nodes[*idx_px]);
        if let Some(result) = try_to_sum_values(value_in, value_px, Some(96.0)) {
            set_value(&mut nodes[*idx_px], result);
            nodes.remove(*idx_in);
        }
    }

    if let (Some(idx_in), Some(idx_pc)) = (dimensions.get("in"), dimensions.get("pc")) {
        let value_in = get_value(&nodes[*idx_in]);
        let value_pc = get_value(&nodes[*idx_pc]);
        if let Some(result) = try_to_sum_values(value_in, value_pc, Some(6.0)) {
            set_value(&mut nodes[*idx_pc], result);
            nodes.remove(*idx_in);
        }
    }

    if let (Some(idx_pc), Some(idx_pt)) = (dimensions.get("pc"), dimensions.get("pt")) {
        let value_pc = get_value(&nodes[*idx_pc]);
        let value_pt = get_value(&nodes[*idx_pt]);
        if let Some(result) = try_to_sum_values(value_pc, value_pt, Some(12.0)) {
            set_value(&mut nodes[*idx_pt], result);
            nodes.remove(*idx_pc);
        }
    }

    if let (Some(idx_pc), Some(idx_px)) = (dimensions.get("pc"), dimensions.get("px")) {
        let value_pc = get_value(&nodes[*idx_pc]);
        let value_px = get_value(&nodes[*idx_px]);
        if let Some(result) = try_to_sum_values(value_pc, value_px, Some(16.0)) {
            set_value(&mut nodes[*idx_px], result);
            nodes.remove(*idx_pc);
        }
    }
}

// https://www.w3.org/TR/css-values-4/#time
fn try_to_reduce_node_with_durations(
    dimensions: &mut AHashMap<String, usize>,
    nodes: &mut Vec<CalcNode>,
) {
    if let (Some(idx_ms), Some(idx_s)) = (dimensions.get("ms"), dimensions.get("s")) {
        let value_ms = get_value(&nodes[*idx_ms]);
        let value_s = get_value(&nodes[*idx_s]);
        if let Some(result) = try_to_sum_values(value_s, value_ms, Some(1000.0)) {
            set_value(&mut nodes[*idx_ms], result);
            nodes.remove(*idx_s);
            dimensions.remove("s");
        }
    }
}

// https://www.w3.org/TR/css-values-4/#frequency
fn try_to_reduce_node_with_frequencies(
    dimensions: &mut AHashMap<String, usize>,
    nodes: &mut Vec<CalcNode>,
) {
    if let (Some(idx_hz), Some(idx_khz)) = (dimensions.get("hz"), dimensions.get("khz")) {
        let value_hz = get_value(&nodes[*idx_hz]);
        let value_khz = get_value(&nodes[*idx_khz]);
        if let Some(result) = try_to_sum_values(value_khz, value_hz, Some(1000.0)) {
            set_value(&mut nodes[*idx_hz], result);
            nodes.remove(*idx_khz);
            dimensions.remove("khz");
        }
    }
}

// https://www.w3.org/TR/css-values-4/#resolution
fn try_to_reduce_node_with_resolutions(
    dimensions: &mut AHashMap<String, usize>,
    nodes: &mut Vec<CalcNode>,
) {
    match (dimensions.get("dppx"), dimensions.get("x")) {
        // "x" is an alias for "dppx"
        (Some(idx_dppx), Some(idx_x)) => {
            let value_dppx = get_value(&nodes[*idx_dppx]);
            let value_x = get_value(&nodes[*idx_x]);
            if let Some(result) = try_to_sum_values(value_x, value_dppx, None) {
                set_value(&mut nodes[*idx_x], result);
                nodes.remove(*idx_dppx);
                dimensions.remove("dppx");
            }
        }
        (Some(idx_dppx), None) => {
            // rename "dppx" into "x"
            if let CalcNode::Dimension(Dimension::Resolution(r)) = &mut nodes[*idx_dppx] {
                r.unit.value = "x".into();
                dimensions.insert("x".into(), *idx_dppx);
                dimensions.remove("dppx");
            }
        }
        _ => {}
    }

    if let (Some(idx_x), Some(idx_dpi)) = (dimensions.get("x"), dimensions.get("dpi")) {
        let value_x = get_value(&nodes[*idx_x]);
        let value_dpi = get_value(&nodes[*idx_dpi]);
        if let Some(result) = try_to_sum_values(value_x, value_dpi, Some(96.0)) {
            set_value(&mut nodes[*idx_dpi], result);
            nodes.remove(*idx_x);
            dimensions.remove("x");
        }
    }

    if let (Some(idx_dpcm), Some(idx_dpi)) = (dimensions.get("dpcm"), dimensions.get("dpi")) {
        let value_dpcm = get_value(&nodes[*idx_dpcm]);
        let value_dpi = get_value(&nodes[*idx_dpi]);
        if let Some(result) = try_to_sum_values(value_dpcm, value_dpi, Some(2.54)) {
            set_value(&mut nodes[*idx_dpi], result);
            nodes.remove(*idx_dpcm);
            dimensions.remove("dpcm");
        }
    }
}

fn try_to_multiply_all_numeric_sum_children_by_value(
    nodes: &[CalcNode],
    value: f64,
) -> Option<CalcNode> {
    let mut operands = Vec::new();

    for calc_node in nodes {
        match calc_node {
            CalcNode::Number(_) | CalcNode::Dimension(_) | CalcNode::Percentage(_) => {
                let node_value = get_value(calc_node);
                if let Some(result) = try_to_multiply_values(node_value, value) {
                    let mut node = calc_node.clone();
                    set_value(&mut node, result);
                    operands.push(node);
                } else {
                    return None;
                }
            }
            _ => return None,
        }
    }

    Some(CalcNode::OperatorNode(Box::new(CalcOperatorNode::Sum(
        operands,
    ))))
}

fn try_to_invert_if_children_are_fraction(children: &[CalcNode]) -> Option<CalcNode> {
    if children.len() == 2 {
        match (&children[0], &children[1]) {
            (CalcNode::OperatorNode(_), _) => None,
            (numerator, CalcNode::OperatorNode(op)) => {
                if let CalcOperatorNode::Invert(denominator) = &**op {
                    Some(CalcNode::OperatorNode(Box::new(CalcOperatorNode::Product(
                        vec![
                            denominator.clone(),
                            CalcNode::OperatorNode(Box::new(CalcOperatorNode::Invert(
                                numerator.clone(),
                            ))),
                        ],
                    ))))
                } else {
                    None
                }
            }
            (_, _) => None,
        }
    } else {
        None
    }
}

// https://drafts.css-houdini.org/css-typed-om-1/#cssnumericvalue-multiply-two-types
// This implementation does not handle "multiplying the types of all the
// children". This function only handles numeric values and invert of numeric
// values
fn try_to_multiply_all_numeric_and_invert_nodes(children: &[CalcNode]) -> Vec<CalcNode> {
    let mut nodes = children.to_vec();

    let mut numeric: Option<usize> = None;
    let mut idx = 0;
    while idx < nodes.len() {
        match numeric {
            None => {
                match &nodes[idx] {
                    CalcNode::Number(_) | CalcNode::Dimension(_) | CalcNode::Percentage(_) => {
                        numeric = Some(idx);
                    }
                    CalcNode::OperatorNode(op) => {
                        if let CalcOperatorNode::Invert(CalcNode::Number(_)) = &**op {
                            numeric = Some(idx);
                        }
                    }
                    _ => {}
                };
                idx += 1;
            }
            Some(prev_idx) => {
                let prev_numeric_node = &nodes[prev_idx];
                let cur_numeric_node = &nodes[idx];
                match (prev_numeric_node, cur_numeric_node) {
                    // x * y => z
                    // x * y% => z%
                    // x * yPX => zPX
                    (CalcNode::Number(_), other_node @ CalcNode::Number(_))
                    | (CalcNode::Number(_), other_node @ CalcNode::Percentage(_))
                    | (other_node @ CalcNode::Percentage(_), CalcNode::Number(_))
                    | (CalcNode::Number(_), other_node @ CalcNode::Dimension(_))
                    | (other_node @ CalcNode::Dimension(_), CalcNode::Number(_)) => {
                        let prev_value = get_value(prev_numeric_node);
                        let value = get_value(cur_numeric_node);
                        if let Some(result) = try_to_multiply_values(prev_value, value) {
                            nodes[prev_idx] = other_node.clone();
                            set_value(&mut nodes[prev_idx], result);
                            nodes.remove(idx);
                        } else {
                            idx += 1;
                        }
                    }
                    // 1/x * 1/y => 1/z
                    (CalcNode::OperatorNode(prev_op), CalcNode::OperatorNode(op)) => {
                        if let CalcOperatorNode::Invert(prev_numeric_node @ CalcNode::Number(_)) =
                            &**prev_op
                        {
                            if let CalcOperatorNode::Invert(
                                cur_numeric_node @ CalcNode::Number(_),
                            ) = &**op
                            {
                                let prev_value = get_value(prev_numeric_node);
                                let value = get_value(cur_numeric_node);
                                if let Some(result) = try_to_multiply_values(prev_value, value) {
                                    let mut result_node = prev_numeric_node.clone();
                                    set_value(&mut result_node, result);
                                    nodes[prev_idx] = CalcNode::OperatorNode(Box::new(
                                        CalcOperatorNode::Invert(result_node),
                                    ));
                                    nodes.remove(idx);
                                } else {
                                    idx += 1;
                                }
                            } else {
                                idx += 1;
                            }
                        } else {
                            idx += 1;
                        }
                    }
                    // 1/x * y => z
                    // 1/x * y% => z%
                    // 1/x * yPX => zPX
                    (numeric_node @ CalcNode::Number(_), CalcNode::OperatorNode(op))
                    | (CalcNode::OperatorNode(op), numeric_node @ CalcNode::Number(_))
                    | (numeric_node @ CalcNode::Dimension(_), CalcNode::OperatorNode(op))
                    | (CalcNode::OperatorNode(op), numeric_node @ CalcNode::Dimension(_))
                    | (numeric_node @ CalcNode::Percentage(_), CalcNode::OperatorNode(op))
                    | (CalcNode::OperatorNode(op), numeric_node @ CalcNode::Percentage(_)) => {
                        if let CalcOperatorNode::Invert(inverted_node @ CalcNode::Number(_)) = &**op
                        {
                            let numerator = get_value(numeric_node);
                            let denominator = get_value(inverted_node);
                            if let Some(result) = try_to_divide_values(numerator, denominator) {
                                nodes[prev_idx] = numeric_node.clone();
                                set_value(&mut nodes[prev_idx], result);
                                nodes.remove(idx);
                            } else {
                                idx += 1;
                            }
                        } else {
                            idx += 1;
                        }
                    }
                    (CalcNode::Percentage(_), CalcNode::Percentage(_))
                    | (CalcNode::Percentage(_), CalcNode::Dimension(_))
                    | (CalcNode::Dimension(_), CalcNode::Percentage(_))
                    | (CalcNode::Dimension(_), CalcNode::Dimension(_)) => {
                        // Not handled by this impl, just skip it
                        idx += 1;
                    }
                    // Not a (inverted) numeric value
                    _ => idx += 1,
                }
            }
        }
    }

    nodes
}

fn try_to_multiply_values(v1: f64, v2: f64) -> Option<f64> {
    let result = v1 * v2;

    let precision1 = get_precision(v1);
    let precision2 = get_precision(v2);
    let result_precision = get_precision(result);

    if result_precision <= (precision1 + precision2) {
        Some(result)
    } else {
        None
    }
}

fn try_to_sum_nodes(nodes: &mut [CalcNode], prev_idx: usize, idx: usize) -> bool {
    let previous_value = get_value(&nodes[prev_idx]);
    let value = get_value(&nodes[idx]);
    if let Some(result) = try_to_sum_values(previous_value, value, None) {
        set_value(&mut nodes[prev_idx], result);
        true
    } else {
        false
    }
}

/// ratio is applied to n1
fn try_to_sum_values(n1: f64, n2: f64, ratio: Option<f64>) -> Option<f64> {
    let result = match ratio {
        None => n1 + n2,
        Some(r) => n1.mul_add(r, n2),
    };

    let precision1 = get_precision(n1);
    let precision2 = get_precision(n2) + ratio.map_or(0, get_precision);
    let result_precision = get_precision(result);

    if result_precision <= precision1.max(precision2) {
        Some(result)
    } else {
        None
    }
}

fn try_to_divide_values(numerator: f64, denominator: f64) -> Option<f64> {
    let result = numerator / denominator;
    let result_precision = get_precision(result);

    if result_precision <= f64::DIGITS {
        Some(result)
    } else {
        None
    }
}

// Serialize our calculation tree into a "calc" AST
// https://www.w3.org/TR/css-values-4/#serialize-a-calculation-tree
// Impl. note: we cannot strictly follow the spec, we need to adapt it to our
// typed AST
fn serialize_calculation_node_into_calc_sum(calc_node: &CalcNode) -> CalcSum {
    match calc_node {
        CalcNode::Number(_)
        | CalcNode::Dimension(_)
        | CalcNode::Percentage(_)
        | CalcNode::Constant(_)
        | CalcNode::Function(_) => CalcSum {
            expressions: vec![serialize_calc_node_into_calc_product(calc_node)],
            span: Span::dummy_with_cmt(),
        },
        CalcNode::OperatorNode(op) => match &**op {
            CalcOperatorNode::Sum(nodes) => {
                let mut expr: Vec<CalcProductOrOperator> = Vec::new();

                let nodes = sort_calculations_children(nodes);

                let mut nodes_iter = nodes.iter();

                if let Some(calc_node) = nodes_iter.next() {
                    expr.push(serialize_calc_node_into_calc_product(calc_node));
                }

                for calc_node in nodes_iter {
                    match calc_node {
                        CalcNode::Number(_) | CalcNode::Dimension(_) | CalcNode::Percentage(_) => {
                            let value = get_value(calc_node);
                            if value.is_sign_negative() {
                                // Instead of serializing "x + -10", we want to have "x - 10"
                                let mut node = calc_node.clone();
                                set_value(&mut node, -value);
                                expr.push(CalcProductOrOperator::Operator(CalcOperator {
                                    value: CalcOperatorType::Sub,
                                    span: Span::dummy_with_cmt(),
                                }));
                                expr.push(serialize_calc_node_into_calc_product(&node));
                            } else {
                                expr.push(CalcProductOrOperator::Operator(CalcOperator {
                                    value: CalcOperatorType::Add,
                                    span: Span::dummy_with_cmt(),
                                }));
                                expr.push(serialize_calc_node_into_calc_product(calc_node));
                            }
                        }
                        CalcNode::Constant(_) | CalcNode::Function(_) => {
                            expr.push(CalcProductOrOperator::Operator(CalcOperator {
                                value: CalcOperatorType::Add,
                                span: Span::dummy_with_cmt(),
                            }));
                            expr.push(serialize_calc_node_into_calc_product(calc_node));
                        }
                        CalcNode::OperatorNode(op) => match &**op {
                            CalcOperatorNode::Product(_) => {
                                expr.push(CalcProductOrOperator::Operator(CalcOperator {
                                    value: CalcOperatorType::Add,
                                    span: Span::dummy_with_cmt(),
                                }));
                                expr.push(serialize_calc_node_into_calc_product(calc_node));
                            }
                            CalcOperatorNode::Negate(calc_node) => {
                                expr.push(CalcProductOrOperator::Operator(CalcOperator {
                                    value: CalcOperatorType::Sub,
                                    span: Span::dummy_with_cmt(),
                                }));
                                expr.push(serialize_calc_node_into_calc_product(calc_node));
                            }
                            _ => unreachable!("Cannot transform sum children into CalcProduct"),
                        },
                    }
                }
                CalcSum {
                    expressions: expr,
                    span: Span::dummy_with_cmt(),
                }
            }
            _ => CalcSum {
                expressions: vec![serialize_calc_node_into_calc_product(calc_node)],
                span: Span::dummy_with_cmt(),
            },
        },
    }
}

fn serialize_calc_node_into_calc_product(calc_node: &CalcNode) -> CalcProductOrOperator {
    match calc_node {
        CalcNode::Number(_)
        | CalcNode::Dimension(_)
        | CalcNode::Percentage(_)
        | CalcNode::Constant(_)
        | CalcNode::Function(_) => CalcProductOrOperator::Product(CalcProduct {
            expressions: vec![CalcValueOrOperator::Value(
                serialize_calc_node_into_calc_value(calc_node),
            )],
            span: Span::dummy_with_cmt(),
        }),
        CalcNode::OperatorNode(op) => match &**op {
            CalcOperatorNode::Negate(_) => CalcProductOrOperator::Product(CalcProduct {
                expressions: vec![
                    CalcValueOrOperator::Value(CalcValue::Number(Number {
                        value: -1.0,
                        span: Span::dummy_with_cmt(),
                        raw: None,
                    })),
                    CalcValueOrOperator::Operator(CalcOperator {
                        value: CalcOperatorType::Mul,
                        span: Span::dummy_with_cmt(),
                    }),
                    CalcValueOrOperator::Value(serialize_calc_node_into_calc_value(calc_node)),
                ],
                span: Span::dummy_with_cmt(),
            }),
            CalcOperatorNode::Invert(_) => CalcProductOrOperator::Product(CalcProduct {
                expressions: vec![
                    CalcValueOrOperator::Value(CalcValue::Number(Number {
                        value: 1.0,
                        span: Span::dummy_with_cmt(),
                        raw: None,
                    })),
                    CalcValueOrOperator::Operator(CalcOperator {
                        value: CalcOperatorType::Div,
                        span: Span::dummy_with_cmt(),
                    }),
                    CalcValueOrOperator::Value(serialize_calc_node_into_calc_value(calc_node)),
                ],
                span: Span::dummy_with_cmt(),
            }),
            CalcOperatorNode::Product(nodes) => {
                let mut expr: Vec<CalcValueOrOperator> = Vec::new();

                let nodes = sort_calculations_children(nodes);

                let mut nodes_iter = nodes.iter();

                if let Some(calc_node) = nodes_iter.next() {
                    expr.push(CalcValueOrOperator::Value(
                        serialize_calc_node_into_calc_value(calc_node),
                    ))
                }

                for calc_node in nodes_iter {
                    match calc_node {
                        CalcNode::Number(_)
                        | CalcNode::Dimension(_)
                        | CalcNode::Percentage(_)
                        | CalcNode::Constant(_)
                        | CalcNode::Function(_) => {
                            expr.push(CalcValueOrOperator::Operator(CalcOperator {
                                value: CalcOperatorType::Mul,
                                span: Span::dummy_with_cmt(),
                            }));
                            expr.push(CalcValueOrOperator::Value(
                                serialize_calc_node_into_calc_value(calc_node),
                            ));
                        }
                        CalcNode::OperatorNode(op) => match &**op {
                            CalcOperatorNode::Invert(calc_node) => {
                                expr.push(CalcValueOrOperator::Operator(CalcOperator {
                                    value: CalcOperatorType::Div,
                                    span: Span::dummy_with_cmt(),
                                }));
                                expr.push(CalcValueOrOperator::Value(
                                    serialize_calc_node_into_calc_value(calc_node),
                                ));
                            }
                            CalcOperatorNode::Product(_) | CalcOperatorNode::Sum(_) => {
                                expr.push(CalcValueOrOperator::Operator(CalcOperator {
                                    value: CalcOperatorType::Mul,
                                    span: Span::dummy_with_cmt(),
                                }));
                                expr.push(CalcValueOrOperator::Value(
                                    serialize_calc_node_into_calc_value(calc_node),
                                ));
                            }
                            _ => unreachable!("Cannot transform product children into CalcProduct"),
                        },
                    }
                }
                CalcProductOrOperator::Product(CalcProduct {
                    expressions: expr,
                    span: Span::dummy_with_cmt(),
                })
            }
            CalcOperatorNode::Sum(_) => CalcProductOrOperator::Product(CalcProduct {
                expressions: vec![CalcValueOrOperator::Value(
                    serialize_calc_node_into_calc_value(calc_node),
                )],
                span: Span::dummy_with_cmt(),
            }),
        },
    }
}

fn serialize_calc_node_into_calc_value(calc_node: &CalcNode) -> CalcValue {
    match calc_node {
        CalcNode::Number(n) => CalcValue::Number(n.clone()),
        CalcNode::Dimension(d) => CalcValue::Dimension(d.clone()),
        CalcNode::Percentage(p) => CalcValue::Percentage(p.clone()),
        CalcNode::Constant(i) => CalcValue::Constant(i.clone()),
        CalcNode::Function(f) => CalcValue::Function(f.clone()),
        CalcNode::OperatorNode(op) => match &**op {
            CalcOperatorNode::Sum(_) => {
                CalcValue::Sum(serialize_calculation_node_into_calc_sum(calc_node))
            }
            CalcOperatorNode::Product(_) => CalcValue::Sum(CalcSum {
                expressions: vec![serialize_calc_node_into_calc_product(calc_node)],
                span: Span::dummy_with_cmt(),
            }),
            _ => unreachable!("Cannot transform CalcNode::OperatorNode into CalcValue"),
        },
    }
}

// https://www.w3.org/TR/css-values-4/#sort-a-calculations-children
// Impl. note: since some computations cannot be done (because of a potential
// loss of precision), we need to keep all numbers, percentages, and so on
// (instead of only one)
fn sort_calculations_children(nodes: &[CalcNode]) -> Vec<CalcNode> {
    let mut ret: Vec<CalcNode> = Vec::new();

    // If nodes contains a number, remove it from nodes and append it to ret.
    let mut numbers: Vec<CalcNode> = nodes
        .iter()
        .filter(|n| match n {
            CalcNode::Number(_) => true,
            _ => false,
        })
        .cloned()
        .collect();
    ret.append(&mut numbers);

    // If nodes contains a percentage, remove it from nodes and append it to ret.
    let mut percentages: Vec<CalcNode> = nodes
        .iter()
        .filter(|n| match n {
            CalcNode::Percentage(_) => true,
            _ => false,
        })
        .cloned()
        .collect();
    ret.append(&mut percentages);

    // If nodes contains any dimensions, remove them from nodes, sort them by their
    // units, ordered ASCII case-insensitively, and append them to ret.
    let mut dimensions: Vec<CalcNode> = nodes
        .iter()
        .filter(|n| match n {
            CalcNode::Dimension(_) => true,
            _ => false,
        })
        .cloned()
        .collect();
    dimensions.sort_by(|a, b| match (a, b) {
        (CalcNode::Dimension(d1), CalcNode::Dimension(d2)) => {
            let u1 = get_dimension_unit_lowercase(d1);
            let u2 = get_dimension_unit_lowercase(d2);
            u1.cmp(&u2)
        }
        _ => unreachable!("The vector should only contain dimensions"),
    });
    ret.append(&mut dimensions);

    // If nodes still contains any items, append them to ret in the same order.
    let mut any_items: Vec<CalcNode> = nodes
        .iter()
        .filter(|n| match n {
            CalcNode::Number(_) | CalcNode::Percentage(_) | CalcNode::Dimension(_) => false,
            _ => true,
        })
        .cloned()
        .collect();
    ret.append(&mut any_items);

    // Impl. note: not in spec, for a better compression, we need to be sure the
    // first item is not negative (if it exists)
    // "-3px + .75rem" => ".75rem - 3px"
    if let Some(idx) = ret.iter().position(is_positive_value) {
        // Move the first positive value at the beginning
        let positive_value = ret.remove(idx);
        ret.insert(0, positive_value);
    }

    ret
}

fn get_dimension_unit_lowercase(d: &Dimension) -> Atom {
    match d {
        Dimension::Length(l) => l.unit.value.to_ascii_lowercase(),
        Dimension::Angle(a) => a.unit.value.to_ascii_lowercase(),
        Dimension::Time(t) => t.unit.value.to_ascii_lowercase(),
        Dimension::Frequency(f) => f.unit.value.to_ascii_lowercase(),
        Dimension::Resolution(r) => r.unit.value.to_ascii_lowercase(),
        Dimension::Flex(f) => f.unit.value.to_ascii_lowercase(),
        Dimension::UnknownDimension(u) => u.unit.value.to_ascii_lowercase(),
    }
}

fn is_positive_value(calc_node: &CalcNode) -> bool {
    match calc_node {
        CalcNode::Number(_) | CalcNode::Percentage(_) | CalcNode::Dimension(_) => {
            get_value(calc_node).is_sign_positive()
        }
        _ => false,
    }
}

fn get_value(calc_node: &CalcNode) -> f64 {
    match calc_node {
        CalcNode::Number(n) => n.value,
        CalcNode::Percentage(p) => p.value.value,
        CalcNode::Dimension(Dimension::Length(l)) => l.value.value,
        CalcNode::Dimension(Dimension::Angle(a)) => a.value.value,
        CalcNode::Dimension(Dimension::Time(t)) => t.value.value,
        CalcNode::Dimension(Dimension::Frequency(f)) => f.value.value,
        CalcNode::Dimension(Dimension::Resolution(r)) => r.value.value,
        CalcNode::Dimension(Dimension::Flex(f)) => f.value.value,
        CalcNode::Dimension(Dimension::UnknownDimension(u)) => u.value.value,
        _ => unreachable!("Can only get a value from a value node"),
    }
}

fn set_value(calc_node: &mut CalcNode, value: f64) {
    match calc_node {
        CalcNode::Number(n) => n.value = value,
        CalcNode::Percentage(p) => p.value.value = value,
        CalcNode::Dimension(Dimension::Length(l)) => l.value.value = value,
        CalcNode::Dimension(Dimension::Angle(a)) => a.value.value = value,
        CalcNode::Dimension(Dimension::Time(t)) => t.value.value = value,
        CalcNode::Dimension(Dimension::Frequency(f)) => f.value.value = value,
        CalcNode::Dimension(Dimension::Resolution(r)) => r.value.value = value,
        CalcNode::Dimension(Dimension::Flex(f)) => f.value.value = value,
        CalcNode::Dimension(Dimension::UnknownDimension(u)) => u.value.value = value,
        _ => unreachable!("Can only set a value into a value node"),
    }
}

impl Compressor {
    // https://www.w3.org/TR/css-values-4/#calculation-tree
    pub(super) fn compress_calc_sum(&mut self, calc_sum: &mut CalcSum) {
        let root_calc_node = collect_calc_sum_into_calc_node(calc_sum);

        let simplified_calc_tree = simplify_calc_node(&root_calc_node);

        let simplified_calc_sum = serialize_calculation_node_into_calc_sum(&simplified_calc_tree);
        calc_sum.expressions = simplified_calc_sum.expressions;
    }

    pub(super) fn compress_calc_sum_in_component_value(
        &mut self,
        component_value: &mut ComponentValue,
    ) {
        match &component_value {
            // Transform "calc(calc-sum)" into "simple value" when calc-sum is not a complex
            // expression
            ComponentValue::Function(function)
                if is_calc_function_name(&function.name) && function.value.len() == 1 =>
            {
                match &function.value[0] {
                    ComponentValue::CalcSum(calc_sum) if calc_sum.expressions.len() == 1 => {
                        match &calc_sum.expressions[0] {
                            CalcProductOrOperator::Product(CalcProduct {
                                expressions: calc_product_expressions,
                                ..
                            }) if calc_product_expressions.len() == 1 => {
                                if let CalcValueOrOperator::Value(calc_value) =
                                    &calc_product_expressions[0]
                                {
                                    if let Some(cv) =
                                        transform_calc_value_into_component_value(calc_value)
                                    {
                                        *component_value = cv;
                                    }
                                }
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
