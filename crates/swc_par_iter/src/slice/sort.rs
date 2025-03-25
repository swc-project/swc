//! **Parallel** Slice sorting
//!
//! This implementation is mostly copied from the `core::slice::sort` module, with minimal changes
//! to support stable Rust and parallel `is_less` (e.g. `Fn` rather than `FnMut`).
//!
//! ---
//!
//! This module contains a sorting algorithm based on Orson Peters' pattern-defeating quicksort,
//! published at: <https://github.com/orlp/pdqsort>
//!
//! Unstable sorting is compatible with core because it doesn't allocate memory, unlike our
//! stable sorting implementation.
//!
//! In addition it also contains the core logic of the stable sort used by `slice::sort` based on
//! TimSort.

use core::cmp;
use core::mem::{self, MaybeUninit};
use core::ptr;
use core::slice;

use crate::iter::{IndexedParallelIterator, ParallelIterator};
use crate::slice::ParallelSliceMut;
use crate::SendPtr;

// When dropped, copies from `src` into `dest`.
struct InsertionHole<T> {
    src: *const T,
    dest: *mut T,
}

impl<T> Drop for InsertionHole<T> {
    fn drop(&mut self) {
        // SAFETY: This is a helper class. Please refer to its usage for correctness. Namely, one
        // must be sure that `src` and `dst` does not overlap as required by
        // `ptr::copy_nonoverlapping` and are both valid for writes.
        unsafe {
            ptr::copy_nonoverlapping(self.src, self.dest, 1);
        }
    }
}

/// Inserts `v[v.len() - 1]` into pre-sorted sequence `v[..v.len() - 1]` so that whole `v[..]`
/// becomes sorted.
unsafe fn insert_tail<T, F>(v: &mut [T], is_less: &F)
where
    F: Fn(&T, &T) -> bool,
{
    debug_assert!(v.len() >= 2);

    let arr_ptr = v.as_mut_ptr();
    let i = v.len() - 1;

    // SAFETY: caller must ensure v is at least len 2.
    unsafe {
        // See insert_head which talks about why this approach is beneficial.
        let i_ptr = arr_ptr.add(i);

        // It's important that we use i_ptr here. If this check is positive and we continue,
        // We want to make sure that no other copy of the value was seen by is_less.
        // Otherwise we would have to copy it back.
        if is_less(&*i_ptr, &*i_ptr.sub(1)) {
            // It's important, that we use tmp for comparison from now on. As it is the value that
            // will be copied back. And notionally we could have created a divergence if we copy
            // back the wrong value.
            let tmp = mem::ManuallyDrop::new(ptr::read(i_ptr));
            // Intermediate state of the insertion process is always tracked by `hole`, which
            // serves two purposes:
            // 1. Protects integrity of `v` from panics in `is_less`.
            // 2. Fills the remaining hole in `v` in the end.
            //
            // Panic safety:
            //
            // If `is_less` panics at any point during the process, `hole` will get dropped and
            // fill the hole in `v` with `tmp`, thus ensuring that `v` still holds every object it
            // initially held exactly once.
            let mut hole = InsertionHole {
                src: &*tmp,
                dest: i_ptr.sub(1),
            };
            ptr::copy_nonoverlapping(hole.dest, i_ptr, 1);

            // SAFETY: We know i is at least 1.
            for j in (0..(i - 1)).rev() {
                let j_ptr = arr_ptr.add(j);
                if !is_less(&*tmp, &*j_ptr) {
                    break;
                }

                ptr::copy_nonoverlapping(j_ptr, hole.dest, 1);
                hole.dest = j_ptr;
            }
            // `hole` gets dropped and thus copies `tmp` into the remaining hole in `v`.
        }
    }
}

/// Inserts `v[0]` into pre-sorted sequence `v[1..]` so that whole `v[..]` becomes sorted.
///
/// This is the integral subroutine of insertion sort.
unsafe fn insert_head<T, F>(v: &mut [T], is_less: &F)
where
    F: Fn(&T, &T) -> bool,
{
    debug_assert!(v.len() >= 2);

    // SAFETY: caller must ensure v is at least len 2.
    unsafe {
        if is_less(v.get_unchecked(1), v.get_unchecked(0)) {
            let arr_ptr = v.as_mut_ptr();

            // There are three ways to implement insertion here:
            //
            // 1. Swap adjacent elements until the first one gets to its final destination.
            //    However, this way we copy data around more than is necessary. If elements are big
            //    structures (costly to copy), this method will be slow.
            //
            // 2. Iterate until the right place for the first element is found. Then shift the
            //    elements succeeding it to make room for it and finally place it into the
            //    remaining hole. This is a good method.
            //
            // 3. Copy the first element into a temporary variable. Iterate until the right place
            //    for it is found. As we go along, copy every traversed element into the slot
            //    preceding it. Finally, copy data from the temporary variable into the remaining
            //    hole. This method is very good. Benchmarks demonstrated slightly better
            //    performance than with the 2nd method.
            //
            // All methods were benchmarked, and the 3rd showed best results. So we chose that one.
            let tmp = mem::ManuallyDrop::new(ptr::read(arr_ptr));

            // Intermediate state of the insertion process is always tracked by `hole`, which
            // serves two purposes:
            // 1. Protects integrity of `v` from panics in `is_less`.
            // 2. Fills the remaining hole in `v` in the end.
            //
            // Panic safety:
            //
            // If `is_less` panics at any point during the process, `hole` will get dropped and
            // fill the hole in `v` with `tmp`, thus ensuring that `v` still holds every object it
            // initially held exactly once.
            let mut hole = InsertionHole {
                src: &*tmp,
                dest: arr_ptr.add(1),
            };
            ptr::copy_nonoverlapping(arr_ptr.add(1), arr_ptr.add(0), 1);

            for i in 2..v.len() {
                if !is_less(v.get_unchecked(i), &*tmp) {
                    break;
                }
                ptr::copy_nonoverlapping(arr_ptr.add(i), arr_ptr.add(i - 1), 1);
                hole.dest = arr_ptr.add(i);
            }
            // `hole` gets dropped and thus copies `tmp` into the remaining hole in `v`.
        }
    }
}

/// Sort `v` assuming `v[..offset]` is already sorted.
///
/// Never inline this function to avoid code bloat. It still optimizes nicely and has practically no
/// performance impact. Even improving performance in some cases.
#[inline(never)]
fn insertion_sort_shift_left<T, F>(v: &mut [T], offset: usize, is_less: &F)
where
    F: Fn(&T, &T) -> bool,
{
    let len = v.len();

    // Using assert here improves performance.
    assert!(offset != 0 && offset <= len);

    // Shift each element of the unsorted region v[i..] as far left as is needed to make v sorted.
    for i in offset..len {
        // SAFETY: we tested that `offset` must be at least 1, so this loop is only entered if len
        // >= 2. The range is exclusive and we know `i` must be at least 1 so this slice has at
        // >least len 2.
        unsafe {
            insert_tail(&mut v[..=i], is_less);
        }
    }
}

/// Sort `v` assuming `v[offset..]` is already sorted.
///
/// Never inline this function to avoid code bloat. It still optimizes nicely and has practically no
/// performance impact. Even improving performance in some cases.
#[inline(never)]
fn insertion_sort_shift_right<T, F>(v: &mut [T], offset: usize, is_less: &F)
where
    F: Fn(&T, &T) -> bool,
{
    let len = v.len();

    // Using assert here improves performance.
    assert!(offset != 0 && offset <= len && len >= 2);

    // Shift each element of the unsorted region v[..i] as far left as is needed to make v sorted.
    for i in (0..offset).rev() {
        // SAFETY: we tested that `offset` must be at least 1, so this loop is only entered if len
        // >= 2.We ensured that the slice length is always at least 2 long. We know that start_found
        // will be at least one less than end, and the range is exclusive. Which gives us i always
        // <= (end - 2).
        unsafe {
            insert_head(&mut v[i..len], is_less);
        }
    }
}

