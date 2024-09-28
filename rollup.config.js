import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import css from "rollup-plugin-css-only";
import terser from "@rollup/plugin-terser";

const outputDirname = "dist";

export default [
  {
    input: "src/options.js",
    output: {
      file: `${outputDirname}/options.js`,
      format: "iife",
      name: "options",
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      css({ output: "styles.css" }),
      terser(),
      copy({
        targets: [
          { src: "src/options.html", dest: outputDirname },
          { src: "manifest.json", dest: outputDirname },
          { src: "icons", dest: outputDirname },
        ],
        hook: "writeBundle",
      }),
    ],
  },
  {
    input: "src/background.js",
    output: {
      file: `${outputDirname}/background.js`,
      format: "iife",
      name: "background",
    },
    plugins: [commonjs(), nodeResolve(), terser()],
  },
];
