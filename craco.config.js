module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.devServer = {
                ...webpackConfig.devServer,
                setupMiddlewares: (middlewares, devServer) => {
                    // Custom middleware setup
                    return middlewares;
                },
            };
            return webpackConfig;
        },
    },
};