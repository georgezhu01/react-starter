import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';

const getPlugins = () => {
  const plugins = [];
  // noinspection JSUnresolvedVariable, JSUnresolvedFunction
  plugins.push(
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
      clear: false }),
    new webpack.DefinePlugin({
      __DEV__: isDev
    })
  );
  if (isDev) {
    // noinspection JSUnresolvedFunction
    plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
  } else {
    plugins.push(
      new ExtractTextPlugin({ filename: 'styles/main.css', allChunks: true })
    );
    // noinspection JSUnresolvedFunction
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    );
  }
  return plugins;
};

const getEntry = () => {
  let entry = ['babel-polyfill'];
  if (isDev) {
    entry = [
      'webpack-hot-middleware/client?reload=true',
      path.join(process.cwd(), './src/app.js')
    ];
  } else {
    entry = [
      path.join(process.cwd(), './src/app.js')
    ];
  }
  return entry;
};

// noinspection JSUnresolvedFunction
export default {
  context: process.cwd(),
  cache: isDev,
  devtool: isDev ? 'cheap-eval-source-map' : 'source-map',
  entry: getEntry(),
  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), './public/assets'),
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        include: path.join(process.cwd(), 'src/'),
        options: {
          cacheDirectory: isDev,
          babelrc: false,
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-runtime'],
        }
      },
      {
        test: /(global).*\.css$/,
        loader: isDev ? 'style-loader!css-loader!postcss-loader'
          : ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!postcss-loader' })
      },
      {
        test: /^(?!global)*\.css$/,
        loader: isDev ?
          'style-loader!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap&-minimize&importLoaders=2!resolve-url-loader!postcss-loader'
          : ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?modules&sourceMap&minimize&importLoaders=2!resolve-url-loader!postcss-loader' })
      },
      {
        test: /\.scss$/,
        loader: isDev ?
          'style-loader!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap&-minimize&importLoaders=2!resolve-url-loader!postcss-loader'
          : ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?modules&sourceMap&minimize&importLoaders=2!resolve-url-loader!postcss-loader' })
      },
      {
        test: /\.(png|woff2?|ttf|eot|svg)$/,
        loader: 'url-loader?limit=10000' },
      {
        test: /\.json$/,
        loader: 'json'
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      'src',
      'node_modules',
    ],
  },
  plugins: getPlugins()
};
