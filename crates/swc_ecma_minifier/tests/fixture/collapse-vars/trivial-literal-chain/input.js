// Every constant below is used twice. The sequential inliner copies initializers
// made of literals into each use, so without a bound on what it copies, the copied
// expressions grew like the Fibonacci numbers along this chain.
function chain() {
    const v39 = 39;
    const v38 = 38 + v39;
    const v37 = 37 + v38 + v39;
    const v36 = 36 + v37 + v38;
    const v35 = 35 + v36 + v37;
    const v34 = 34 + v35 + v36;
    const v33 = 33 + v34 + v35;
    const v32 = 32 + v33 + v34;
    const v31 = 31 + v32 + v33;
    const v30 = 30 + v31 + v32;
    const v29 = 29 + v30 + v31;
    const v28 = 28 + v29 + v30;
    const v27 = 27 + v28 + v29;
    const v26 = 26 + v27 + v28;
    const v25 = 25 + v26 + v27;
    const v24 = 24 + v25 + v26;
    const v23 = 23 + v24 + v25;
    const v22 = 22 + v23 + v24;
    const v21 = 21 + v22 + v23;
    const v20 = 20 + v21 + v22;
    const v19 = 19 + v20 + v21;
    const v18 = 18 + v19 + v20;
    const v17 = 17 + v18 + v19;
    const v16 = 16 + v17 + v18;
    const v15 = 15 + v16 + v17;
    const v14 = 14 + v15 + v16;
    const v13 = 13 + v14 + v15;
    const v12 = 12 + v13 + v14;
    const v11 = 11 + v12 + v13;
    const v10 = 10 + v11 + v12;
    const v9 = 9 + v10 + v11;
    const v8 = 8 + v9 + v10;
    const v7 = 7 + v8 + v9;
    const v6 = 6 + v7 + v8;
    const v5 = 5 + v6 + v7;
    const v4 = 4 + v5 + v6;
    const v3 = 3 + v4 + v5;
    const v2 = 2 + v3 + v4;
    const v1 = 1 + v2 + v3;
    const v0 = 0 + v1 + v2;
    return v0;
}
console.log(chain());
