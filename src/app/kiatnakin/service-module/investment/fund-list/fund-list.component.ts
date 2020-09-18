import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InvestmentService } from "../../../_service/api/investment.service"
import { Modal } from "app/kiatnakin/_share/modal-dialog/modal-dialog.component";
import { DataService, AccountService } from 'app/kiatnakin/_service';
import { TransactionService } from 'app/kiatnakin/_service/api/transaction.service';
import { UserService } from 'app/kiatnakin/_service/user.service';
import { Observable } from "rxjs/Observable";
import { Utils } from '../../../../share/utils';
import { TemplateFundListComponent } from '../../../_template/template-fund-list/template-fund-list.component';
import { BankAccount, Bank } from '../../../_model';
import { isNullOrUndefined } from 'util';
import { MasterDataService } from '../../../_service/api/master-data.service';

@Component({ selector: 'fund-list', templateUrl: './fund-list.component.html', styleUrls: ['./fund-list.component.sass'] })
export class FundListComponent implements OnInit {

    @ViewChild("templateFundList") templateFundList: TemplateFundListComponent;
    public transactionType;
    public titleInvest;
    public fundList = [];
    public holderList = [];
    public myPortList = [];
    public fundFlag = {
        exchange: false,
        fif: false,
        suit: false,
        ltf: false,
        acceptexchange: false,
        acceptfif: false,
        acceptsuit: false,
        acceptltf: false
    };

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private investmentService: InvestmentService,
        public dataService: DataService,
        public userService: UserService,
        private accountService: AccountService,
        private transactionService: TransactionService,
        private masterDataService: MasterDataService) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.transactionType = params.type;
            this.requestGetFunList()
        });
    }

    requestGetFunList() {
        if (this.transactionType === "purchase") {
            this.titleInvest = "ชื้อ";
            let newFundList = [];
            this.investmentService.getNewFundList().flatMap(list => {
                newFundList = list.data;
                return this.investmentService.getBuyFundList();
            }).subscribe(list => {
                const buyFundList = list.data;
                Array.prototype.push.apply(newFundList, buyFundList);
                this.fundList = newFundList;
                this.getPortDetail()
            }, error => { })
        } else if (this.transactionType === "redeem") {
            this.titleInvest = "ขาย";
            this.investmentService.getRedeemFundList().subscribe(list => {
                this.fundList = list.data;
                this.getPortDetail()
            }, error => { })
        } else if (this.transactionType === "switch_out") {
            this.titleInvest = "สับเปลี่ยนออก";
            this.investmentService.getSwitchOutFundList().subscribe(list => {
                this.fundList = list.data;
                this.getPortDetail()
            }, error => { })
        }
        else if (this.transactionType === "switch_in") {
            this.titleInvest = "สับเปลี่ยนเข้า";
            const fundCodeSwitchOut = this.dataService.transaction.selectedFund.FundCode;
            this.investmentService.getSwitchInFundList(fundCodeSwitchOut).subscribe(list => {
                this.fundList = list.data;
                this.getPortDetail()
            }, error => { })
        }
        this.investmentService.getHolderList().subscribe(list => {
            this.holderList = list.data
        }, error => { })

    }

    getPortDetail() {
        this.investmentService.getPortDetail().subscribe((list) => {
            list.data[0].ListDetail.forEach((item, index) => {
                const existingInfundList = this.fundList.filter(fund => fund.FundCode === item.FundCode);
                const tempPortList = [];
                if (existingInfundList.length > 0) {
                    tempPortList.push(item)
                }
                this.myPortList = tempPortList
            })
        }, (error) => {
            Modal.showAlert(error.responseStatus.responseMessage)
        })
    }

    onClickBack() {
        switch (this.transactionType) {
            case 'switch_in':
                Modal.showProgress();
                this
                    .router
                    .navigate([
                        "kk", "investment", "fundList"
                    ], { queryParams: { type: "switch_out" } });
                break;
            default:
                this
                    .router
                    .navigate(["kk", "investment"])
        }

    }

    async onSubmitFund($data) {

        try {
            await this.getBankList()
            const funds = $data.funds;
            const holder = $data.holder;
            if (funds.length > 0) {
                const fund = funds[0];
                const fundCode = fund.FundCode;

                if (this.transactionType === "purchase") {
                    this.dataService.transaction.selectedFund = fund;
                    this.dataService.transaction.selectedHolder = holder;

                    Modal.showProgress();
                    const bankAccount = this.getBankAccountFromUnitHolder(this.dataService.transaction.selectedHolder);
                    this.dataService.transaction.from = bankAccount;
                    this.onRequestTransactionEffectiveDateAndFundSuitAndExchange()

                }
                else if (this.transactionType === "redeem" || this.transactionType === "switch_out") {
                    this.dataService.transaction.selectedFund = fund;
                    this.dataService.transaction.selectedHolder = holder;
                    this.onCheckAvilableUnit()
                }
                else if (this.transactionType === "switch_in") {
                    this.dataService.transaction.selectedFundSwitchIn = fund;
                    this.dataService.transaction.selectedHolderSwitchIn = holder;
                    this.onRequestTransactionEffectiveDateAndFundSuitAndExchange()
                }
            }
        } catch (e) {
            if (!isNullOrUndefined(e) && e.length > 0) {
                Modal.showAlert(e)
            }
            return;
        }
    }

    onRequestTransactionEffectiveDateAndFundSuitAndExchange() {

        Modal.showProgress();
        const fund = this.dataService.transaction.selectedFund;
        const holder = this.dataService.transaction.selectedHolder;
        const fundCode = fund.FundCode;

        this
            .investmentService
            .getTransactionEffectiveDate(fundCode, this.transactionType)
            .flatMap(res => {
                Modal.showProgress();
                this.dataService.transaction.estimateEffectiveDate = res.data[0];

                return this.transactionService
                    .GetConfigList('mutualfund')

            })
            .flatMap(res => {
                Modal.showProgress();
                this.dataService.transaction.profileCode = res.data;

                return this
                    .investmentService
                    .getFundSuitAndExchange(fundCode)
            })
            .subscribe(res => {
                this.dataService.transaction.fundSuitAndExchange = res.data[0];
                this.dataService.transaction.selectedFund = fund;
                this.dataService.transaction.selectedHolder = holder;

                this.didCheckSuitAndExchange()

            }, error => {
                console.log(`error: ${error}`);
                Modal.showAlert(error.responseStatus.responseMessage)
            })
    }

    async onCheckAvilableUnit() {

        Modal.showProgress()
        this.investmentService.getHolderList(this.dataService.transaction.selectedFund.FundCode)
            .subscribe(
                res => {
                    let selectedHolder = this.dataService.transaction.selectedHolder;

                    const availableUnitHolder = res.data.filter(holderList => holderList.Unitholder === selectedHolder.Unitholder && holderList.AvailableUnit > 0 && holderList.EstimateAmount > 0)
                    if (availableUnitHolder.length === 0) {
                        Modal.showAlert("Unit ไม่เพียงพอสำหรับทำรายการ");
                        this.templateFundList.didClearSelectedFund();
                        return
                    }
                    selectedHolder = this.dataService.transaction.selectedHolder = availableUnitHolder[0];

                    const bankAccount = this.getBankAccountFromUnitHolder(selectedHolder);

                    if (this.transactionType === "redeem") {

                        if (bankAccount.accountNumber.length === 0) {
                            Modal.showAlert("ไม่พบเลขบัญชีที่ผูกไว้กับหน่วยลงทุน");
                            return
                        }

                        this.dataService.transaction.to = bankAccount;
                        this.onRequestTransactionEffectiveDateAndFundSuitAndExchange()
                    }
                    else if (this.transactionType === "purchase") {
                        this.dataService.transaction.from = bankAccount
                    }
                    else if (this.transactionType === "switch_out") {

                        this.didClearDataList();
                        this.onClickAccept()
                    }
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage)
                }
            )
    }

    getBankAccountFromUnitHolder(unitHolder) {
        const bankAccount = new BankAccount();

        if (isNullOrUndefined(unitHolder) || unitHolder.BankAccount.length === 0) {
            return bankAccount
        }
        const bank = this.dataService.dataBankList.filter(b => b.code === unitHolder.BankNameCode)
        if (bank.length > 0) {
            bankAccount.accountNumber = unitHolder.BankAccount
            bankAccount.branchCode = unitHolder.BankBranchCode
            bankAccount.branchName = unitHolder.BankBranch
            bankAccount.bank = bank[0]
        }
        return bankAccount
    }

    async getBankList() {

        if (isNullOrUndefined(this.dataService.dataBankList)) {
            return new Promise((resolve, reject) => {
                Modal.showProgress();
                this.masterDataService.getMasterBank()
                    .subscribe(
                        (bankList: [Bank]) => {
                            this.dataService.dataBankList = bankList
                            resolve()
                        },
                        error => {
                            reject(error.responseStatus.responseMessage)
                        }
                    );
            })
        }
    }

    didCheckSuitAndExchange() {
        const { CUST_SUIT_LEVEL, LOW_INV_EXP_IND, RISK_PROFILE } = this.userService.getUser().suitScore;
        const { ExchangeFlag, FIFFlag, FundSuitLevel, LTFFlag } = this.dataService.transaction.fundSuitAndExchange

        if (ExchangeFlag === "Y" ||
            CUST_SUIT_LEVEL < FundSuitLevel ||
            FIFFlag === "Y" ||
            LTFFlag === "Y"
        ) {

            this.fundFlag.suit = CUST_SUIT_LEVEL < FundSuitLevel;
            this.fundFlag.acceptsuit = !this.fundFlag.suit;

            this.fundFlag.exchange = ExchangeFlag === "Y";
            this.fundFlag.acceptexchange = !this.fundFlag.exchange;

            this.fundFlag.fif = FIFFlag === "Y";
            this.fundFlag.acceptfif = !this.fundFlag.fif;

            this.fundFlag.ltf = LTFFlag === "Y";
            this.fundFlag.acceptltf = !this.fundFlag.ltf;

            this.onDisplayConfirmFundFlag()
        }
        else {
            this.onClickAccept()
        }


    }

    onDisplayConfirmFundFlag() {
        Utils.animate("#alert_condition_container", "slideInUp")
            .then(() => {
                $("#alert_condition_container").removeClass(" slideInUp")
            });
    }

    onDismissConfirmFundFlag() {
        this.templateFundList.didClearSelectedFund();
        Utils.animate("#alert_condition_container", "slideOutDown")
            .then(() => {
                $("#alert_condition_container").hide().removeClass("slideOutDown")
            });
    }


    onClickAccept() {
        Modal.hide();
        const queryParams = {
            selectAccount: false
        };
        switch (this.transactionType) {
            case 'purchase':
            case 'redeem':
                this
                    .router
                    .navigate([
                        "kk", "investment", this.transactionType
                    ], { queryParams: queryParams });
                break;
            case 'switch_in':
                this
                    .router
                    .navigate([
                        "kk", "investment", "switch"
                    ], { queryParams: queryParams });
                break;
            case 'switch_out':
                Modal.showProgress();
                this
                    .router
                    .navigate([
                        "kk", "investment", "fundList"
                    ], { queryParams: { type: "switch_in" } });
                break;
            default:
                this
                    .router
                    .navigate(["kk"]);
        }
    }

    didClearDataList() {
        this.fundList = [];
        this.holderList = [];
        this.myPortList = [];
    }
}
