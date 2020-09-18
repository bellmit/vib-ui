export class TransactionPassbookTD {
    tdPlacementSequence: string;
    placementNumber: string;
    productCode: string;
    productDesc: string;
    term: string;
    rate: string;
    issueDate: string;
    maturityDate: string;
    accountStatus: string;
    accountStatusDesc: string;
    amount: string;
    availableBalance: string;

    constructor(json: any) {
        this.tdPlacementSequence = json.tdPlacementSequence;
        this.placementNumber = json.placementNumber;
        this.productCode = json.productCode;
        this.productDesc = json.productDesc;
        this.term = json.term;
        this.rate = json.rate;
        this.issueDate = json.issueDate;
        this.maturityDate = json.maturityDate;
        this.accountStatus = json.accountStatus;
        this.accountStatusDesc = json.accountStatusDesc;
        this.amount = json.amount;
        this.availableBalance = json.availableBalance;
    }
}