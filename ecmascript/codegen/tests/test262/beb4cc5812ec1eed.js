function* a() {
    ({ [yield]: a  } = 1);
}
