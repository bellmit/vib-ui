
export const environment = {
    isProduction: false,
    machine_id: "VIB003",
    branchCode: "0003",
    domainAPI: "http://10.201.113.26:3000/api/",
    socketTellerRTC: "https://10.201.113.26:3005?branch=vib&callto=teller1",
    socketTellerAbsorption: "https://10.201.113.26:3005?machine_id=",
    socketTeller: "https://10.202.104.236:3005?machine_id=",
    domainHardware: "http://localhost:5000/",
    domainImageOutput: "http://localhost:3500/",
    domainLogger: "http://localhost:5200/#/kk",
    requestTimeout: 5000,
    idleTimeout: 180, // Sec
    // hack is here --- bass below ---
    // requestTimeout: 180000,
    // idleTimeout: 180000,
    // hack is here --- bass above ---
    sessionTimeout: 10
}