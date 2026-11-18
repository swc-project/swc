
    function useFoo(cond) {
      const [count, setCount] = useState(0);
      if (cond) {
        useFoo(false);
      }
      return count;
    }
