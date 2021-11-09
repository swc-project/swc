const x = {
    n: 123,
    t: 'text',
    int: '==INT=='
};
const { n , t , int: __int  } = x;
console.log(n, t, __int);
