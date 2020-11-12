module.exports = () => {
  return {
    entry: "./example/index.js",
    mode: "development",
    output: {
      filename: `../example/magic_hdl_smt.bundle.js`
    }
  };
}; 
