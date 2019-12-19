module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['macros'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