/// Partially sorts a slice by shifting several out-of-order elements around.
///
/// Returns `true` if the slice is sorted at the end. This function is *O*(*n*) worst-case.
#[cold]
fn partial_insertion_sort<T, F>(v: &mut [T], is_less: &F) -> bool
where
    F: Fn(&T, &T) -> bool,
{
    // Maximum number of adjacent out-of-order pairs that will get shifted.
    const MAX_STEPS: usize = 5;
    // If the slice is shorter than this, don't shift any elements.
    const SHORTEST_SHIFTING: usize = 50;

    let len = v.len();
    let mut i = 1;

    for _ in 0..MAX_STEPS {
        // SAFETY: We already explicitly did the bound checking with `i < len`.
        // All our subsequent indexing is only in the range `0 <= index < len`
        unsafe {
            // Find the next pair of adjacent out-of-order elements.
            while i < len && !is_less(v.get_unchecked(i), v.get_unchecked(i - 1)) {
                i += 1;
            }
        }

        // Are we done?
        if i == len {
            return true;
        }

        // Don't shift elements on short arrays, that has a performance cost.
        if len < SHORTEST_SHIFTING {
            return false;
        }

        // Swap the found pair of elements. This puts them in correct order.
        v.swap(i - 1, i);

        if i >= 2 {
            // Shift the smaller element to the left.
            insertion_sort_shift_left(&mut v[..i], i - 1, is_less);

            // Shift the greater element to the right.
            insertion_sort_shift_right(&mut v[..i], 1, is_less);
        }
    }

    // Didn't manage to sort the slice in the limited number of steps.
    false
}

/// Sorts `v` using heapsort, which guarantees *O*(*n* \* log(*n*)) worst-case.
#[cold]
fn heapsort<T, F>(v: &mut [T], is_less: F)
where
    F: Fn(&T, &T) -> bool,
{
    // This binary heap respects the invariant `parent >= child`.
    let sift_down = |v: &mut [T], mut node| {
        loop {
            // Children of `node`.
            let mut child = 2 * node + 1;
            if child >= v.len() {
                break;
            }

            // Choose the greater child.
            if child + 1 < v.len() {
                // We need a branch to be sure not to out-of-bounds index,
                // but it's highly predictable.  The comparison, however,
                // is better done branchless, especially for primitives.
                child += is_less(&v[child], &v[child + 1]) as usize;
            }

            // Stop if the invariant holds at `node`.
            if !is_less(&v[node], &v[child]) {
                break;
            }

            // Swap `node` with the greater child, move one step down, and continue sifting.
            v.swap(node, child);
            node = child;
        }
    };

    // Build the heap in linear time.
    for i in (0..v.len() / 2).rev() {
        sift_down(v, i);
    }

    // Pop maximal elements from the heap.
    for i in (1..v.len()).rev() {
        v.swap(0, i);
        sift_down(&mut v[..i], 0);
    }
}

