module.exports = function override(config) {
  config.module.rules.push({
    test: /\.worker\.ts$/,
    use: {
      loader: 'worker-loader',
      options: {
        inline: 'fallback',
        filename: '[contenthash].worker.js'
      }
    }
  });

  config.output.globalObject = 'this';

  return config;
};
