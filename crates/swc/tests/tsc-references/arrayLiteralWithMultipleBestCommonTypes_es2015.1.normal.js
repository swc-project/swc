// when multiple best common types exist we will choose the first candidate
var a;
var b;
var c;
var as = [
    a,
    b
]; // { x: number; y?: number };[]
var bs = [
    b,
    a
]; // { x: number; z?: number };[]
var cs = [
    a,
    b,
    c
]; // { x: number; y?: number };[]
var ds = [
    (x)=>1,
    (x)=>2
]; // { (x:Object) => number }[]
var es = [
    (x)=>2,
    (x)=>1
]; // { (x:string) => number }[]
var fs = [
    (a)=>1,
    (b)=>2
]; // (a: { x: number; y?: number }) => number[]
var gs = [
    (b)=>2,
    (a)=>1
]; // (b: { x: number; z?: number }) => number[]
