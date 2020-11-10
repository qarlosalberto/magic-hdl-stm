module.exports = () => {
  return {
    entry: "./tests/demo.js",
    mode: "development",
    output: {
      filename: `rerender.bundle.js`
    }
  };
};
