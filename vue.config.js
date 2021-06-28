const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  parallel: require("os").cpus().length > 1,
  devServer: {
    proxy: {
      "/client": {
        target: "http://221.237.156.192:5710/", // http://172.16.2.18:8090/  http://221.237.156.192:5710/
        changeOrigin: true,
        pathRewrite: {
          "^/client": "/client",
        },
      },
    },
    port: 8082,
  },
  publicPath: "./",
  filenameHashing: true,
  lintOnSave: true,
  productionSourceMap: false, //发布去掉sourceMap，泄露源代码
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@style/global.scss";',
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@img", resolve("src/assets/img"))
      .set("@utils", resolve("src/utils"))
      .set("@c", resolve("src/components"))
      .set("@style", resolve("src/assets/style"))
      .set("@views", resolve("src/views"));
  },

  configureWebpack: (config) => {
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    config.externals = {
      vue: "Vue",
      axios: "axios",
      "vue-router": "VueRouter",
    };
    let plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          output: {
            // 去掉注释内容
            comments: true,
          },
          warnings: false,
        },
        sourceMap: false,
        parallel: true,
      }),
      // new CompressionPlugin({
      //   test: /\.(js|css|scss)$/,
      //   threshold: 10240,
      //   deleteOriginalAssets: false,
      // }),
    ];
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";
      config.plugins = [...config.plugins, ...plugins];
      config["performance"] = {
        //打包文件大小配置
        maxEntrypointSize: 10000000,
        maxAssetSize: 30000000,
      };
    }
  },
};
