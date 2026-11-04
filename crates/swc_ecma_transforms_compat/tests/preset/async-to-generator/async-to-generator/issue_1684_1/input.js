
    const cache = {}

    async function getThing(key) {
      const it = cache[key] || (await fetchThing(key))
      return it
    }

    function fetchThing(key) {
      return Promise.resolve(key.toUpperCase()).then(val => (cache[key] = val))
    }
    