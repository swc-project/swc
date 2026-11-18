
    class Test {
      #serialization;
      _packet(raw) {
        pak = this.#serialization.decode(raw);
      }
    }
    