
    class Test {
      #ws;
      #serialization;

      _packet(raw) {
        /** @type {DiscordPacket} */
        let pak;
        try {
            pak = this.#serialization.decode(raw);
            this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
            return;
        }

        switch (pak.t) {
            case 'READY':
            case 'RESUMED':
        }
      }
    }
    