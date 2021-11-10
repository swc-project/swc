use std::{
    io::{self, Write},
    time::{Duration, Instant},
};

use crate::util::now;

/// TOOD: Add timings.
#[derive(Default, Debug)]
pub struct Timings {
    current_section: Option<(String, Instant)>,
    entries: Vec<(String, Duration)>,
}

impl Timings {
    pub fn new() -> Timings {
        Timings {
            ..Default::default()
        }
    }

    pub fn section(&mut self, name: &str) {
        self.end_section();

        self.current_section = now().map(|now| (String::from(name), now));
    }

    pub fn end_section(&mut self) {
        if let Some((prev_name, prev_start)) = &self.current_section {
            self.entries.push((
                prev_name.clone(),
                Instant::now().duration_since(*prev_start),
            ));
        }
    }

    pub fn log(&mut self) {
        self.end_section();

        let entries_printout: Vec<u8> = self
            .entries
            .iter()
            .flat_map(|(name, duration)| {
                let sec_duration = duration.as_micros() / 1_000_000;

                format!("- {}: {:.6}s\n", name, sec_duration).into_bytes()
            })
            .collect();

        io::stderr()
            .write_all(&entries_printout)
            .expect("Could not write timings");

        *self = Timings::new();
    }
}
