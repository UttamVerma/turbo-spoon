/** @type {import('@remix-run/dev').AppConfig} */
const { createRoutesFromFolders } = require("@remix-run/v1-route-convention");
module.exports = {
  appDirectory: 'app',
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['./public', './.env'],
  server: './server.js',

  /**
   * The following settings are required to deploy Hydrogen apps to Oxygen:
   */
  publicPath: (process.env.HYDROGEN_ASSET_BASE_URL ?? '/') + 'build/',
  assetsBuildDirectory: 'dist/client/build',
  appDirectory: "app",
  // serverBuildPath: 'dist/worker/index.js',
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
  assetsBuildDirectory: "public/build",
  ignoredRouteFiles: [".gitignore", ".git/**/*"],
  serverMainFields: ['browser', 'module', 'main'],
  serverConditions: ['worker', process.env.NODE_ENV],
  serverDependenciesToBundle: 'all',
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  serverMinify: process.env.NODE_ENV === 'production',

  routes: (defineRoutes) => {
    return createRoutesFromFolders(defineRoutes, {
      // Define custom route patterns here
      rootFolder: "app",
      routes: {
        "/": {
          component: () => import("./routes/home.js"),
        },
        "/blog": {
          component: () => import("./routes/blog.js"),
        },
        "/blog/:slug": {
          component: () => import("./routes/blog-post.js"),
        },
        "/products": {
          component: () => import("./routes/products.js"),
        },
        "/products/:productId": {
          component: () => import("./routes/product.js"),
        },
      },
    });
  },
};
