const flag = true;
const fallback = 0;

const handler = flag
    ? fallback
    : (
          alpha,
          beta,
          gamma,
          [head, ...tail],
          { x: xx, y },
          ...rest
      ): number => alpha + beta + gamma + head + xx + y + tail.length + rest.length;

const grouped = (alpha, beta, gamma);
