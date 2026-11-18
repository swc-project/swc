const obj = {
set obj({ a, b } = {}) {
  this.num = { a, b };
},
set arr([x, y] = []) {
  this.num = { x, y }
}
};