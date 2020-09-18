export const environment = {
    isProduction: true,
    useSmartCardReaderOpenAccount: true,
    machine_id: "VIB001",
    branchCode: "0003",
    envName: "UAT",

    domainNewApi: "VIB/",
    domainNewApiMfs: "vib-mfs-service/",

    socketTeller: "http://10.208.141.118:5800?machine_id=",
    socketTellerRTC: "https://10.208.141.118:3005?branch=vib001&callto=3fp_uat001",
    socketTellerAbsorption: "http://localhost:5800?machine_id=",
    domainHardware: "http://localhost:5000/",
    domainImageOutput: "http://localhost:3500/",
    domainLogger: "http://localhost:5200/#/kk",
    requestTimeout: 5000,
    idleTimeout: 180,
    // hack is here --- bass below ---
    // requestTimeout: 180000,
    // idleTimeout: 180000,
    // hack is here --- bass above ---
    sessionTimeout: 10
};
