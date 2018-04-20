const path = require('path');

module.exports = {
    target: 'web',
    mode: 'development',
    module: {
        rules: [{
            use: 'babel-loader',
            test: /\.js$/,
            include: [path.resolve(__dirname, 'src')]
        }]
    }
};