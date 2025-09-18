module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' || process.env.ELEVENTY_ENV === 'prod'
      ? [require('cssnano')({ preset: 'default' })]
      : [])
  ]
};
