use swc_html_ast::*;

fn is_conditional_comment(data: &str) -> bool {
    let trimmed = data.trim();

    trimmed.starts_with("[if") || trimmed.ends_with("[endif]")
}

pub fn remove_comments(element: &mut Element) {
    element.children.retain(
        |child| !matches!(child, Child::Comment(comment) if !is_conditional_comment(&comment.data)),
    );
}
