
const a = (a) => {
    const useE = useEffect;
    return function useFoo() {
      useE(() => console.log(a), []);
      return useState(123);
    };
}