/// Partitions `v` into elements smaller than `pivot`, followed by elements greater than or equal
/// to `pivot`.
///
/// Returns the number of elements smaller than `pivot`.
///
/// Partitioning is performed block-by-block in order to minimize the cost of branching operations.
/// This idea is presented in the [BlockQuicksort][pdf] paper.
///
/// [pdf]: https://drops.dagstuhl.de/opus/volltexte/2016/6389/pdf/LIPIcs-ESA-2016-38.pdf
fn partition_in_blocks<T, F>(v: &mut [T], pivot: &T, is_less: &F) -> usize
where
    F: Fn(&T, &T) -> bool,
{
    // Number of elements in a typical block.
    const BLOCK: usize = 128;

    // The partitioning algorithm repeats the following steps until completion:
    //
    // 1. Trace a block from the left side to identify elements greater than or equal to the pivot.
    // 2. Trace a block from the right side to identify elements smaller than the pivot.
    // 3. Exchange the identified elements between the left and right side.
    //
    // We keep the following variables for a block of elements:
    //
    // 1. `block` - Number of elements in the block.
    // 2. `start` - Start pointer into the `offsets` array.
    // 3. `end` - End pointer into the `offsets` array.
    // 4. `offsets` - Indices of out-of-order elements within the block.

    // The current block on the left side (from `l` to `l.add(block_l)`).
    let mut l = v.as_mut_ptr();
    let mut block_l = BLOCK;
    let mut start_l = ptr::null_mut();
    let mut end_l = ptr::null_mut();
    let mut offsets_l = [MaybeUninit::<u8>::uninit(); BLOCK];

    // The current block on the right side (from `r.sub(block_r)` to `r`).
    // SAFETY: The documentation for .add() specifically mention that `vec.as_ptr().add(vec.len())` is always safe
    let mut r = unsafe { l.add(v.len()) };
    let mut block_r = BLOCK;
    let mut start_r = ptr::null_mut();
    let mut end_r = ptr::null_mut();
    let mut offsets_r = [MaybeUninit::<u8>::uninit(); BLOCK];

    // FIXME: When we get VLAs, try creating one array of length `min(v.len(), 2 * BLOCK)` rather
    // than two fixed-size arrays of length `BLOCK`. VLAs might be more cache-efficient.

    // Returns the number of elements between pointers `l` (inclusive) and `r` (exclusive).
    fn width<T>(l: *mut T, r: *mut T) -> usize {
        assert!(mem::size_of::<T>() > 0);
        // FIXME: this should *likely* use `offset_from`, but more
        // investigation is needed (including running tests in miri).
        (r as usize - l as usize) / mem::size_of::<T>()
    }

    loop {
        // We are done with partitioning block-by-block when `l` and `r` get very close. Then we do
        // some patch-up work in order to partition the remaining elements in between.
        let is_done = width(l, r) <= 2 * BLOCK;

        if is_done {
            // Number of remaining elements (still not compared to the pivot).
            let mut rem = width(l, r);
            if start_l < end_l || start_r < end_r {
                rem -= BLOCK;
            }

            // Adjust block sizes so that the left and right block don't overlap, but get perfectly
            // aligned to cover the whole remaining gap.
            if start_l < end_l {
                block_r = rem;
            } else if start_r < end_r {
                block_l = rem;
            } else {
                // There were the same number of elements to switch on both blocks during the last
                // iteration, so there are no remaining elements on either block. Cover the remaining
                // items with roughly equally-sized blocks.
                block_l = rem / 2;
                block_r = rem - block_l;
            }
            debug_assert!(block_l <= BLOCK && block_r <= BLOCK);
            debug_assert!(width(l, r) == block_l + block_r);
        }

        if start_l == end_l {
            // Trace `block_l` elements from the left side.
            start_l = offsets_l.as_mut_ptr() as *mut u8;
            end_l = start_l;
            let mut elem = l;

            for i in 0..block_l {
                // SAFETY: The unsafety operations below involve the usage of the `offset`.
                //         According to the conditions required by the function, we satisfy them because:
                //         1. `offsets_l` is stack-allocated, and thus considered separate allocated object.
                //         2. The function `is_less` returns a `bool`.
                //            Casting a `bool` will never overflow `isize`.
                //         3. We have guaranteed that `block_l` will be `<= BLOCK`.
                //            Plus, `end_l` was initially set to the begin pointer of `offsets_` which was declared on the stack.
                //            Thus, we know that even in the worst case (all invocations of `is_less` returns false) we will only be at most 1 byte pass the end.
                //        Another unsafety operation here is dereferencing `elem`.
                //        However, `elem` was initially the begin pointer to the slice which is always valid.
                unsafe {
                    // Branchless comparison.
                    *end_l = i as u8;
                    end_l = end_l.add(!is_less(&*elem, pivot) as usize);
                    elem = elem.add(1);
                }
            }
        }

        if start_r == end_r {
            // Trace `block_r` elements from the right side.
            start_r = offsets_r.as_mut_ptr() as *mut u8;
            end_r = start_r;
            let mut elem = r;

            for i in 0..block_r {
                // SAFETY: The unsafety operations below involve the usage of the `offset`.
                //         According to the conditions required by the function, we satisfy them because:
                //         1. `offsets_r` is stack-allocated, and thus considered separate allocated object.
                //         2. The function `is_less` returns a `bool`.
                //            Casting a `bool` will never overflow `isize`.
                //         3. We have guaranteed that `block_r` will be `<= BLOCK`.
                //            Plus, `end_r` was initially set to the begin pointer of `offsets_` which was declared on the stack.
                //            Thus, we know that even in the worst case (all invocations of `is_less` returns true) we will only be at most 1 byte pass the end.
                //        Another unsafety operation here is dereferencing `elem`.
                //        However, `elem` was initially `1 * sizeof(T)` past the end and we decrement it by `1 * sizeof(T)` before accessing it.
                //        Plus, `block_r` was asserted to be less than `BLOCK` and `elem` will therefore at most be pointing to the beginning of the slice.
                unsafe {
                    // Branchless comparison.
                    elem = elem.sub(1);
                    *end_r = i as u8;
                    end_r = end_r.add(is_less(&*elem, pivot) as usize);
                }
            }
        }

        // Number of out-of-order elements to swap between the left and right side.
        let count = cmp::min(width(start_l, end_l), width(start_r, end_r));

        if count > 0 {
            macro_rules! left {
                () => {
                    l.add(usize::from(*start_l))
                };
            }
            macro_rules! right {
                () => {
                    r.sub(usize::from(*start_r) + 1)
                };
            }

            // Instead of swapping one pair at the time, it is more efficient to perform a cyclic
            // permutation. This is not strictly equivalent to swapping, but produces a similar
            // result using fewer memory operations.

            // SAFETY: The use of `ptr::read` is valid because there is at least one element in
            // both `offsets_l` and `offsets_r`, so `left!` is a valid pointer to read from.
            //
            // The uses of `left!` involve calls to `offset` on `l`, which points to the
            // beginning of `v`. All the offsets pointed-to by `start_l` are at most `block_l`, so
            // these `offset` calls are safe as all reads are within the block. The same argument
            // applies for the uses of `right!`.
            //
            // The calls to `start_l.offset` are valid because there are at most `count-1` of them,
            // plus the final one at the end of the unsafe block, where `count` is the minimum number
            // of collected offsets in `offsets_l` and `offsets_r`, so there is no risk of there not
            // being enough elements. The same reasoning applies to the calls to `start_r.offset`.
            //
            // The calls to `copy_nonoverlapping` are safe because `left!` and `right!` are guaranteed
            // not to overlap, and are valid because of the reasoning above.
            unsafe {
                let tmp = ptr::read(left!());
                ptr::copy_nonoverlapping(right!(), left!(), 1);

                for _ in 1..count {
                    start_l = start_l.add(1);
                    ptr::copy_nonoverlapping(left!(), right!(), 1);
                    start_r = start_r.add(1);
                    ptr::copy_nonoverlapping(right!(), left!(), 1);
                }

                ptr::copy_nonoverlapping(&tmp, right!(), 1);
                mem::forget(tmp);
                start_l = start_l.add(1);
                start_r = start_r.add(1);
            }
        }

        if start_l == end_l {
            // All out-of-order elements in the left block were moved. Move to the next block.

            // block-width-guarantee
            // SAFETY: if `!is_done` then the slice width is guaranteed to be at least `2*BLOCK` wide. There
            // are at most `BLOCK` elements in `offsets_l` because of its size, so the `offset` operation is
            // safe. Otherwise, the debug assertions in the `is_done` case guarantee that
            // `width(l, r) == block_l + block_r`, namely, that the block sizes have been adjusted to account
            // for the smaller number of remaining elements.
            l = unsafe { l.add(block_l) };
        }

        if start_r == end_r {
            // All out-of-order elements in the right block were moved. Move to the previous block.

            // SAFETY: Same argument as [block-width-guarantee]. Either this is a full block `2*BLOCK`-wide,
            // or `block_r` has been adjusted for the last handful of elements.
            r = unsafe { r.sub(block_r) };
        }

        if is_done {
            break;
        }
    }

    // All that remains now is at most one block (either the left or the right) with out-of-order
    // elements that need to be moved. Such remaining elements can be simply shifted to the end
    // within their block.

    if start_l < end_l {
        // The left block remains.
        // Move its remaining out-of-order elements to the far right.
        debug_assert_eq!(width(l, r), block_l);
        while start_l < end_l {
            // remaining-elements-safety
            // SAFETY: while the loop condition holds there are still elements in `offsets_l`, so it
            // is safe to point `end_l` to the previous element.
            //
            // The `ptr::swap` is safe if both its arguments are valid for reads and writes:
            //  - Per the debug assert above, the distance between `l` and `r` is `block_l`
            //    elements, so there can be at most `block_l` remaining offsets between `start_l`
            //    and `end_l`. This means `r` will be moved at most `block_l` steps back, which
            //    makes the `r.offset` calls valid (at that point `l == r`).
            //  - `offsets_l` contains valid offsets into `v` collected during the partitioning of
            //    the last block, so the `l.offset` calls are valid.
            unsafe {
                end_l = end_l.sub(1);
                ptr::swap(l.add(usize::from(*end_l)), r.sub(1));
                r = r.sub(1);
            }
        }
        width(v.as_mut_ptr(), r)
    } else if start_r < end_r {
        // The right block remains.
        // Move its remaining out-of-order elements to the far left.
        debug_assert_eq!(width(l, r), block_r);
        while start_r < end_r {
            // SAFETY: See the reasoning in [remaining-elements-safety].
            unsafe {
                end_r = end_r.sub(1);
                ptr::swap(l, r.sub(usize::from(*end_r) + 1));
                l = l.add(1);
            }
        }
        width(v.as_mut_ptr(), l)
    } else {
        // Nothing else to do, we're done.
        width(v.as_mut_ptr(), l)
    }
}

