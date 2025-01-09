use std::{
    thread::{self, sleep},
    time::Duration,
};

use swc_parallel::{items::Items, join};

struct Context {
    sum: usize,
}

impl Parallel for Context {
    fn create(&self) -> Self {
        Context { sum: 0 }
    }

    fn merge(&mut self, other: Self) {
        self.sum += other.sum;
    }
}

#[test]
fn case_1_single_thread() {
    sum_in_parallel(10000);
}

#[test]
fn case_2_wait_for() {
    let threads = 100;
    let mut handles = vec![];

    for _ in 0..threads {
        handles.push(thread::spawn(move || sum_in_parallel(10000)));
    }

    sleep(Duration::from_secs(1));
}

#[test]
fn case_3_early_exit_of_entry() {
    let threads = 100;
    let mut handles = vec![];

    for _ in 0..threads {
        handles.push(thread::spawn(move || {
            sleep(Duration::from_secs(1));

            sum_in_parallel(10000)
        }));
    }
}

#[test]
fn case_4_explode() {
    let threads = 100;
    let mut handles = vec![];

    for _ in 0..threads {
        handles.push(thread::spawn(move || {
            sleep(Duration::from_secs(1));

            for _ in 0..10 {
                spawn_work();
            }
        }));
    }
}

fn spawn_work() {
    let _handle = thread::spawn(move || {
        sleep(Duration::from_secs(1));

        sum_in_parallel(10000)
    });
}

fn sum_in_parallel(to: usize) {
    let items = (0..to).into_iter().collect::<Vec<_>>();

    let mut ctx = Context { sum: 0 };
    maybe_par_idx_raw(&mut ctx, items, &|ctx, _idx, n| {
        ctx.sum += n;
    });

    assert_eq!(ctx.sum, to * (to - 1) / 2);
}

pub trait Parallel: Send + Sync {
    /// Used to create visitor.
    fn create(&self) -> Self;

    /// This can be called in anytime.
    fn merge(&mut self, other: Self);
}

fn maybe_par_idx_raw<C, I, F>(ctx: &mut C, nodes: I, op: &F)
where
    C: Parallel,
    I: Items,
    F: Send + Sync + Fn(&mut C, usize, I::Elem),
{
    let len = nodes.len();
    if len == 0 {
        return;
    }

    if len == 1 {
        op(ctx, 0, nodes.into_iter().next().unwrap());
        return;
    }

    let (na, nb) = nodes.split_at(len / 2);

    let (va, vb) = join(
        || {
            let mut new_ctx = ctx.create();
            maybe_par_idx_raw(&mut new_ctx, na, op);

            new_ctx
        },
        || {
            let mut new_ctx = ctx.create();
            maybe_par_idx_raw(&mut new_ctx, nb, op);

            new_ctx
        },
    );

    ctx.merge(va);
    ctx.merge(vb);

    return;
}
