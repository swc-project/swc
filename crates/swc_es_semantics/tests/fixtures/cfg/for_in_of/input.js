function io(arr, obj) {
  for (const x of arr) {
    if (x) continue;
  }

  for (let k in obj) {
    if (k) break;
  }
}
