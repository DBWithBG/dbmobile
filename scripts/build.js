var webpack = require('webpack')
var config = require('../webpack.config.js')

webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error("[-] Webpack error : " + err);
    } else {
        console.log("[+] Webpack build OK")
    }
});