
    const useFoo = function useInner(cond) {
      const [count, setCount] = useState(0);
      if (cond) {
        useInner(false);
        useFoo(false);
      }
      return count;
    };
