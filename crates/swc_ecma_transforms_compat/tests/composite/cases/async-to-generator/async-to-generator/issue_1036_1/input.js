
    const x = async function() {
      console.log(
          await Promise.all([[1], [2], [3]].map(
              async ([a]) => Promise.resolve().then(() => a * 2))
          )
      );
    }
    