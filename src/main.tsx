import { encodeEliasDelta } from "@luncheon/elias-codes/delta.js";
import { encodeEliasGamma } from "@luncheon/elias-codes/gamma.js";
import { encodeEliasOmega } from "@luncheon/elias-codes/omega.js";
import { encodeExponentialGolomb } from "@luncheon/exponential-golomb-code";
import { encodeFibonacci } from "@luncheon/fibonacci-code";
import { encodeParityStep } from "@luncheon/parity-step-code";
import { varintEncoder } from "@luncheon/varint";
import { Grid } from "gridjs";

const range = (min: number, max: number) => Array.from({ length: max - min + 1 }, (_, i) => i + min);

const varintStringEncoder = (chunkSize: number) => (n: number) =>
  varintEncoder(chunkSize)(n).reduce((x, y) => x + y.toString(2).padStart(chunkSize, "0"), "");

const encoders: [string, (n: number) => string][] = [
  ["Parity-Step", n => (n ? encodeParityStep(n).reduce((x, y) => x + y, "") : "-")],
  ["Fibonacci", n => (n ? encodeFibonacci(n).join("") : "-")],
  ["Elias Gamma", n => (n ? encodeEliasGamma(n).join("") : "-")],
  ["Elias Delta", n => (n ? encodeEliasDelta(n).join("") : "-")],
  ["Elias Omega", n => (n ? encodeEliasOmega(n).join("") : "-")],
  ["Exp-Golomb-0", n => encodeExponentialGolomb(n, 0).join("")],
  ["Exp-Golomb-1", n => encodeExponentialGolomb(n, 1).join("")],
  ["Exp-Golomb-2", n => encodeExponentialGolomb(n, 2).join("")],
  ["Exp-Golomb-3", n => encodeExponentialGolomb(n, 3).join("")],
  ["Exp-Golomb-4", n => encodeExponentialGolomb(n, 4).join("")],
  ["Exp-Golomb-5", n => encodeExponentialGolomb(n, 5).join("")],
  ["Exp-Golomb-6", n => encodeExponentialGolomb(n, 6).join("")],
  ["Exp-Golomb-7", n => encodeExponentialGolomb(n, 7).join("")],
  ["Exp-Golomb-8", n => encodeExponentialGolomb(n, 8).join("")],
  ["Varint 4bit", varintStringEncoder(4)],
  ["Varint 5bit", varintStringEncoder(5)],
  ["Varint 6bit", varintStringEncoder(6)],
  ["Varint 7bit", varintStringEncoder(7)],
  ["Varint 8bit", varintStringEncoder(8)],
];

const highlightShortest = (codes: readonly string[]) => {
  const minLength = Math.min(...codes.map(c => c.length));
  return codes.map(code => (code.length !== minLength ? code : <div class="shortest-code">{code}</div>));
};

const render = (() => {
  let grid: Grid | undefined;
  return (options: { n: readonly (readonly [number, number])[] }) => {
    grid?.destroy();
    if (!options.n.length) {
      grid = undefined;
      const params = new URLSearchParams(location.hash.slice(1));
      params.set("n", "0-1024");
      location.hash = params.toString();
      return;
    }
    grid = new Grid({
      columns: ["n", ...encoders.map(e => e[0])],
      data: options.n
        .flatMap(([min, max]) => range(min, max))
        .map(n => [
          n,
          ...highlightShortest(
            encoders.map(e => {
              const code = e[1](n);
              return `${code} (${code === "-" ? "-" : code.length})`;
            }),
          ),
        ]),
    }).render(document.body.firstElementChild!);
  };
})();

const parseOptions = () => {
  const params = new URLSearchParams(location.hash.slice(1));
  const n = params.getAll("n").map(n => {
    const split = n.split("-");
    const min = parseInt(split[0]);
    return [min, split[1] ? parseInt(split[1]) : min] as const;
  });
  return { n };
};

addEventListener("hashchange", () => render(parseOptions()));
render(parseOptions());
