function tf(flag) {
  while (true) {
    try {
      if (flag) break;
      return 1;
    } finally {
      flag = !flag;
      if (flag) continue;
    }
  }

  return 2;
}