/// Partitions `v` into elements smaller than `v[pivot]`, followed by elements greater than or
/// equal to `v[pivot]`.
///
/// Returns a tuple of:
///
/// 1. Number of elements smaller than `v[pivot]`.
/// 2. True if `v` was already partitioned.
fn partition<T, F>(v: &mut [T], pivot: usize, is_less: &F) -> (usize, bool)
where
    F: Fn(&T, &T) -> bool,
{
    let (mid, was_partitioned) = {
        // Place the pivot at the beginning of slice.
        v.swap(0, pivot);
        let (pivot, v) = v.split_at_mut(1);
        let pivot = &mut pivot[0];

        // Read the pivot into a stack-allocated variable for efficiency. If a following comparison
        // operation panics, the pivot will be automatically written back into the slice.

        // SAFETY: `pivot` is a reference to the first element of `v`, so `ptr::read` is safe.
        let tmp = mem::ManuallyDrop::new(unsafe { ptr::read(pivot) });
        let _pivot_guard = InsertionHole {
            src: &*tmp,
            dest: pivot,
        };
        let pivot = &*tmp;

        // Find the first pair of out-of-order elements.
        let mut l = 0;
        let mut r = v.len();

        // SAFETY: The unsafety below involves indexing an array.
        // For the first one: We already do the bounds checking here with `l < r`.
        // For the second one: We initially have `l == 0` and `r == v.len()` and we checked that `l < r` at every indexing operation.
        //                     From here we know that `r` must be at least `r == l` which was shown to be valid from the first one.
        unsafe {
            // Find the first element greater than or equal to the pivot.
            while l < r && is_less(v.get_unchecked(l), pivot) {
                l += 1;
            }

            // Find the last element smaller that the pivot.
            while l < r && !is_less(v.get_unchecked(r - 1), pivot) {
                r -= 1;
            }
        }

        (
            l + partition_in_blocks(&mut v[l..r], pivot, is_less),
            l >= r,
        )

        // `_pivot_guard` goes out of scope and writes the pivot (which is a stack-allocated
        // variable) back into the slice where it originally was. This step is critical in ensuring
        // safety!
    };

    // Place the pivot between the two partitions.
    v.swap(0, mid);

    (mid, was_partitioned)
}

/// Partitions `v` into elements equal to `v[pivot]` followed by elements greater than `v[pivot]`.
///
/// Returns the number of elements equal to the pivot. It is assumed that `v` does not contain
/// elements smaller than the pivot.
fn partition_equal<T, F>(v: &mut [T], pivot: usize, is_less: &F) -> usize
where
    F: Fn(&T, &T) -> bool,
{
    // Place the pivot at the beginning of slice.
    v.swap(0, pivot);
    let (pivot, v) = v.split_at_mut(1);
    let pivot = &mut pivot[0];

    // Read the pivot into a stack-allocated variable for efficiency. If a following comparison
    // operation panics, the pivot will be automatically written back into the slice.
    // SAFETY: The pointer here is valid because it is obtained from a reference to a slice.
    let tmp = mem::ManuallyDrop::new(unsafe { ptr::read(pivot) });
    let _pivot_guard = InsertionHole {
        src: &*tmp,
        dest: pivot,
    };
    let pivot = &*tmp;

    let len = v.len();
    if len == 0 {
        return 0;
    }

    // Now partition the slice.
    let mut l = 0;
    let mut r = len;
    loop {
        // SAFETY: The unsafety below involves indexing an array.
        // For the first one: We already do the bounds checking here with `l < r`.
        // For the second one: We initially have `l == 0` and `r == v.len()` and we checked that `l < r` at every indexing operation.
        //                     From here we know that `r` must be at least `r == l` which was shown to be valid from the first one.
        unsafe {
            // Find the first element greater than the pivot.
            while l < r && !is_less(pivot, v.get_unchecked(l)) {
                l += 1;
            }

            // Find the last element equal to the pivot.
            loop {
                r -= 1;
                if l >= r || !is_less(pivot, v.get_unchecked(r)) {
                    break;
                }
            }

            // Are we done?
            if l >= r {
                break;
            }

            // Swap the found pair of out-of-order elements.
            let ptr = v.as_mut_ptr();
            ptr::swap(ptr.add(l), ptr.add(r));
            l += 1;
        }
    }

    // We found `l` elements equal to the pivot. Add 1 to account for the pivot itself.
    l + 1

    // `_pivot_guard` goes out of scope and writes the pivot (which is a stack-allocated variable)
    // back into the slice where it originally was. This step is critical in ensuring safety!
}

/// Scatters some elements around in an attempt to break patterns that might cause imbalanced
/// partitions in quicksort.
#[cold]
fn break_patterns<T>(v: &mut [T]) {
    let len = v.len();
    if len >= 8 {
        let mut seed = len;
        let mut gen_usize = || {
            // Pseudorandom number generator from the "Xorshift RNGs" paper by George Marsaglia.
            if usize::BITS <= 32 {
                let mut r = seed as u32;
                r ^= r << 13;
                r ^= r >> 17;
                r ^= r << 5;
                seed = r as usize;
                seed
            } else {
                let mut r = seed as u64;
                r ^= r << 13;
                r ^= r >> 7;
                r ^= r << 17;
                seed = r as usize;
                seed
            }
        };

        // Take random numbers modulo this number.
        // The number fits into `usize` because `len` is not greater than `isize::MAX`.
        let modulus = len.next_power_of_two();

        // Some pivot candidates will be in the nearby of this index. Let's randomize them.
        let pos = len / 4 * 2;

        for i in 0..3 {
            // Generate a random number modulo `len`. However, in order to avoid costly operations
            // we first take it modulo a power of two, and then decrease by `len` until it fits
            // into the range `[0, len - 1]`.
            let mut other = gen_usize() & (modulus - 1);

            // `other` is guaranteed to be less than `2 * len`.
            if other >= len {
                other -= len;
            }

            v.swap(pos - 1 + i, other);
        }
    }
}

/// Chooses a pivot in `v` and returns the index and `true` if the slice is likely already sorted.
///
/// Elements in `v` might be reordered in the process.
fn choose_pivot<T, F>(v: &mut [T], is_less: &F) -> (usize, bool)
where
    F: Fn(&T, &T) -> bool,
{
    // Minimum length to choose the median-of-medians method.
    // Shorter slices use the simple median-of-three method.
    const SHORTEST_MEDIAN_OF_MEDIANS: usize = 50;
    // Maximum number of swaps that can be performed in this function.
    const MAX_SWAPS: usize = 4 * 3;

    let len = v.len();

    // Three indices near which we are going to choose a pivot.
    #[allow(clippy::identity_op)]
    let mut a = len / 4 * 1;
    let mut b = len / 4 * 2;
    let mut c = len / 4 * 3;

    // Counts the total number of swaps we are about to perform while sorting indices.
    let mut swaps = 0;

    if len >= 8 {
        // Swaps indices so that `v[a] <= v[b]`.
        // SAFETY: `len >= 8` so there are at least two elements in the neighborhoods of
        // `a`, `b` and `c`. This means the three calls to `sort_adjacent` result in
        // corresponding calls to `sort3` with valid 3-item neighborhoods around each
        // pointer, which in turn means the calls to `sort2` are done with valid
        // references. Thus the `v.get_unchecked` calls are safe, as is the `ptr::swap`
        // call.
        let mut sort2 = |a: &mut usize, b: &mut usize| unsafe {
            if is_less(v.get_unchecked(*b), v.get_unchecked(*a)) {
                ptr::swap(a, b);
                swaps += 1;
            }
        };

        // Swaps indices so that `v[a] <= v[b] <= v[c]`.
        let mut sort3 = |a: &mut usize, b: &mut usize, c: &mut usize| {
            sort2(a, b);
            sort2(b, c);
            sort2(a, b);
        };

        if len >= SHORTEST_MEDIAN_OF_MEDIANS {
            // Finds the median of `v[a - 1], v[a], v[a + 1]` and stores the index into `a`.
            let mut sort_adjacent = |a: &mut usize| {
                let tmp = *a;
                sort3(&mut (tmp - 1), a, &mut (tmp + 1));
            };

            // Find medians in the neighborhoods of `a`, `b`, and `c`.
            sort_adjacent(&mut a);
            sort_adjacent(&mut b);
            sort_adjacent(&mut c);
        }

        // Find the median among `a`, `b`, and `c`.
        sort3(&mut a, &mut b, &mut c);
    }

    if swaps < MAX_SWAPS {
        (b, swaps == 0)
    } else {
        // The maximum number of swaps was performed. Chances are the slice is descending or mostly
        // descending, so reversing will probably help sort it faster.
        v.reverse();
        (len - 1 - b, true)
    }
}

