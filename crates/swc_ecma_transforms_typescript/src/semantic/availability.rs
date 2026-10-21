//! Initialization order and execution regions, derived only from AST traversal.
//!
//! Constant evaluation and enum inlining share these coordinates. Source spans
//! and the order in which dependencies happen to be evaluated are not semantic
//! inputs to availability.

use std::ops::Range;

mod traversal;
pub(super) use traversal::{
    visit_execution_regions, visit_function_decorators, visit_function_execution,
};

#[derive(Debug, Clone, Copy)]
struct RegionId(usize);

/// The position and execution region of an enum member or const initializer.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Initialization {
    order: usize,
    region: RegionId,
}

/// A reference's current position in the same AST execution-order walk.
#[derive(Debug, Clone, Copy)]
pub(crate) struct UseSite {
    order: usize,
    region: RegionId,
}

impl Initialization {
    /// Constant-expression IR has no nested declarations. Its references occur
    /// immediately after this declaration's position in the order walk.
    pub(super) fn use_site(self) -> UseSite {
        UseSite {
            order: self.order + 1,
            region: self.region,
        }
    }
}

#[derive(Debug, Default)]
pub(super) struct Availability {
    regions: Vec<Range<usize>>,
}

impl Availability {
    pub(super) fn is_available(&self, definition: Initialization, usage: UseSite) -> bool {
        definition.order < usage.order || !self.regions[usage.region.0].contains(&definition.order)
    }

    pub(super) fn cursor(&self) -> AvailabilityCursor<'_> {
        AvailabilityCursor {
            facts: self,
            next_order: 0,
            next_region: 1,
            region: RegionId(0),
        }
    }
}

/// A single collection walk assigns both declaration order and region bounds.
pub(super) struct AvailabilityBuilder {
    facts: Availability,
    next_order: usize,
    region: RegionId,
}

pub(super) struct DeferredRegion {
    region: RegionId,
    parent: RegionId,
}

impl Default for AvailabilityBuilder {
    fn default() -> Self {
        Self {
            facts: Availability {
                regions: std::iter::once(0..0).collect(),
            },
            next_order: 0,
            region: RegionId(0),
        }
    }
}

impl AvailabilityBuilder {
    pub(super) fn initialization(&mut self) -> Initialization {
        let location = Initialization {
            order: self.next_order,
            region: self.region,
        };
        self.next_order += 1;
        location
    }

    pub(super) fn enter_deferred(&mut self) -> DeferredRegion {
        let region = RegionId(self.facts.regions.len());
        self.facts.regions.push(self.next_order..self.next_order);
        let parent = std::mem::replace(&mut self.region, region);
        DeferredRegion { region, parent }
    }

    pub(super) fn exit_deferred(&mut self, frame: DeferredRegion) {
        self.facts.regions[frame.region.0].end = self.next_order;
        self.region = frame.parent;
    }

    pub(super) fn finish(mut self) -> Availability {
        // The root is immediate execution and contains every declaration.
        self.facts.regions[0].end = self.next_order;
        self.facts
    }
}

/// Replay declaration and region events before erasure. Replacing a constant
/// read cannot remove either kind of event, so substitution preserves the walk.
pub(super) struct AvailabilityCursor<'a> {
    facts: &'a Availability,
    next_order: usize,
    next_region: usize,
    region: RegionId,
}

impl AvailabilityCursor<'_> {
    pub(super) fn initialization(&mut self) {
        self.next_order += 1;
    }

    pub(super) fn use_site(&self) -> UseSite {
        UseSite {
            order: self.next_order,
            region: self.region,
        }
    }

    pub(super) fn enter_deferred(&mut self) -> DeferredRegion {
        let region = RegionId(self.next_region);
        self.next_region += 1;
        let parent = std::mem::replace(&mut self.region, region);
        DeferredRegion { region, parent }
    }

    pub(super) fn exit_deferred(&mut self, frame: DeferredRegion) {
        self.region = frame.parent;
    }

    pub(super) fn finish(self) {
        debug_assert_eq!(
            self.next_order, self.facts.regions[0].end,
            "enum substitution must replay every declaration event before erasure"
        );
        debug_assert_eq!(
            self.next_region,
            self.facts.regions.len(),
            "enum substitution must replay every execution region before erasure"
        );
    }
}
