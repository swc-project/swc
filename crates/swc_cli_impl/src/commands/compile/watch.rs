use std::{
    collections::HashMap,
    path::PathBuf,
    sync::mpsc::{channel, Receiver},
};

use anyhow::Context;
use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use path_absolutize::Absolutize;

pub struct FileWatcher {
    _watcher: RecommendedWatcher,
    receiver: Receiver<notify::Result<Event>>,
}

pub struct PathChanges {
    pub changed: Vec<PathBuf>,
    pub removed: Vec<PathBuf>,
}

impl FileWatcher {
    pub fn new(raw_inputs: &[PathBuf]) -> anyhow::Result<Self> {
        let (sender, receiver) = channel();
        let mut watcher = RecommendedWatcher::new(
            move |event| {
                let _ = sender.send(event);
            },
            Config::default(),
        )?;

        for (path, recursive_mode) in collect_watch_roots(raw_inputs)? {
            watcher
                .watch(&path, recursive_mode)
                .with_context(|| format!("failed to watch {}", path.display()))?;
        }

        Ok(Self {
            _watcher: watcher,
            receiver,
        })
    }

    pub fn recv_changes(&self) -> anyhow::Result<PathChanges> {
        loop {
            let event = self
                .receiver
                .recv()
                .context("watch channel unexpectedly closed")??;

            if let Some(changes) = translate_event(event) {
                return Ok(changes);
            }
        }
    }
}

fn collect_watch_roots(raw_inputs: &[PathBuf]) -> anyhow::Result<HashMap<PathBuf, RecursiveMode>> {
    let mut roots = HashMap::new();

    for input in raw_inputs {
        let input = input.absolutize()?.into_owned();
        let (root, recursive_mode) = if input.is_dir() {
            (input, RecursiveMode::Recursive)
        } else {
            (
                input
                    .parent()
                    .map(PathBuf::from)
                    .unwrap_or_else(|| PathBuf::from(".")),
                RecursiveMode::NonRecursive,
            )
        };

        match roots.get_mut(&root) {
            Some(existing_mode) => {
                if *existing_mode == RecursiveMode::NonRecursive
                    && recursive_mode == RecursiveMode::Recursive
                {
                    *existing_mode = RecursiveMode::Recursive;
                }
            }
            None => {
                roots.insert(root, recursive_mode);
            }
        }
    }

    Ok(roots)
}

fn translate_event(event: Event) -> Option<PathChanges> {
    match event.kind {
        EventKind::Create(_) | EventKind::Modify(_) | EventKind::Remove(_) => {
            let mut changed = Vec::new();
            let mut removed = Vec::new();

            for path in event.paths {
                if path.exists() {
                    changed.push(path);
                } else {
                    removed.push(path);
                }
            }

            if changed.is_empty() && removed.is_empty() {
                None
            } else {
                Some(PathChanges { changed, removed })
            }
        }
        _ => None,
    }
}
