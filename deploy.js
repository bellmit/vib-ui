var ftpClient = require('ftp-client');


const localRoot = ["!./VIB-Node-Server/VIB-Teller-Socket/**",
    "!./VIB-Node-Server/node_modules/**",
    "!./VIB-Node-Server/teller-dist/**",
    "./VIB-Node-Server/** "];
const remoteRoot = "/";
const exclude = ['.git', '.idea', 'tmp/*', 'build/*'] ;

var config = {
        user: "VIB",
        password: "VIB", // optional, prompted if none given
        host: "192.168.10.130",
        port: 21
    },
    options = {
        logging: 'basic'  
    };

var client = new ftpClient(config, options);

client.connect(function () {

    client.upload(localRoot, remoteRoot, {
        baseDir: '',
        overwrite: 'all'
    }, function (result) {
        console.log(result);
    });

});
