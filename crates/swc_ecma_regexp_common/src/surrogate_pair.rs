pub fn is_lead_surrogate(cp: u32) -> bool {
    (0xd800..=0xdbff).contains(&cp)
}

pub fn is_trail_surrogate(cp: u32) -> bool {
    (0xdc00..=0xdfff).contains(&cp)
}

pub fn combine_surrogate_pair(lead: u32, trail: u32) -> u32 {
    (lead - 0xd800) * 0x400 + trail - 0xdc00 + 0x10000
}
