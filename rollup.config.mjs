
const config =  {
  input: "build/esm/hashitaka.js",
  output: {
    name: "hashitaka",
    file: "build/hashitaka.mjs",
    format: "es"
  },
  external: [
    "@dwtechs/checkard",
  ],
  plugins: []
};

export default config;