/// Sorts `v` recursively.
///
/// If the slice had a predecessor in the original array, it is specified as `pred`.
///
/// `limit` is the number of allowed imbalanced partitions before switching to `heapsort`. If zero,
/// this function will immediately switch to heapsort.
fn recurse<'a, T, F>(mut v: &'a mut [T], is_less: &F, mut pred: Option<&'a mut T>, mut limit: u32)
where
    T: Send,
    F: Fn(&T, &T) -> bool + Sync,
{
    // Slices of up to this length get sorted using insertion sort.
    const MAX_INSERTION: usize = 20;

    // If both partitions are up to this length, we continue sequentially. This number is as small
    // as possible but so that the overhead of Rayon's task scheduling is still negligible.
    const MAX_SEQUENTIAL: usize = 2000;

    // True if the last partitioning was reasonably balanced.
    let mut was_balanced = true;
    // True if the last partitioning didn't shuffle elements (the slice was already partitioned).
    let mut was_partitioned = true;

    loop {
        let len = v.len();

        // Very short slices get sorted using insertion sort.
        if len <= MAX_INSERTION {
            if len >= 2 {
                insertion_sort_shift_left(v, 1, is_less);
            }
            return;
        }

        // If too many bad pivot choices were made, simply fall back to heapsort in order to
        // guarantee `O(n * log(n))` worst-case.
        if limit == 0 {
            heapsort(v, is_less);
            return;
        }

        // If the last partitioning was imbalanced, try breaking patterns in the slice by shuffling
        // some elements around. Hopefully we'll choose a better pivot this time.
        if !was_balanced {
            break_patterns(v);
            limit -= 1;
        }

        // Choose a pivot and try guessing whether the slice is already sorted.
        let (pivot, likely_sorted) = choose_pivot(v, is_less);

        // If the last partitioning was decently balanced and didn't shuffle elements, and if pivot
        // selection predicts the slice is likely already sorted...
        if was_balanced && was_partitioned && likely_sorted {
            // Try identifying several out-of-order elements and shifting them to correct
            // positions. If the slice ends up being completely sorted, we're done.
            if partial_insertion_sort(v, is_less) {
                return;
            }
        }

        // If the chosen pivot is equal to the predecessor, then it's the smallest element in the
        // slice. Partition the slice into elements equal to and elements greater than the pivot.
        // This case is usually hit when the slice contains many duplicate elements.
        if let Some(&mut ref p) = pred {
            if !is_less(p, &v[pivot]) {
                let mid = partition_equal(v, pivot, is_less);

                // Continue sorting elements greater than the pivot.
                v = &mut v[mid..];
                continue;
            }
        }

        // Partition the slice.
        let (mid, was_p) = partition(v, pivot, is_less);
        was_balanced = cmp::min(mid, len - mid) >= len / 8;
        was_partitioned = was_p;

        // Split the slice into `left`, `pivot`, and `right`.
        let (left, right) = v.split_at_mut(mid);
        let (pivot, right) = right.split_at_mut(1);
        let pivot = &mut pivot[0];

        if Ord::max(left.len(), right.len()) <= MAX_SEQUENTIAL {
            // Recurse into the shorter side only in order to minimize the total number of recursive
            // calls and consume less stack space. Then just continue with the longer side (this is
            // akin to tail recursion).
            if left.len() < right.len() {
                recurse(left, is_less, pred, limit);
                v = right;
                pred = Some(pivot);
            } else {
                recurse(right, is_less, Some(pivot), limit);
                v = left;
            }
        } else {
            // Sort the left and right half in parallel.
            rayon_core::join(
                || recurse(left, is_less, pred, limit),
                || recurse(right, is_less, Some(pivot), limit),
            );
            break;
        }
    }
}

/// Sorts `v` using pattern-defeating quicksort in parallel.
///
/// The algorithm is unstable, in-place, and *O*(*n* \* log(*n*)) worst-case.
pub(super) fn par_quicksort<T, F>(v: &mut [T], is_less: F)
where
    T: Send,
    F: Fn(&T, &T) -> bool + Sync,
{
    // Sorting has no meaningful behavior on zero-sized types.
    if mem::size_of::<T>() == 0 {
        return;
    }

    // Limit the number of imbalanced partitions to `floor(log2(len)) + 1`.
    let limit = usize::BITS - v.len().leading_zeros();

    recurse(v, &is_less, None, limit);
}

/// Merges non-decreasing runs `v[..mid]` and `v[mid..]` using `buf` as temporary storage, and
/// stores the result into `v[..]`.
///
/// # Safety
///
/// The two slices must be non-empty and `mid` must be in bounds. Buffer `buf` must be long enough
/// to hold a copy of the shorter slice. Also, `T` must not be a zero-sized type.
unsafe fn merge<T, F>(v: &mut [T], mid: usize, buf: *mut T, is_less: &F)
where
    F: Fn(&T, &T) -> bool,
{
    let len = v.len();
    let v = v.as_mut_ptr();

    // SAFETY: mid and len must be in-bounds of v.
    let (v_mid, v_end) = unsafe { (v.add(mid), v.add(len)) };

    // The merge process first copies the shorter run into `buf`. Then it traces the newly copied
    // run and the longer run forwards (or backwards), comparing their next unconsumed elements and
    // copying the lesser (or greater) one into `v`.
    //
    // As soon as the shorter run is fully consumed, the process is done. If the longer run gets
    // consumed first, then we must copy whatever is left of the shorter run into the remaining
    // hole in `v`.
    //
    // Intermediate state of the process is always tracked by `hole`, which serves two purposes:
    // 1. Protects integrity of `v` from panics in `is_less`.
    // 2. Fills the remaining hole in `v` if the longer run gets consumed first.
    //
    // Panic safety:
    //
    // If `is_less` panics at any point during the process, `hole` will get dropped and fill the
    // hole in `v` with the unconsumed range in `buf`, thus ensuring that `v` still holds every
    // object it initially held exactly once.
    let mut hole;

    if mid <= len - mid {
        // The left run is shorter.

        // SAFETY: buf must have enough capacity for `v[..mid]`.
        unsafe {
            ptr::copy_nonoverlapping(v, buf, mid);
            hole = MergeHole {
                start: buf,
                end: buf.add(mid),
                dest: v,
            };
        }

        // Initially, these pointers point to the beginnings of their arrays.
        let left = &mut hole.start;
        let mut right = v_mid;
        let out = &mut hole.dest;

        while *left < hole.end && right < v_end {
            // Consume the lesser side.
            // If equal, prefer the left run to maintain stability.

            // SAFETY: left and right must be valid and part of v same for out.
            unsafe {
                let is_l = is_less(&*right, &**left);
                let to_copy = if is_l { right } else { *left };
                ptr::copy_nonoverlapping(to_copy, *out, 1);
                *out = out.add(1);
                right = right.add(is_l as usize);
                *left = left.add(!is_l as usize);
            }
        }
    } else {
        // The right run is shorter.

        // SAFETY: buf must have enough capacity for `v[mid..]`.
        unsafe {
            ptr::copy_nonoverlapping(v_mid, buf, len - mid);
            hole = MergeHole {
                start: buf,
                end: buf.add(len - mid),
                dest: v_mid,
            };
        }

        // Initially, these pointers point past the ends of their arrays.
        let left = &mut hole.dest;
        let right = &mut hole.end;
        let mut out = v_end;

        while v < *left && buf < *right {
            // Consume the greater side.
            // If equal, prefer the right run to maintain stability.

            // SAFETY: left and right must be valid and part of v same for out.
            unsafe {
                let is_l = is_less(&*right.sub(1), &*left.sub(1));
                *left = left.sub(is_l as usize);
                *right = right.sub(!is_l as usize);
                let to_copy = if is_l { *left } else { *right };
                out = out.sub(1);
                ptr::copy_nonoverlapping(to_copy, out, 1);
            }
        }
    }
    // Finally, `hole` gets dropped. If the shorter run was not fully consumed, whatever remains of
    // it will now be copied into the hole in `v`.
}

