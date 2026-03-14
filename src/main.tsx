import { encodeExponentialGolomb } from "@luncheon/exponential-golomb-code";
import { encodeFibonacci } from "@luncheon/fibonacci-code";
import { encodeGolomb } from "@luncheon/golomb-code";
import { varintEncoder } from "@luncheon/varint";
import { Grid } from "gridjs";

const encoderTypes = {
  Golomb: {
    parameters: ["M"],
    encode: (n: number, [M]: readonly number[]) => encodeGolomb(n, M).reduce((x, y) => x + y, ""),
  },
  expGolomb: {
    parameters: ["k"],
    encode: (n: number, [k]: readonly number[]) => encodeExponentialGolomb(n, k).join(""),
  },
  Fibonacci: {
    parameters: [],
    encode: (n: number) => (n ? encodeFibonacci(n).join("") : "-"),
  },
  Varint: {
    parameters: ["chunk"],
    encode: (n: number, [chunkSize]: readonly number[]) =>
      varintEncoder(chunkSize)(n).reduce((x, y) => x + y.toString(2).padStart(chunkSize, "0"), ""),
  },
};

const encoders: readonly (
  | readonly ["Golomb", readonly [number]]
  | readonly ["expGolomb", readonly [number]]
  | readonly ["Fibonacci", readonly []]
  | readonly ["Varint", readonly [number]]
)[] = [
  ["Fibonacci", []],
  ["Golomb", [16]],
  ["Golomb", [32]],
  ["Golomb", [64]],
  ["Golomb", [128]],
  ["expGolomb", [0]],
  ["expGolomb", [1]],
  ["expGolomb", [2]],
  ["expGolomb", [3]],
  ["expGolomb", [4]],
  ["expGolomb", [5]],
  ["expGolomb", [6]],
  ["expGolomb", [7]],
  ["expGolomb", [8]],
  ["Varint", [4]],
  ["Varint", [5]],
  ["Varint", [6]],
  ["Varint", [7]],
  ["Varint", [8]],
];

const highlightShortest = (codes: readonly string[]) => {
  const minLength = Math.min(...codes.map(c => c.length));
  return codes.map(code => (code.length !== minLength ? code : <div class="shortest-code">{code}</div>));
};

new Grid({
  columns: [
    "n",
    ...encoders.map(([name, args]) =>
      args.length === 0 ? name : `${name} (${encoderTypes[name].parameters.map((p, i) => `${p}=${args[i]}`)})`,
    ),
  ],
  data: Array.from({ length: 1001 }, (_, n) => [
    n,
    ...highlightShortest(
      encoders.map(([name, args]) => {
        const code = encoderTypes[name].encode(n, args);
        return `${code} (${code === "-" ? "-" : code.length})`;
      }),
    ),
  ]),
}).render(document.body.firstElementChild!);
