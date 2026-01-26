// Shadowed
export type Foo = {};
export type Bar = {
	foo: Foo;
};
const Foo = new Map();

type Func = () => void;
function Func() {}
export type FuncType = Func;

type Module = () => void;
namespace Module {
	export const x = 1;
}
export type ModuleType = Module;