// When dropped, copies the range `start..end` into `dest..`.
struct MergeHole<T> {
    start: *mut T,
    end: *mut T,
    dest: *mut T,
}

impl<T> Drop for MergeHole<T> {
    fn drop(&mut self) {
        // SAFETY: `T` is not a zero-sized type, and these are pointers into a slice's elements.
        unsafe {
            let len = self.end.offset_from(self.start) as usize;
            ptr::copy_nonoverlapping(self.start, self.dest, len);
        }
    }
}

/// The result of merge sort.
#[must_use]
#[derive(Clone, Copy, PartialEq, Eq)]
enum MergeSortResult {
    /// The slice has already been sorted.
    NonDescending,
    /// The slice has been descending and therefore it was left intact.
    Descending,
    /// The slice was sorted.
    Sorted,
}

/// This merge sort borrows some (but not all) ideas from TimSort, which used to be described in
/// detail [here](https://github.com/python/cpython/blob/main/Objects/listsort.txt). However Python
/// has switched to a Powersort based implementation.
///
/// The algorithm identifies strictly descending and non-descending subsequences, which are called
/// natural runs. There is a stack of pending runs yet to be merged. Each newly found run is pushed
/// onto the stack, and then some pairs of adjacent runs are merged until these two invariants are
/// satisfied:
///
/// 1. for every `i` in `1..runs.len()`: `runs[i - 1].len > runs[i].len`
/// 2. for every `i` in `2..runs.len()`: `runs[i - 2].len > runs[i - 1].len + runs[i].len`
///
/// The invariants ensure that the total running time is *O*(*n* \* log(*n*)) worst-case.
///
/// # Safety
///
/// The argument `buf` is used as a temporary buffer and must hold at least `v.len() / 2`.
unsafe fn merge_sort<T, CmpF>(v: &mut [T], buf_ptr: *mut T, is_less: &CmpF) -> MergeSortResult
where
    CmpF: Fn(&T, &T) -> bool,
{
    // The caller should have already checked that.
    debug_assert_ne!(mem::size_of::<T>(), 0);

    let len = v.len();

    let mut runs = Vec::new();

    let mut end = 0;
    let mut start = 0;

    // Scan forward. Memory pre-fetching prefers forward scanning vs backwards scanning, and the
    // code-gen is usually better. For the most sensitive types such as integers, these are merged
    // bidirectionally at once. So there is no benefit in scanning backwards.
    while end < len {
        let (streak_end, was_reversed) = find_streak(&v[start..], is_less);
        end += streak_end;
        if start == 0 && end == len {
            return if was_reversed {
                MergeSortResult::Descending
            } else {
                MergeSortResult::NonDescending
            };
        }
        if was_reversed {
            v[start..end].reverse();
        }

        // Insert some more elements into the run if it's too short. Insertion sort is faster than
        // merge sort on short sequences, so this significantly improves performance.
        end = provide_sorted_batch(v, start, end, is_less);

        // Push this run onto the stack.
        runs.push(TimSortRun {
            start,
            len: end - start,
        });
        start = end;

        // Merge some pairs of adjacent runs to satisfy the invariants.
        while let Some(r) = collapse(runs.as_slice(), len) {
            let left = runs[r];
            let right = runs[r + 1];
            let merge_slice = &mut v[left.start..right.start + right.len];
            // SAFETY: `buf_ptr` must hold enough capacity for the shorter of the two sides, and
            // neither side may be on length 0.
            unsafe {
                merge(merge_slice, left.len, buf_ptr, is_less);
            }
            runs[r + 1] = TimSortRun {
                start: left.start,
                len: left.len + right.len,
            };
            runs.remove(r);
        }
    }

    // Finally, exactly one run must remain in the stack.
    debug_assert!(runs.len() == 1 && runs[0].start == 0 && runs[0].len == len);

    // The original order of the slice was neither non-descending nor descending.
    return MergeSortResult::Sorted;

    // Examines the stack of runs and identifies the next pair of runs to merge. More specifically,
    // if `Some(r)` is returned, that means `runs[r]` and `runs[r + 1]` must be merged next. If the
    // algorithm should continue building a new run instead, `None` is returned.
    //
    // TimSort is infamous for its buggy implementations, as described here:
    // http://envisage-project.eu/timsort-specification-and-verification/
    //
    // The gist of the story is: we must enforce the invariants on the top four runs on the stack.
    // Enforcing them on just top three is not sufficient to ensure that the invariants will still
    // hold for *all* runs in the stack.
    //
    // This function correctly checks invariants for the top four runs. Additionally, if the top
    // run starts at index 0, it will always demand a merge operation until the stack is fully
    // collapsed, in order to complete the sort.
    #[inline]
    fn collapse(runs: &[TimSortRun], stop: usize) -> Option<usize> {
        let n = runs.len();
        if n >= 2
            && (runs[n - 1].start + runs[n - 1].len == stop
                || runs[n - 2].len <= runs[n - 1].len
                || (n >= 3 && runs[n - 3].len <= runs[n - 2].len + runs[n - 1].len)
                || (n >= 4 && runs[n - 4].len <= runs[n - 3].len + runs[n - 2].len))
        {
            if n >= 3 && runs[n - 3].len < runs[n - 1].len {
                Some(n - 3)
            } else {
                Some(n - 2)
            }
        } else {
            None
        }
    }
}

/// Internal type used by merge_sort.
#[derive(Clone, Copy, Debug)]
struct TimSortRun {
    len: usize,
    start: usize,
}

/// Takes a range as denoted by start and end, that is already sorted and extends it to the right if
/// necessary with sorts optimized for smaller ranges such as insertion sort.
fn provide_sorted_batch<T, F>(v: &mut [T], start: usize, mut end: usize, is_less: &F) -> usize
where
    F: Fn(&T, &T) -> bool,
{
    let len = v.len();
    assert!(end >= start && end <= len);

    // This value is a balance between least comparisons and best performance, as
    // influenced by for example cache locality.
    const MIN_INSERTION_RUN: usize = 10;

    // Insert some more elements into the run if it's too short. Insertion sort is faster than
    // merge sort on short sequences, so this significantly improves performance.
    let start_end_diff = end - start;

    if start_end_diff < MIN_INSERTION_RUN && end < len {
        // v[start_found..end] are elements that are already sorted in the input. We want to extend
        // the sorted region to the left, so we push up MIN_INSERTION_RUN - 1 to the right. Which is
        // more efficient that trying to push those already sorted elements to the left.
        end = cmp::min(start + MIN_INSERTION_RUN, len);
        let presorted_start = cmp::max(start_end_diff, 1);

        insertion_sort_shift_left(&mut v[start..end], presorted_start, is_less);
    }

    end
}

