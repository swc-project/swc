function sw(x) {
  switch (x) {
    case 0:
      x = x + 1;
    case 1:
      x = x + 2;
      break;
    default:
      x = x + 3;
  }

  return x;
}
