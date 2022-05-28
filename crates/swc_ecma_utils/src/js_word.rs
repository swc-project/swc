use unicode_id::UnicodeID;

pub fn is_valid_prop_ident(s: &str) -> bool {
    s.starts_with(|c: char| c.is_id_start()) && s.chars().all(|c: char| c.is_id_continue())
}