/// Finds a streak of presorted elements starting at the beginning of the slice. Returns the first
/// value that is not part of said streak, and a bool denoting whether the streak was reversed.
/// Streaks can be increasing or decreasing.
fn find_streak<T, F>(v: &[T], is_less: &F) -> (usize, bool)
where
    F: Fn(&T, &T) -> bool,
{
    let len = v.len();

    if len < 2 {
        return (len, false);
    }

    let mut end = 2;

    // SAFETY: See below specific.
    unsafe {
        // SAFETY: We checked that len >= 2, so 0 and 1 are valid indices.
        let assume_reverse = is_less(v.get_unchecked(1), v.get_unchecked(0));

        // SAFETY: We know end >= 2 and check end < len.
        // From that follows that accessing v at end and end - 1 is safe.
        if assume_reverse {
            while end < len && is_less(v.get_unchecked(end), v.get_unchecked(end - 1)) {
                end += 1;
            }

            (end, true)
        } else {
            while end < len && !is_less(v.get_unchecked(end), v.get_unchecked(end - 1)) {
                end += 1;
            }
            (end, false)
        }
    }
}

////////////////////////////////////////////////////////////////////////////
// Everything above this line is copied from `core::slice::sort` (with very minor tweaks).
// Everything below this line is custom parallelization for rayon.
////////////////////////////////////////////////////////////////////////////

/// Splits two sorted slices so that they can be merged in parallel.
///
/// Returns two indices `(a, b)` so that slices `left[..a]` and `right[..b]` come before
/// `left[a..]` and `right[b..]`.
fn split_for_merge<T, F>(left: &[T], right: &[T], is_less: &F) -> (usize, usize)
where
    F: Fn(&T, &T) -> bool,
{
    let left_len = left.len();
    let right_len = right.len();

    if left_len >= right_len {
        let left_mid = left_len / 2;

        // Find the first element in `right` that is greater than or equal to `left[left_mid]`.
        let mut a = 0;
        let mut b = right_len;
        while a < b {
            let m = a + (b - a) / 2;
            if is_less(&right[m], &left[left_mid]) {
                a = m + 1;
            } else {
                b = m;
            }
        }

        (left_mid, a)
    } else {
        let right_mid = right_len / 2;

        // Find the first element in `left` that is greater than `right[right_mid]`.
        let mut a = 0;
        let mut b = left_len;
        while a < b {
            let m = a + (b - a) / 2;
            if is_less(&right[right_mid], &left[m]) {
                b = m;
            } else {
                a = m + 1;
            }
        }

        (a, right_mid)
    }
}

/// Merges slices `left` and `right` in parallel and stores the result into `dest`.
///
/// # Safety
///
/// The `dest` pointer must have enough space to store the result.
///
/// Even if `is_less` panics at any point during the merge process, this function will fully copy
/// all elements from `left` and `right` into `dest` (not necessarily in sorted order).
unsafe fn par_merge<T, F>(left: &mut [T], right: &mut [T], dest: *mut T, is_less: &F)
where
    T: Send,
    F: Fn(&T, &T) -> bool + Sync,
{
    // Slices whose lengths sum up to this value are merged sequentially. This number is slightly
    // larger than `CHUNK_LENGTH`, and the reason is that merging is faster than merge sorting, so
    // merging needs a bit coarser granularity in order to hide the overhead of Rayon's task
    // scheduling.
    const MAX_SEQUENTIAL: usize = 5000;

    let left_len = left.len();
    let right_len = right.len();

    // Intermediate state of the merge process, which serves two purposes:
    // 1. Protects integrity of `dest` from panics in `is_less`.
    // 2. Copies the remaining elements as soon as one of the two sides is exhausted.
    //
    // Panic safety:
    //
    // If `is_less` panics at any point during the merge process, `s` will get dropped and copy the
    // remaining parts of `left` and `right` into `dest`.
    let mut s = State {
        left_start: left.as_mut_ptr(),
        left_end: left.as_mut_ptr().add(left_len),
        right_start: right.as_mut_ptr(),
        right_end: right.as_mut_ptr().add(right_len),
        dest,
    };

    if left_len == 0 || right_len == 0 || left_len + right_len < MAX_SEQUENTIAL {
        while s.left_start < s.left_end && s.right_start < s.right_end {
            // Consume the lesser side.
            // If equal, prefer the left run to maintain stability.
            let is_l = is_less(&*s.right_start, &*s.left_start);
            let to_copy = if is_l { s.right_start } else { s.left_start };
            ptr::copy_nonoverlapping(to_copy, s.dest, 1);
            s.dest = s.dest.add(1);
            s.right_start = s.right_start.add(is_l as usize);
            s.left_start = s.left_start.add(!is_l as usize);
        }
    } else {
        // Function `split_for_merge` might panic. If that happens, `s` will get destructed and copy
        // the whole `left` and `right` into `dest`.
        let (left_mid, right_mid) = split_for_merge(left, right, is_less);
        let (left_l, left_r) = left.split_at_mut(left_mid);
        let (right_l, right_r) = right.split_at_mut(right_mid);

        // Prevent the destructor of `s` from running. Rayon will ensure that both calls to
        // `par_merge` happen. If one of the two calls panics, they will ensure that elements still
        // get copied into `dest_left` and `dest_right``.
        mem::forget(s);

        // Wrap pointers in SendPtr so that they can be sent to another thread
        // See the documentation of SendPtr for a full explanation
        let dest_l = SendPtr(dest);
        let dest_r = SendPtr(dest.add(left_l.len() + right_l.len()));
        rayon_core::join(
            move || par_merge(left_l, right_l, dest_l.get(), is_less),
            move || par_merge(left_r, right_r, dest_r.get(), is_less),
        );
    }
    // Finally, `s` gets dropped if we used sequential merge, thus copying the remaining elements
    // all at once.

    // When dropped, copies arrays `left_start..left_end` and `right_start..right_end` into `dest`,
    // in that order.
    struct State<T> {
        left_start: *mut T,
        left_end: *mut T,
        right_start: *mut T,
        right_end: *mut T,
        dest: *mut T,
    }

    impl<T> Drop for State<T> {
        fn drop(&mut self) {
            // Copy array `left`, followed by `right`.
            unsafe {
                let left_len = self.left_end.offset_from(self.left_start) as usize;
                ptr::copy_nonoverlapping(self.left_start, self.dest, left_len);
                self.dest = self.dest.add(left_len);

                let right_len = self.right_end.offset_from(self.right_start) as usize;
                ptr::copy_nonoverlapping(self.right_start, self.dest, right_len);
            }
        }
    }
}

