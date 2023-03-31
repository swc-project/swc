import sparkle from '@themagician/sparkle';
import worldLevel from './worldLevel';
import storm from './storm.js';
import phenomenaLevels from './phenomena.levels';
import index from './some/index.js';
import dot from '.';
import twoDots from '..';

export class Hello {
  message(to) {
    console.log(`Hello ${to.toString()}!`);
  }
}

export class World {
  runExperiement() {
    const seed = storm(worldLevel(), phenomenaLevels());
    twoDots(dot(index()));
    sparkle(seed);
  }

  toString() {
    return `World ${worldLevel()} ${storm()}`;
  }
}
