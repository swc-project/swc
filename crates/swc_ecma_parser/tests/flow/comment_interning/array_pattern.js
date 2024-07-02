
const /* 1.1 pre */ [x1, x2] /* 1.2 post */ = [1, 2];

const /* 2.1 pre */ [y1, y2] = [1, 2];

const [z1, z2] /* 3.1 post */ = [1, 2];

const [/* 4.1 L rest */ ... /* 4.2 L id */ rest /* 4.3 T id */] = [];

const [/* 5.1 I array */] = [];

const [a, /* 6.1 I array */] = [];
