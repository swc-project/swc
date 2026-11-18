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

(function () {
    return<T>
        (v: T) => v
});
(function () {
    return/**/<
        T
    >/**/(v: T)/**/:
    T/**/=> v
});
(function* () {
    yield<T>
(v: T)=>v;
});
(function* () {
    throw<T>
(v: T)=>v;
});
