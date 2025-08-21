// This is the ES5-transformed version of:
// export default function render(factory) {
//   return factory(({aaa, bbb, ccc}) => {
//     ccc(1)
//   }, [0, 19])
// }

export default function render(factory) {
  return factory(function(param) {
    var aaa = param.aaa, bbb = param.bbb, ccc = param.ccc;
    ccc(1)
  }, [0, 19])
}