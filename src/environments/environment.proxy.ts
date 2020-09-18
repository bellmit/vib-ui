export const environment = {
    isProduction: false,
    domainAPI: "http://testkk1.palomar.lan/api/",
    domainHardware: "http://192.168.10.190:5000/",
    socketTeller: "http://192.168.10.190:6000/",
    socketTellerRTC: "https://192.168.10.112:3000/remote",
    domainImageOutput: "http://192.168.10.180:3500/",
    domainLogger: "http://localhost:5200/",
    requestTimeout: 5000,
    idleTimeout: 180, //Sec
    // hack is here --- bass below ---
    // requestTimeout: 180000,
    // idleTimeout: 180000,
    // hack is here --- bass above ---
    sessionTimeout: 10 //Sec
};
