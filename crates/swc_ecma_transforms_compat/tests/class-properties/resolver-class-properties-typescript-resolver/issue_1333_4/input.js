
  class Test {
    #ws;
    #serialization;

    _packet(raw) {
      /** @type {DiscordPacket} */
      let pak;
      try {
          pak = this.#serialization.decode(raw);
      } catch (e) {
          return;
      }
    }
  }
  