/// Recursively merges pre-sorted chunks inside `v`.
///
/// Chunks of `v` are stored in `chunks` as intervals (inclusive left and exclusive right bound).
/// Argument `buf` is an auxiliary buffer that will be used during the procedure.
/// If `into_buf` is true, the result will be stored into `buf`, otherwise it will be in `v`.
///
/// # Safety
///
/// The number of chunks must be positive and they must be adjacent: the right bound of each chunk
/// must equal the left bound of the following chunk.
///
/// The buffer must be at least as long as `v`.
unsafe fn merge_recurse<T, F>(
    v: *mut T,
    buf: *mut T,
    chunks: &[(usize, usize)],
    into_buf: bool,
    is_less: &F,
) where
    T: Send,
    F: Fn(&T, &T) -> bool + Sync,
{
    let len = chunks.len();
    debug_assert!(len > 0);

    // Base case of the algorithm.
    // If only one chunk is remaining, there's no more work to split and merge.
    if len == 1 {
        if into_buf {
            // Copy the chunk from `v` into `buf`.
            let (start, end) = chunks[0];
            let src = v.add(start);
            let dest = buf.add(start);
            ptr::copy_nonoverlapping(src, dest, end - start);
        }
        return;
    }

    // Split the chunks into two halves.
    let (start, _) = chunks[0];
    let (mid, _) = chunks[len / 2];
    let (_, end) = chunks[len - 1];
    let (left, right) = chunks.split_at(len / 2);

    // After recursive calls finish we'll have to merge chunks `(start, mid)` and `(mid, end)` from
    // `src` into `dest`. If the current invocation has to store the result into `buf`, we'll
    // merge chunks from `v` into `buf`, and vice versa.
    //
    // Recursive calls flip `into_buf` at each level of recursion. More concretely, `par_merge`
    // merges chunks from `buf` into `v` at the first level, from `v` into `buf` at the second
    // level etc.
    let (src, dest) = if into_buf { (v, buf) } else { (buf, v) };

    // Panic safety:
    //
    // If `is_less` panics at any point during the recursive calls, the destructor of `guard` will
    // be executed, thus copying everything from `src` into `dest`. This way we ensure that all
    // chunks are in fact copied into `dest`, even if the merge process doesn't finish.
    let guard = MergeHole {
        start: src.add(start),
        end: src.add(end),
        dest: dest.add(start),
    };

    // Wrap pointers in SendPtr so that they can be sent to another thread
    // See the documentation of SendPtr for a full explanation
    let v = SendPtr(v);
    let buf = SendPtr(buf);
    rayon_core::join(
        move || merge_recurse(v.get(), buf.get(), left, !into_buf, is_less),
        move || merge_recurse(v.get(), buf.get(), right, !into_buf, is_less),
    );

    // Everything went all right - recursive calls didn't panic.
    // Forget the guard in order to prevent its destructor from running.
    mem::forget(guard);

    // Merge chunks `(start, mid)` and `(mid, end)` from `src` into `dest`.
    let src_left = slice::from_raw_parts_mut(src.add(start), mid - start);
    let src_right = slice::from_raw_parts_mut(src.add(mid), end - mid);
    par_merge(src_left, src_right, dest.add(start), is_less);
}

/// Sorts `v` using merge sort in parallel.
///
/// The algorithm is stable, allocates memory, and `O(n log n)` worst-case.
/// The allocated temporary buffer is of the same length as is `v`.
pub(super) fn par_mergesort<T, F>(v: &mut [T], is_less: F)
where
    T: Send,
    F: Fn(&T, &T) -> bool + Sync,
{
    // Slices of up to this length get sorted using insertion sort in order to avoid the cost of
    // buffer allocation.
    const MAX_INSERTION: usize = 20;

    // The length of initial chunks. This number is as small as possible but so that the overhead
    // of Rayon's task scheduling is still negligible.
    const CHUNK_LENGTH: usize = 2000;

    // Sorting has no meaningful behavior on zero-sized types.
    if mem::size_of::<T>() == 0 {
        return;
    }

    let len = v.len();

    // Short slices get sorted in-place via insertion sort to avoid allocations.
    if len <= MAX_INSERTION {
        if len >= 2 {
            insertion_sort_shift_left(v, 1, &is_less);
        }
        return;
    }

    // Allocate a buffer to use as scratch memory. We keep the length 0 so we can keep in it
    // shallow copies of the contents of `v` without risking the dtors running on copies if
    // `is_less` panics.
    let mut buf = Vec::<T>::with_capacity(len);
    let buf = buf.as_mut_ptr();

    // If the slice is not longer than one chunk would be, do sequential merge sort and return.
    if len <= CHUNK_LENGTH {
        let res = unsafe { merge_sort(v, buf, &is_less) };
        if res == MergeSortResult::Descending {
            v.reverse();
        }
        return;
    }

    // Split the slice into chunks and merge sort them in parallel.
    // However, descending chunks will not be sorted - they will be simply left intact.
    let mut iter = {
        // Wrap pointer in SendPtr so that it can be sent to another thread
        // See the documentation of SendPtr for a full explanation
        let buf = SendPtr(buf);
        let is_less = &is_less;

        v.par_chunks_mut(CHUNK_LENGTH)
            .with_max_len(1)
            .enumerate()
            .map(move |(i, chunk)| {
                let l = CHUNK_LENGTH * i;
                let r = l + chunk.len();
                unsafe {
                    let buf = buf.get().add(l);
                    (l, r, merge_sort(chunk, buf, is_less))
                }
            })
            .collect::<Vec<_>>()
            .into_iter()
            .peekable()
    };

    // Now attempt to concatenate adjacent chunks that were left intact.
    let mut chunks = Vec::with_capacity(iter.len());

    while let Some((a, mut b, res)) = iter.next() {
        // If this chunk was not modified by the sort procedure...
        if res != MergeSortResult::Sorted {
            while let Some(&(x, y, r)) = iter.peek() {
                // If the following chunk is of the same type and can be concatenated...
                if r == res && (r == MergeSortResult::Descending) == is_less(&v[x], &v[x - 1]) {
                    // Concatenate them.
                    b = y;
                    iter.next();
                } else {
                    break;
                }
            }
        }

        // Descending chunks must be reversed.
        if res == MergeSortResult::Descending {
            v[a..b].reverse();
        }

        chunks.push((a, b));
    }

    // All chunks are properly sorted.
    // Now we just have to merge them together.
    unsafe {
        merge_recurse(v.as_mut_ptr(), buf, &chunks, false, &is_less);
    }
}

#[cfg(test)]
mod tests {
    use super::heapsort;
    use super::split_for_merge;
    use rand::distributions::Uniform;
    use rand::{thread_rng, Rng};

    #[test]
    fn test_heapsort() {
        let rng = &mut thread_rng();

        for len in (0..25).chain(500..501) {
            for &modulus in &[5, 10, 100] {
                let dist = Uniform::new(0, modulus);
                for _ in 0..100 {
                    let v: Vec<i32> = rng.sample_iter(&dist).take(len).collect();

                    // Test heapsort using `<` operator.
                    let mut tmp = v.clone();
                    heapsort(&mut tmp, |a, b| a < b);
                    assert!(tmp.windows(2).all(|w| w[0] <= w[1]));

                    // Test heapsort using `>` operator.
                    let mut tmp = v.clone();
                    heapsort(&mut tmp, |a, b| a > b);
                    assert!(tmp.windows(2).all(|w| w[0] >= w[1]));
                }
            }
        }

        // Sort using a completely random comparison function.
        // This will reorder the elements *somehow*, but won't panic.
        let mut v: Vec<_> = (0..100).collect();
        heapsort(&mut v, |_, _| thread_rng().gen());
        heapsort(&mut v, |a, b| a < b);

        for (i, &entry) in v.iter().enumerate() {
            assert_eq!(entry, i);
        }
    }

    #[test]
    fn test_split_for_merge() {
        fn check(left: &[u32], right: &[u32]) {
            let (l, r) = split_for_merge(left, right, &|&a, &b| a < b);
            assert!(left[..l]
                .iter()
                .all(|&x| right[r..].iter().all(|&y| x <= y)));
            assert!(right[..r].iter().all(|&x| left[l..].iter().all(|&y| x < y)));
        }

        check(&[1, 2, 2, 2, 2, 3], &[1, 2, 2, 2, 2, 3]);
        check(&[1, 2, 2, 2, 2, 3], &[]);
        check(&[], &[1, 2, 2, 2, 2, 3]);

        let rng = &mut thread_rng();

        for _ in 0..100 {
            let limit: u32 = rng.gen_range(1..21);
            let left_len: usize = rng.gen_range(0..20);
            let right_len: usize = rng.gen_range(0..20);

            let mut left = rng
                .sample_iter(&Uniform::new(0, limit))
                .take(left_len)
                .collect::<Vec<_>>();
            let mut right = rng
                .sample_iter(&Uniform::new(0, limit))
                .take(right_len)
                .collect::<Vec<_>>();

            left.sort();
            right.sort();
            check(&left, &right);
        }
    }
}
