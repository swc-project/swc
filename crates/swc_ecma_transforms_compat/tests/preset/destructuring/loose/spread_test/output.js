function isSorted(ref) {
    let x = ref[0], y = ref[1], wow = ref.slice(2);
    if (!zs.length) return true;
    if (y > x) return isSorted(zs);
    return false;
}
