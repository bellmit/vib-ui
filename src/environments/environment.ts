// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    isProduction: false,
    isFundFactSheet: false,
    useSmartCardReaderOpenAccount: false,
    machine_id: "A001",
    branchCode: "0003",
    envName: "SIT",
    //domainAPI: "http://10.201.113.26:3000/api/",
    //domainAPI: "http://10.202.104.236:8080/VIB/",
    /* for local dev */
    // domainNewApi: "http://localhost:4202/VIB/",
    /* for deploy dev */
    domainNewApi: "VIB/",
    domainNewApiMfs: "vib-mfs-service/",
    //socketTeller: "http://192.168.3.107:5800?machine_id=",
    // socketTeller: "http://10.208.141.118:5800?machine_id=",
    socketTeller: "http://localhost:5800?machine_id=",
    //socketTellerRTC: "https://10.201.113.26:3005?branch=vib001&callto=3fp_uat001",
    socketTellerRTC: "https://10.208.141.118:3005?branch=vib001&callto=3fp_uat001",
    socketTellerAbsorption: "http://10.202.104.236:5800?machine_id=",
    // socketTellerAbsorption: "http://localhost:5800?machine_id=",
    domainHardware: "http://localhost:5000/",
    // domainHardware: "http://192.168.2.23:5000/",
    domainImageOutput: "http://localhost:3500/",
    domainLogger: "http://localhost:5200/#/kk",
    requestTimeout: 15000,
    idleTimeout: 180,
    // hack is here --- bass below ---
    // requestTimeout: 180000,
    // idleTimeout: 180000,
    // hack is here --- bass above ---
    sessionTimeout: 10
};

