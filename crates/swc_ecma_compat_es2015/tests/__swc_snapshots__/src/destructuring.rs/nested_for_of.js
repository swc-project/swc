for (const ref of Object.entries(o)) {
    let _ref = _sliced_to_array(ref, 2),
        k1 = _ref[0],
        v1 = _ref[1];
    for (const ref of Object.entries(o)) {
        let _ref = _sliced_to_array(ref, 2),
            k2 = _ref[0],
            v2 = _ref[1];
        console.log(k1, v1, k2, v2);
    }
}
