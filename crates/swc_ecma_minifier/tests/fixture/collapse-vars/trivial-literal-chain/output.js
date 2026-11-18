// Every constant below is used twice. The sequential inliner copies initializers
// made of literals into each use, so without a bound on what it copies, the copied
// expressions grew like the Fibonacci numbers along this chain.
function chain() {
    let v34 = 754, v33 = 1241, v32 = 2027, v31 = 31 + v32 + 1241, v30 = 30 + v31 + v32, v29 = 29 + v30 + v31, v28 = 28 + v29 + v30, v27 = 27 + v28 + v29, v26 = 26 + v27 + v28, v25 = 25 + v26 + v27, v24 = 24 + v25 + v26, v23 = 23 + v24 + v25, v22 = 22 + v23 + v24, v21 = 21 + v22 + v23, v20 = 20 + v21 + v22, v19 = 19 + v20 + v21, v18 = 18 + v19 + v20, v17 = 17 + v18 + v19, v16 = 16 + v17 + v18, v15 = 15 + v16 + v17, v14 = 14 + v15 + v16, v13 = 13 + v14 + v15, v12 = 12 + v13 + v14, v11 = 11 + v12 + v13, v10 = 10 + v11 + v12, v9 = 9 + v10 + v11, v8 = 8 + v9 + v10, v7 = 7 + v8 + v9, v6 = 6 + v7 + v8, v5 = 5 + v6 + v7, v4 = 4 + v5 + v6, v3 = 3 + v4 + v5, v2 = 2 + v3 + v4;
    return 0 + (1 + v2 + v3) + v2;
}
console.log(chain());
