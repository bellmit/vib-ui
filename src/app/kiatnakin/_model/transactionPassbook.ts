
export class TransactionPassbook {
    amount: string;
    coddebitcredit: string;
    codtxnliteral: string;
    depinterest: string;
    depterm: string;
    flgpasbkupd: string;
    matdate: string;
    runbal: string;
    tellerid: string;
    txndate: string;

    constructor(json: any) {
        this.amount = json.amount;
        this.coddebitcredit = json.coddebitcredit;
        this.codtxnliteral = json.codtxnliteral;
        this.depinterest = json.depinterest;
        this.depterm = json.depterm;
        this.flgpasbkupd = json.flgpasbkupd;
        this.matdate = json.matdate;
        this.runbal = json.runbal;
        this.tellerid = json.tellerid;
        this.txndate = json.txndate;
    }
}