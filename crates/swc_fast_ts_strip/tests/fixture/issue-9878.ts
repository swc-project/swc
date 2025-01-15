function f() {
	return <T>
		(x: T)=>x;
}

function f2() {
	return <T
	>
		(x: T)=>x;
}


function f3() {
	return <T
	>
		(x: T): Promise<
        T>=>x;
}