const x = {
    n: 123,
    t: 'text',
    int: '==INT=='
};
const { n , t , int: __int = 5  } = x;
console.log(n, t, __int);
