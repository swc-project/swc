function w(obj) {
  label: {
    with (obj) {
      if (obj.x) break label;
    }
  }

  return 0;
}
