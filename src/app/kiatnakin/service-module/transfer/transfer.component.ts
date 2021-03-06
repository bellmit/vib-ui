import { Component, OnInit, AfterContentInit, ViewChild, TRANSLATIONS_FORMAT } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Transfer } from "../../_model/index";
import { TransferType, Fee_Type } from "../../_model/transfer";
import { TransactionService } from "../../_service/api/transaction.service"
import { Fee } from "../../_model/fee";
import { PaymentType } from "../../_model/transaction";
import { Utils, Environment } from "../../../share/utils";
import { isNullOrUndefined } from "util";
import { AppConstant } from "../../../share/app.constant";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { ProgressDialogComponent } from "../../_share/progress-dialog/progress-dialog.component";
import { IDatePickerConfig } from "ng2-date-picker";
import { UserService } from "../../_service/user.service";
import { DataService } from "../../_service/data.service";
import { TransferService } from "../../_service/api/transfer.service";
import { HardwareService } from "../../_service/hardware.service";
import { KeyboardService } from "../../_service/keyboard.service";
import { ToStringNumberPipe } from "../../_pipe/toStringNumber.pipe";
import * as moment from 'moment-timezone';
import { DepositTerm } from "../../_model/depositTerm";
import { PromotionTerm } from "../../_model/promotionTerm";
import { FeePickerComponent } from "../../_share/fee-picker/fee-picker.component";
import { BankAccount } from "../../_model/bankAccount";
import { AccountService } from 'app/kiatnakin/_service';
import { resolve } from 'path';
import { ValidateTransfer } from 'app/kiatnakin/_model/validateTransfer';
import { TransferCASAtoTDFund } from 'app/kiatnakin/_model/TransferCASAtoTDFund';
import { TransferTDtoCASAFund } from 'app/kiatnakin/_model/TransferTDtoCASAFund';
import { TransferTDtoTDFund } from 'app/kiatnakin/_model/TransferTDtoTDFund';
import { TdRate } from 'app/kiatnakin/_model/TdRate';
import { InvestmentService } from '../../_service/api/investment.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { MasterDataService } from "../../_service/api/master-data.service";

@Component({
    selector: 'app-transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.sass']
})
export class TransferComponent implements OnInit, AfterContentInit {

    @ViewChild('progress') progress: ProgressDialogComponent;
    @ViewChild('fee_picker') feePicker: FeePickerComponent;

    transactionCancel;
    transactionType;
    cancelFund;
    public status;
    public transferType = TransferType;
    public paymentType = PaymentType;
    public bankList: any[];
    public fundSelect: any = [];
    public fundTotalAmount: any = [];
    public fundAmount: any = [];
    public amountRedeem: any = [];
    public unitRedeem: any = [];
    public amountSwich: any = [];
    public unitSwich: any = [];
    public ignoreAccountNO: string;
    public unitHolderId: any = [];
    public resPrepareOrder: any = [];
    public dataRedeem: any = [];
    public dataSwichOut: any = [];
    public dataSwichIn: any = [];
    public dataBankccount: any = [];
    public dataFundCondition: any = [];
    public titleSelectBankAccount: string;
    public fundType: string;
    public fundTypeSwich: string;
    public paramType = '';



    public amountLabel: string;
    public unitLabel: string;
    public amountBathLabel: string;
    public unitLastLabel: string;



    public configDatePicker: IDatePickerConfig;
    public HideTxT: boolean = true;
    public btnShow: boolean = false;
    public checkFundDetail: boolean = false;
    public checkRedeemDetail: boolean = false;
    public checkSwichDetail: boolean = false;
    public checkRedeemFund: boolean = false;
    public checkSwichFundForm: boolean = false;
    public checkFundConditionRedeem: boolean = false;
    public checkSlipInvesment: boolean = false;
    public progressIsShow: boolean;
    public isSelectAccount = false;
    public showErrorRedeem = false;
    public isSelectFrom = true;
    public isShowInterBankMenu = true;
    public checkFundType = false;
    public checkTransferType = true;
    public checkPrepareBTN = false;
    public checkConfirmBTN = false;

    public checkFundToSwich = false;
    public swichAmount = true;
    public swichUnit = true;
    public swichAllUnit = true;
    public redeemAmount = true;
    public redeemUnit = true;
    public redeemAllUnit = true;
    public purchseAmount = true;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        public userService: UserService,
        private transferService: TransferService,
        private transactionService: TransactionService,
        private hardwareService: HardwareService,
        public dataService: DataService,
        private investmentService: InvestmentService,
        private masterData: MasterDataService,
        private accountService: AccountService) {
        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Transfer();
        }
        this.status = dataService.transaction.status;
        this.configDatePicker = Utils.getDatePickerOption(moment(), moment().add(3, 'd'));
    }

    ngOnInit() {
        
        console.log('init')
        
        console.log(this.dataService.transaction)
        this.fundSelect = this.investmentService.selectFund;
        this.unitHolderId = this.dataService.selectedMutualfundAccount;
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.type === 'CANCEL' && params.showSuccessWithMessage) {
                this.cancelFund = true
                setTimeout(() => {
                    this.confirmCancelFund(params);
                }, 0);
            } else if (params.type === 'REDEEM' || params.type === 'SWITCH_OUT' || params.type === 'SWITCH_IN') {
                this.paramType = params.type;
                if (params.type === 'REDEEM') {
                    this.fundType = 'SE';
                    this.dataRedeem = params;
                    this.checkRedeemFund = true;
                    this.checkTapRedeemAndSwich('redeemAmount');
                    this.getBankAccountByUniholder(params.fundId);
                } else if (params.type === 'SWITCH_OUT') {
                    this.fundType = 'SO';
                    this.dataSwichOut = this.investmentService.selectFundSwich_Out;
                    this.dataSwichIn = this.investmentService.selectFundSwich_In;
                    this.checkSwichFundForm = true;
                    this.checkTapRedeemAndSwich('swichAmount');
                    if (this.dataSwichIn.fundNameTh) {
                        this.checkFundToSwich = true;
                        this.dataService.transaction.to.bank.bg_color = 'background-purple';
                    } else {
                        this.checkFundToSwich = false;
                    }
                } else if (params.type === 'SWITCH_IN') {
                    this.fundType = 'SI';
                    this.dataSwichOut = this.investmentService.selectFundSwich_Out;
                    this.dataSwichIn = this.investmentService.selectFundSwich_In;
                    this.checkSwichFundForm = true;
                    this.checkTapRedeemAndSwich('swichAmount');
                    if (this.dataSwichIn.fundNameTh) {
                        this.checkFundToSwich = true;
                        this.dataService.transaction.to.bank.bg_color = 'background-purple';
                    } else {
                        this.checkFundToSwich = false;
                    }
                }
            }
            if (!isNullOrUndefined(params.mode)) {
                this.router.navigate(["kk", "transfer"]);
            }
        });

        this.checkFrom();
        if (!this.cancelFund) {
            this.initObject();
        }
    }

    checkFrom() {
        if (this.cancelFund) {
            this.checkFundType = false;
            this.checkTransferType = false;
        } else if (this.checkRedeemFund) {
            this.checkFundType = true;
            this.checkTransferType = false;
            this.checkFundDetail = true;
        } else if (this.checkSwichFundForm) {
            this.checkFundType = true;
            this.checkTransferType = false;
            this.checkFundDetail = true;
        } else {
            this.checkFundType = this.fundSelect.length === 0 ? false : true;
            this.checkTransferType = this.fundSelect.length === 0 ? true : false;
        }
    }

    ngAfterContentInit() {
        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 500);

        const isSelectAccount = this.activatedRoute.snapshot.queryParams["selectAccount"];
        this.dataService.isTransferFund = true;
        if (isSelectAccount && this.userService.isLoggedin()) {
            this.checkLoginFrom();
            return;
        }
        else if (!isNullOrUndefined(isSelectAccount)) {
            this.router.navigate(["kk", "transfer"]);
            return;
        }

        if (this.checkAccountNumber()) {
            $("#buttonClose").addClass("hidden-lg-up");
            Utils.animate("#container_form_transfer", "bounceInRight").then(function () {
                return Utils.animate("#div-select-account-from", "pulse");
            }).then(function () {
                $("#buttonClose").removeClass("hidden-lg-up");
            });
        }

        if (this.checkSelectAccount()) {
            if (this.dataService.dataFrom === 'NC') {
                this.dataService.transaction.to = this.dataService.selectedAccount;
                this.dataService.selectedAccount = '';
                this.dataService.dataFrom = '';
                this.dataService.transaction.toFix = true;
            }
            else if (this.dataService.dataFrom === "ENQUIRY") {
                this.router.navigate(["kk", "selectBankAccount"]);
                return
            } else {
                if (this.checkFundType || this.cancelFund) {
                    if (this.dataService.selectedAccount !== '') {
                        this.dataService.transaction.from = new BankAccount();
                        this.dataService.selectedAccount = '';
                    }
                } else {
                    this.dataService.transaction.from = this.dataService.selectedAccount;
                    this.dataService.dataFrom = '';
                    this.dataService.transaction.fromFix = true;
                }
            }
            this.dataService.transaction.fromFix = true;
            if (this.dataService.transaction.from.accountType === AppConstant.ProdTypeFix
                && isNullOrUndefined(this.dataService.transaction.selectedIndexPrincipal)) {
                this.router.navigate(["kk", "selectTDPrincipal"], { queryParams: { returnUrl: "transfer" } });
            }
        }
    }

    public checkSelectAccount() {
        return !isNullOrUndefined(this.dataService.selectedAccount) && this.dataService.selectedAccount !== '';
    }

    public checkLoginFrom() {
        if (this.dataService.transaction.loginfrom === "INTER") {
            this.onClickSelectToAccount();
            this.dataService.resetInterLogin();
        } else {
            this.onClickSelectFromAccount();
        }
    }

    public checkAccountNumber() {
        return this.dataService.transaction.to.accountNumber.length === 0 && this.dataService.transaction.from.accountNumber.length === 0;
    }

    public initObject() {
        
        setTimeout(() => {
            let lastedStatus = !isNullOrUndefined(this.dataService.transaction.currentStatus) ? this.dataService.transaction.currentStatus : this.status.inputData;
            if (lastedStatus !== this.status.inputData &&
                lastedStatus !== this.paymentType.Cash &&
                lastedStatus !== this.paymentType.FundTransfer
            ) {
                lastedStatus = this.status.inputData;
            }
            this.onMoveStep(lastedStatus);
        }, 500);

    }

    public onClickSelectFromAccount() {
        this.titleSelectBankAccount = "???????????????????????????????????????????????????????????????????????????????????????";
        this.isShowInterBankMenu = false;
        this.ignoreAccountNO = this.dataService.transaction.to.accountNumber;
        this.isSelectFrom = true;
        this.isSelectAccount = true;
    }

    public onClickSelectToAccount() {
        if (!this.dataService.transaction.toFix) {
            this.titleSelectBankAccount = "??????????????????????????????????????????????????????????????????????????????????????????";
            this.isShowInterBankMenu = true;
            this.ignoreAccountNO = this.dataService.transaction.from.accountNumber;
            this.isSelectFrom = false;
            this.isSelectAccount = true;
        }
    }

    public onSelectFee($data) {
        if (isNullOrUndefined($data)) {
            return;
        }
        this.dataService.transaction.fee.amount = $data.fee;
        this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount) + this.dataService.transaction.fee.amount;
    }

    public onSelectedAccount($selectedBankAccount) {
        this.dataService.transaction.bankaccount = $selectedBankAccount.balance
        this.isSelectAccount = false;
        this.checkAmount();
        KeyboardService.initKeyboardInputText();
        if (this.isSelectFrom) {
            if (!isNullOrUndefined($selectedBankAccount.accountType)) {
                this.checkLoginFromInter($selectedBankAccount);
            }

            if ($selectedBankAccount.accountType === AppConstant.ProdTypeFix) {
                if (this.userService.isLoggedin()) {
                    this.router.navigate(["kk", "selectTDPrincipal"], { queryParams: { returnUrl: "transfer" } });
                    if (this.dataService.transaction.to.accountType === 'INTER') {
                        this.dataService.transaction.to = new BankAccount();
                    }
                    this.updateTransferType();
                    return;
                } else {
                    this.router.navigate(["kk", "selectTDPrincipalByIndex"], { queryParams: { returnUrl: "transfer" } });
                    this.updateTransferType();
                    return;
                }
            }

            if (this.dataService.transaction.to.accountNumber === '') {
                setTimeout(() => {
                    Utils.animate("#div-select-account-to", "pulse")
                }, 100);
            }

        } else {
            if (this.dataService.transaction.from.accountNumber === '') {
                setTimeout(() => {
                    Utils.animate("#div-select-account-from", "pulse")
                }, 100);

            }
            if ($selectedBankAccount !== '') {
                this.dataService.transaction.to = $selectedBankAccount;
            } else {
                this.dataService.transaction.to = new BankAccount();
            }
            this.dataService.transaction.selectedTDTerm = null;
            this.dataService.transaction.selectedPromotionTerm = null;
            this.dataService.transaction.selectedTDTermTitle = null;
        }
        this.updateTransferType();
        const isSelectAccount = this.activatedRoute.snapshot.queryParams["selectAccount"];
        if (isSelectAccount) {
            this.router.navigate(["kk", "transfer"]);
        }
    }

    public checkAmount() {
        if (!isNullOrUndefined(this.dataService.transaction.amount) || !isNullOrUndefined(this.dataService.transaction.amountFund)) {
            this.updateFormatAmount();
        }
    }

    public checkAccountTypeFix($selectedBankAccount) {
        if (this.dataService.transaction.from.accountType === AppConstant.ProdTypeFix && $selectedBankAccount.accountType !== AppConstant.ProdTypeFix) {
            this.dataService.transaction.amount = null;
        }
    }

    public checkLoginFromInter($selectedBankAccount) {
        if (this.dataService.transaction.loginfrom === "INTER") {
            this.dataService.transaction.to = $selectedBankAccount;
            this.dataService.resetInterLogin();
        } else {

            if ($selectedBankAccount !== '') {
                this.dataService.transaction.from = $selectedBankAccount;
            } else {
                this.dataService.transaction.from = new BankAccount();
            }
        }
    }

    public async onMoveStep(step) {
        KeyboardService.initKeyboardInputText();
        this.dataService.transaction.currentStatus = step;

        if (!isNullOrUndefined(this.dataService.transaction.amount)) {
            this.dataService.transaction.amount = new ToStringNumberPipe().transform(this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.amount));
        }
        if (!isNullOrUndefined(this.dataService.transaction.amountFund)) {
            this.dataService.transaction.amountFund = new ToStringNumberPipe().transform(this.dataService.transaction.amountFund, Utils.getCountDigit(this.dataService.transaction.amountFund));
        }

        const status = this.dataService.transaction.status;
        switch (step) {
            case status.inputData:
                KeyboardService.initKeyboardInputText();

                if (this.dataService.transaction.from.accountNumber === '') {
                    setTimeout(() => {
                        Utils.animate("#div-select-account-from", "pulse")
                    }, 100);
                }
                break;
            case status.confirmation:
                this.dataService.transaction.effectiveDate = moment();
                this.updateTransferType();
                this.onGetTransactionFee();
                break;
            case this.paymentType.Cash:
            case this.paymentType.FundTransfer:
                this.dataService.transaction.paymentTypeFee = step;
                this.checkTransactionAuthen()
                break;
            case status.generateOtp:
                break;
            case status.complete:
                break;
            default:
                break
        }

    }

    public async getDateNow() {
        return new Promise((resolve, reject) => this.transferService.getdatenow().subscribe(data => {
            const date = moment(Date.parse(data.data)).format("YYYY-MM-DD");
            resolve(date)
        }, error => {
            this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
            reject()
        }
        )
        );
    }

    public async onGetTransactionFee() {
        this.dataService.transaction.totalAmount = 0;
        this.dataService.transaction.amount = Utils.toStringNumber(this.dataService.transaction.amount);
        const validate = new ValidateTransfer();
        validate.account_from = this.dataService.transaction.from.accountNumber;
        validate.account_to = this.dataService.transaction.to.accountNumber;
        validate.txn_amount = this.dataService.transaction.amount;
        if (this.dataService.transaction.transactionType === TransferType.CASA_CASA) {
            validate.txn_type = TransferType.CASA_CASA;
        } else if (this.dataService.transaction.transactionType === TransferType.CASA_TD) {
            validate.td_prod_code = this.dataService.transaction.toTermProdCode;
            validate.txn_type = TransferType.CASA_TD;
            validate.benefit_account = this.dataService.transaction.selectedAccountInterest;
        } else if (this.dataService.transaction.transactionType === TransferType.TD_CASA) {
            validate.txn_type = TransferType.TD_CASA;
        } else if (this.dataService.transaction.transactionType === TransferType.TD_TD) {
            validate.td_prod_code = this.dataService.transaction.toTermProdCode;
            validate.txn_type = TransferType.TD_TD;
            validate.benefit_account = this.dataService.transaction.selectedAccountInterest;
        } else if (this.dataService.transaction.transactionType === TransferType.CASA_InterBank) {
            validate.txn_type = TransferType.CASA_InterBank;
        }
        if (this.dataService.transaction.from.accountType !== AppConstant.ProdTypeFix && this.dataService.transaction.to.accountType !== AppConstant.ProdTypeFix) {
            this.progress.showProgressTransaction();
            this.transferService.validateTransfer(validate).subscribe((res: any) => {
                this.transferService.checkTargetFee(<Transfer>this.dataService.transaction).subscribe(
                    (fee: Fee) => {
                        this.dataService.transaction.fee = fee;
                        let receiveName = fee.ReceivingAccountDisplayName;
                        if (isNullOrUndefined(receiveName)) {
                            receiveName = '';
                        }
                        this.dataService.transaction.to.accountName = receiveName;
                        this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount)
                            + this.dataService.transaction.fee.amount;
                        this.dataService.transaction.CreditDate = Utils.convertDateAsia(this.dataService.transaction.fee.feeDetailList[0].creditDate, "MM-DD-YYYY", "DD/MM/YYYY");
                        this.dataService.transaction.DebitDate = Utils.convertDateAsia(this.dataService.transaction.fee.feeDetailList[0].debitDate, "MM-DD-YYYY", "DD/MM/YYYY");
                        this.progress.hide();
                    }, error => {
                        this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    });
            }, error => {
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
            });
        } else {
            if (this.dataService.transaction.transactionType === TransferType.CASA_TD ||
                this.dataService.transaction.transactionType === TransferType.TD_TD) {
                this.progress.showProgressTransaction();
                this.transferService.validateTransfer(validate).subscribe((res: any) => {
                    const tdRateReq = new TdRate;
                    tdRateReq.issueDate = this.dataService.transaction.transactionDateTime.format("YYYY-MM-DD");
                    tdRateReq.productCode = this.dataService.transaction.toTermProdCode;
                    tdRateReq.tdGroupNumber = this.dataService.transaction.to.accountNumber;
                    tdRateReq.term = this.dataService.transaction.toTermId;
                    tdRateReq.termCode = this.dataService.transaction.toTermCode;
                    tdRateReq.txnAmount = this.dataService.transaction.amount;
                    this.transactionService.getTDRate(tdRateReq).subscribe((rate: any) => {
                        const varianceRate = rate.data.varianceRate;
                        const netRate = rate.data.netRate;
                        const net = rate.data.net;
                        this.dataService.transaction.fee.detail.transferType = Fee_Type.ANYID_ONUS;
                        this.dataService.transaction.interestRate = netRate;
                        this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount);
                        this.progress.hide();
                    },
                        error => {
                            this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                        }
                    );
                },
                    error => {
                        this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    }
                );

            } else if (this.dataService.transaction.transactionType === TransferType.TD_CASA) {
                this.transferService.validateTransfer(validate).subscribe((res: any) => {
                    this.dataService.transaction.fee.detail.transferType = Fee_Type.ANYID_ONUS;
                    this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount); // + this.dataService.transaction.fee.amount;
                },
                    error => {
                        this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    }
                );
            }
        }
    }

    public onClickSubmit() {
        const transferType = (<Transfer>this.dataService.transaction).transactionType;
        this.HideTxT = false;
        this.btnShow = false;
        if (transferType === TransferType.CASA_InterBank) {
            if (this.dataService.transaction.to.bank.code !== '069') {
                this.btnShow = true;
            }
        }
        if (transferType === TransferType.CASA_TD
            || transferType === TransferType.TD_TD) {
            if (isNullOrUndefined(this.dataService.transaction.selectedAccountInterest)) {
                Modal.showAlert("?????????????????????????????? ????????????????????????????????????????????????");
                return;
            }
            if (isNullOrUndefined(this.dataService.transaction.selectedTDTerm)
                || isNullOrUndefined(this.dataService.transaction.selectedFrequency)) {
                Modal.showAlert("?????????????????????????????? ???????????????????????????, ???????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????");
                return;
            }
        }
        this.onMoveStep(this.status.confirmation);
    }

    public redirectToMain() {
        const that = this;
        if (this.dataService.transaction.currentStatus === this.status.inputData ||
            this.dataService.transaction.currentStatus === this.status.confirmation) {
            Utils.animate("#container_form_transfer", "bounceOutRight").then(() => {
                that.router.navigate(["/kk"]);
            });
        }
        if (this.dataService.transaction.currentStatus === this.status.complete) {
            that.router.navigate(["/kk"]);
        }
    }

    public onClickBack() {
        if (this.progress && this.progress.isShowing()) {
            this.progress.hide();
            this.onMoveStep(this.status.inputData);
            return;
        }
        const that = this;
        if (this.isSelectAccount) {
            this.onSelectedAccount('');
        } else if (this.dataService.transaction.currentStatus === this.status.inputData ||
            this.dataService.transaction.currentStatus === this.status.complete) {
            this.dataService.resetInterLogin();
            if (this.dataService.transaction.fromFix && !this.checkFundType) {
                this.router.navigate(["/kk/", "transactionBank"], { replaceUrl: true });
                this.dataService.resetTransactionData();
            } else {
                Modal.showConfirmWithButtonText(Modal.title.exit, "?????????", "??????????????????", function () {
                    if (that.checkFundType) {
                        if (that.checkRedeemFund || that.checkRedeemDetail) {
                            that.router.navigate(["kk", "fund-management", "redeem"]);
                            that.dataService.transaction.amountRedeem = null;
                            that.dataService.transaction.unitRedeem = null;
                            that.dataService.transaction.to = new BankAccount();
                        } else if (that.paramType === 'SWITCH_OUT' || that.paramType === 'SWITCH_IN') {
                            that.dataSwichOut = [];
                            that.dataSwichIn = [];
                            that.dataService.transaction.amountSwich = null;
                            that.dataService.transaction.unitSwich = null;
                            that.dataService.transaction.amountSwich = null;
                            that.dataService.transaction.unitSwich = null;
                            const queryParams = { type: 'switch_out' };
                            that.router.navigate(["kk", "fund-management", "switch_out"], { queryParams: queryParams });
                        } else {
                            that.router.navigate(["kk", "fund-management", "purchase"]);
                            that.dataService.transaction.amountFund = null;
                            that.dataService.transaction.from = new BankAccount();
                        }
                    } else {
                        that.redirectToMain();
                    }
                    that.dataService.transaction.currentStatus = null;
                }, null);
            }
        } else {
            if (this.dataService.transaction.currentStatus === this.status.confirmation ||
                this.dataService.transaction.currentStatus === this.status.generateOtp) {
                this.onMoveStep(this.status.inputData)
            }
        }
    }

    public onClickClose() {
        this.investmentService.selectFund = '';
        if (this.userService.isLoggedin()) {
            const that = this;
            Modal.showConfirmWithButtonText(Modal.title.continue, "?????????????????????????????????", "??????????????????????????????", () => {
                that.redirectToMain();
            }, function () {
                that.dataService.isAcceptedTermMutualFund = false;
                that.userService.logout();
            });
        } else {
            this.redirectToMain();
        }
    }

    public checkTransactionAuthen() {
        if (this.dataService.isAuthenticated) {
            this.onConfirmTransfer();
            return
        }
        this.progress.showProgressTransaction();
        const isSameCIF = this.dataService.transaction.to.custCif === this.dataService.transaction.from.custCif;
        const amount = this.dataService.transaction.amount;
        const authenFactor1 = this.userService.getAuthenFactor1();
        const that = this;
        this.transactionService.CheckTransactionAuthentication("Transfer", isSameCIF, amount, authenFactor1).subscribe(
            Data => {
                this.dataService.authenList = null;
                const authenEqual: boolean = Data.data.authenEqual;
                if (authenEqual === true) {
                    this.onConfirmTransfer();
                    return
                }
                const requireOtp = Data.data.requireOtp;
                if (requireOtp === true) {
                    this.router.navigate(["kk", "login"], { queryParams: { 'returnUrl': "transfer", 'mode': 'authenticate-factor2' } });
                    return
                }
                that.dataService.authenList = Data.data.authenLists;
                if (!isNullOrUndefined(this.dataService.authenList) && this.dataService.authenList.length > 0) {
                    this.router.navigate(["kk", "login"], { queryParams: { 'returnUrl': "transfer", 'mode': 'authenticate' } });
                }
                else {
                    this.onConfirmTransfer()
                }
            },
            error => {
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                this.dataService.transaction = new Transfer();
            }
        )
    }

    public resetAuthen() {
        this.dataService.isAuthenticated = false;
    }

    public onConfirmTransfer() {
        const that = this;
        this.progress.showProgressTransaction();

        setTimeout(() => {
            const transferType = (<Transfer>this.dataService.transaction).transactionType;
            (<Transfer>this.dataService.transaction).ottValue = this.dataService.tokenOtt;

            if (transferType === TransferType.CASA_CASA || transferType === TransferType.CASA_InterBank) {
                this.transactionService.transferfund(<Transfer>this.dataService.transaction).subscribe(Data => {
                    $("#buttonBack").hide();
                    that.progress.showSuccessWithMessage("??????????????????????????????????????????");
                    const datetime_day = moment(Data.data.receiveDateTime, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
                    const datetime_time = moment(Data.data.receiveDateTime, 'DD/MM/YYYY HH:mm:ss').locale('th').format('HH:mm');
                    this.dataService.transaction.referenceNo = Data.header.referenceNo;
                    this.dataService.transaction.transactionDateTime.day = datetime_day;
                    this.dataService.transaction.transactionDateTime.time = datetime_time;
                    this.dataService.transaction.balanceAvailable = Data.data.accountDetailAvailBalance;
                    this.dataService.transaction.accountDetailAvailBalanceNet = Data.data.accountDetailAvailBalanceNet;
                    this.showPrinter();
                    this.transferService.resendMachineOtt().subscribe(data => {
                        this.dataService.tokenOtt = data.data.ott;
                    },
                        errorRes => {
                            this.progress.showErrorWithMessage(errorRes.responseStatus.responseMessage);
                        }
                    );
                }, error => {
                    that.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    this.dataService.transaction = new Transfer();
                    this.userService.clearUserAuthen()
                    this.resetAuthen();
                    this.transferService.resendMachineOtt().subscribe(data => {
                        this.dataService.tokenOtt = data.data.ott;
                    },
                        errorRes => {
                            this.progress.showErrorWithMessage(errorRes.responseStatus.responseMessage);
                        }
                    );
                }
                );
            } else if (transferType === TransferType.CASA_TD) {
                const casaToReq = new TransferCASAtoTDFund();
                casaToReq.benefit_account = this.dataService.transaction.selectedAccountInterest;
                casaToReq.casa_account_number = this.dataService.transaction.from.accountNumber;
                casaToReq.int_term = this.dataService.transaction.toFrequencyTermId;
                casaToReq.int_term_code = this.dataService.transaction.toFrequencyTermCode;
                casaToReq.placement_amount = this.dataService.transaction.amount;
                casaToReq.product_code = this.dataService.transaction.toTermProdCode;
                casaToReq.td_group_number = this.dataService.transaction.to.accountNumber;
                casaToReq.teller_id = '';
                casaToReq.term = this.dataService.transaction.toTermId;
                casaToReq.term_code = this.dataService.transaction.toTermCode;
                this.transferService.transferCASAtoTDFund(casaToReq).subscribe(Data => {
                    $("#buttonBack").hide();
                    that.progress.showSuccessWithMessage("??????????????????????????????????????????");
                    const datetime_day = moment(Data.data.txn_date, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
                    const datetime_time = moment(Data.data.txn_date, 'DD/MM/YYYY HH:mm:ss').locale('th').format('HH:mm');
                    this.dataService.transaction.referenceNo = Data.header.referenceNo;
                    this.dataService.transaction.transactionDateTime.day = datetime_day;
                    this.dataService.transaction.transactionDateTime.time = datetime_time;
                    this.dataService.transaction.balanceAvailable = Data.data.available_balance;
                    this.dataService.transaction.accountDetailAvailBalanceNet = Data.data.available_balance_net;
                    this.onPostFee();
                },
                    error => {
                        that.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                        this.dataService.transaction = new Transfer();
                        this.userService.clearUserAuthen();
                        this.resetAuthen();
                    });
            } else if (transferType === TransferType.TD_CASA) {
                const tdToCasaReq = new TransferTDtoCASAFund();
                tdToCasaReq.casa_account = this.dataService.transaction.to.accountNumber;
                tdToCasaReq.fee_amount = '0';
                tdToCasaReq.placement_number = this.dataService.transaction.tdGPlacementNumber;
                tdToCasaReq.accrued_int = '';
                tdToCasaReq.penalty_amount = this.dataService.transaction.penaltyForEarlyRedeem;
                tdToCasaReq.redemption_flag = 'F';
                tdToCasaReq.settle_amount = this.dataService.transaction.amount;
                tdToCasaReq.teller_id = '';
                tdToCasaReq.txn_amount = this.dataService.transaction.amount;
                tdToCasaReq.withholding_tax_amount = this.dataService.transaction.witholdingTax;
                this.transferService.transferTDtoCASAFund(tdToCasaReq).subscribe(Data => {
                    $("#buttonBack").hide();
                    that.progress.showSuccessWithMessage("??????????????????????????????????????????");
                    const datetime_day = moment(Data.data.txn_date, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
                    const datetime_time = moment(Data.data.txn_date, 'DD/MM/YYYY HH:mm:ss').locale('th').format('HH:mm');
                    this.dataService.transaction.referenceNo = Data.header.referenceNo;
                    this.dataService.transaction.transactionDateTime.day = datetime_day;
                    this.dataService.transaction.transactionDateTime.time = datetime_time;
                    this.onPostFee();
                },
                    error => {
                        that.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                        this.dataService.transaction = new Transfer();
                        this.userService.clearUserAuthen();
                        this.resetAuthen();
                    }
                );
            } else if (transferType === TransferType.TD_TD) {

                const tdToTdReq = new TransferTDtoTDFund();
                tdToTdReq.benefit_account = this.dataService.transaction.selectedAccountInterest;
                tdToTdReq.int_term = this.dataService.transaction.toFrequencyTermId;
                tdToTdReq.int_term_code = this.dataService.transaction.toFrequencyTermCode;
                tdToTdReq.placement_amount = this.dataService.transaction.amount;
                tdToTdReq.penalty_amount = this.dataService.transaction.penaltyForEarlyRedeem;
                tdToTdReq.placement_number = this.dataService.transaction.tdGPlacementNumber;
                tdToTdReq.product_code = this.dataService.transaction.toTermProdCode;
                tdToTdReq.td_group_number = this.dataService.transaction.to.accountNumber;
                tdToTdReq.teller_id = '';
                tdToTdReq.term = this.dataService.transaction.toTermId;
                tdToTdReq.term_code = this.dataService.transaction.toTermCode;
                tdToTdReq.withholding_tax_amount = this.dataService.transaction.witholdingTax;
                this.transferService.transferTDtoTDFund(tdToTdReq).subscribe(Data => {
                    $("#buttonBack").hide();
                    that.progress.showSuccessWithMessage("??????????????????????????????????????????");
                    const datetime_day = moment(Data.data.txn_date, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
                    const datetime_time = moment(Data.data.txn_date, 'DD/MM/YYYY HH:mm:ss').locale('th').format('HH:mm');
                    this.dataService.transaction.referenceNo = Data.header.referenceNo;
                    this.dataService.transaction.transactionDateTime.day = datetime_day;
                    this.dataService.transaction.transactionDateTime.time = datetime_time;
                    this.onPostFee();
                },
                    error => {
                        that.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                        this.dataService.transaction = new Transfer();
                        this.userService.clearUserAuthen();
                        this.resetAuthen();
                    });
            }
        }, 500);
    }


    public onPostFee() {
        if (this.dataService.transaction.fee.amount > 0) {
            if (this.dataService.transaction.paymentTypeFee === this.paymentType.FundTransfer) {
                this.onPayFeesFromCASA();
            } else if (this.dataService.transaction.paymentTypeFee === this.paymentType.Cash) {
                this.onPayFees();
            }
        } else if (this.dataService.transaction.fee.amount === 0) {
            this.showPrinter();
        }
    }

    public onPayFeesFromCASA() {
        this.transactionService.PayFeesFromCASA(this.dataService.transaction).subscribe(Data => {
            this.showPrinter();
        },
            error => {
                this.onMoveStep(this.status.inputData);
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                setTimeout(() => {
                    this.progress.hide();
                }, 2500);
            });
    }

    public onPayFees() {
        this.transactionService.PayFees(this.dataService.transaction).subscribe(Data => {
            this.showPrinter();
        },
            error => {
                this.onMoveStep(this.status.inputData);
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                setTimeout(() => {
                    this.progress.hide();
                }, 2500);
            });
    }

    public showPrinter() {
        setTimeout(() => {
            this.progress.hide();
            this.onMoveStep(this.status.complete);
        }, 2500);
    }

    public async updateTransferType() {
        (<Transfer>this.dataService.transaction).updateTransferType();
        KeyboardService.initKeyboardInputText();
    }

    public updateFormatAmount() {
        this.dataService.transaction.amount = new ToStringNumberPipe().transform(this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.amount));
        if (!isNullOrUndefined(this.dataService.transaction.amountFund)) {
            this.dataService.transaction.amountFund = new ToStringNumberPipe().transform(this.dataService.transaction.amountFund, Utils.getCountDigit(this.dataService.transaction.amountFund));
        }
        if (!isNullOrUndefined(this.dataService.transaction.amountRedeem)) {
            this.dataService.transaction.amountRedeem = new ToStringNumberPipe().transform(this.dataService.transaction.amountRedeem, Utils.getCountDigit(this.dataService.transaction.amountRedeem));
        }
        if (!isNullOrUndefined(this.dataService.transaction.amountSwich)) {
            this.dataService.transaction.amountSwich = new ToStringNumberPipe().transform(this.dataService.transaction.amountSwich, Utils.getCountDigit(this.dataService.transaction.amountSwich));
        }
    }

    public isSelectTerm() {
        if (this.dataService.transaction.to.accountType === AppConstant.ProdTypeFix) {
            return !isNullOrUndefined(this.dataService.transaction.selectedTDTerm)
                || !isNullOrUndefined(this.dataService.transaction.selectedTermProduct)
                || !isNullOrUndefined(this.dataService.transaction.selectedFrequency)
        }
        return true;
    }

    public isInputAmount(value) {
        if (isNullOrUndefined(value)) {
            return false;
        }
        value = value.split(',').join('');
        const isNumber = !isNaN(value);
        if (isNumber) {
            const number = Number(value);
            if (this.dataService.transaction.to.accountType === 'T') {
                return number >= 5000;
            }
            return number > 0;
        }
        return false;
    }

    // PREOARE PURCHASE FUND ORDER
    public prepareFundOrder(type) {
        console.log(type)
        this.checkPrepareBTN = true;
        this.dataService.transaction.fee.amountFund = 0
        if (type === 'PURCHASE') {
            this.fundAmount = Number(this.dataService.transaction.amountFund.split(',').join(''));
            let bankBlance = Number(this.dataService.transaction.bankaccount);
            if (bankBlance < this.fundAmount) {
                this.progress.showErrorWithMessage("??????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????");
                this.checkPrepareBTN = false;
                return
            }
            this.totalAmount(this.dataService.transaction.amountFund);
            this.investmentService.getPrepareOrder(this.dataService.transaction.amountFund.split(',').join(''), this.fundSelect, this.dataService.transaction.from, this.unitHolderId.unitHolderId, 'BU').subscribe(response => {
                this.resPrepareOrder = response.data.prepareOrderDetail
                this.checkFundDetail = true;
            }, error => {
                this.checkPrepareBTN = false;
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                this.userService.clearUserAuthen();
                this.resetAuthen();
            });
        } else if (type === 'REDEEM') {
            this.totalAmount(this.dataService.transaction.amountRedeem);
            this.amountRedeem = this.dataService.transaction.amountRedeem === '' || this.dataService.transaction.amountRedeem === undefined ? '' : this.dataService.transaction.amountRedeem.split(',').join('')
            this.unitRedeem = this.dataService.transaction.unitRedeem === '' || this.dataService.transaction.unitRedeem === undefined ? '' : this.dataService.transaction.unitRedeem.split(',').join('')
            this.investmentService.getPrepareOrder(this.amountRedeem, this.dataRedeem, this.dataService.transaction.to, this.unitHolderId.unitHolderId, 'SE', this.unitRedeem).subscribe(response => {
                this.resPrepareOrder = response.data.prepareOrderDetail
                this.checkFundDetail = true;
                this.redeemFundRedeem()
            }, error => {
                //put number format
                let amoountArr = this.amountRedeem.split('.'),
                    unitArr = this.unitRedeem.split('.')
                this.dataService.transaction.amountRedeem = `${amoountArr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${amoountArr[1] ? "."+(amoountArr[1]+"").slice(0,2) : ''}`
                this.dataService.transaction.unitRedeem = `${unitArr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${unitArr[1] ? "."+(unitArr[1]+"").slice(0,4) : ''}`
                
                this.checkPrepareBTN = false;
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                this.userService.clearUserAuthen();
                this.resetAuthen();
            });
        } else if (type === 'SWICH') {
            this.totalAmount(this.dataService.transaction.amountSwich)
            this.amountSwich = this.dataService.transaction.amountSwich === '' || this.dataService.transaction.amountSwich === undefined ? '' : this.dataService.transaction.amountSwich.split(',').join('')
            this.unitSwich = this.dataService.transaction.unitSwich === '' || this.dataService.transaction.unitSwich === undefined ? '' : this.dataService.transaction.unitSwich.split(',').join('')
            this.investmentService.getPrepareOrder(this.amountSwich, this.dataSwichOut, this.dataService.transaction.to, this.unitHolderId.unitHolderId, 'SW', this.unitSwich, this.dataSwichIn).subscribe(response => {
                this.resPrepareOrder = response.data.prepareOrderDetail
                this.checkFundDetail = true;
                this.checkSwichDetail = true;
                this.checkRedeemDetail = false;
                this.checkSwichFundForm = false;
            }, error => {
                //put number format
                let amoountArr = this.amountSwich.split('.'),
                    unitArr = this.unitSwich.split('.')
                this.dataService.transaction.amountSwich = `${amoountArr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${amoountArr[1] ? "."+(amoountArr[1]+"").slice(0,2) : ''}`
                this.dataService.transaction.unitSwich = `${unitArr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${unitArr[1] ? "."+(unitArr[1]+"").slice(0,4) : ''}`
                this.checkPrepareBTN = false;
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                this.userService.clearUserAuthen();
                this.resetAuthen();
            });
        }
    }

    // SUM TOTAL AMOUNT
    totalAmount(amount) {
        this.dataService.transaction.fundTotalAmount = Number(amount.split(',').join('')) + this.dataService.transaction.fee.amountFund;
    }

    // CONFIRM PURCHASE FUND
    public confirmPurchaseFund() {
        this.checkConfirmBTN = true;
        this.progress.showProgressTransaction();
        this.investmentService.confirmOrder(this.resPrepareOrder).subscribe(response => {
            $("#buttonBack").hide();
            this.progress.showSuccessWithMessage("??????????????????????????????????????????");
            const datetime_day = moment(response.data.confirmOrderDetail.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
            const datetime_time = moment(response.data.confirmOrderDetail.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format('HH:mm');
            this.dataService.transaction.referenceNo = response.data.confirmOrderDetail.mutualFundRef;
            this.dataService.transaction.transactionDateTime.day = datetime_day;
            this.dataService.transaction.transactionDateTime.time = datetime_time;
            this.dataService.transaction.unitHolder = this.unitHolderId;
            this.dataService.transaction.effectiveDate = response.data.confirmOrderDetail.effectiveDate;
            this.dataService.transaction.fundCode = this.fundSelect[0].fundCode
            this.dataService.transaction.fundNameEn = this.fundSelect[0].fundNameEn
            this.dataService.transaction.status = response.responseStatus.responseMessage
            this.dataService.transaction.amountFund = this.fundAmount
            setTimeout(() => {
                this.transactionType = 'Purchase'
                this.progress.hide();
                this.checkSlipInvesment = true;
                this.checkFundType = false;
                this.checkTransferType = false;
                this.investmentService.selectFund = [];
            }, 2500);
        }, error => {
            this.checkConfirmBTN = false;
            this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
            this.userService.clearUserAuthen();
            this.resetAuthen();
        });
    }

    // CONFIRM CANCEL FUND
    public confirmCancelFund(params) {
        this.progress.showProgressTransaction();
        $("#buttonBack").hide();
        this.progress.showSuccessWithMessage("??????????????????????????????????????????");
        this.dataService.transaction.transactionDateTime.day = params.momentDate;
        this.dataService.transaction.transactionDateTime.time = params.momentTime;
        this.dataService.transaction.referenceNo = params.mutualFundRef;
        this.dataService.transaction.unitHolder = this.unitHolderId;
        this.dataService.transaction.effectiveDate = params.effectiveDate;
        this.dataService.transaction.from.accountNumber = params.accountNo;
        this.dataService.transaction.fundCode = params.fundCode;
        this.dataService.transaction.toFundCode = params.toFundCode;
        this.dataService.transaction.amountFund = Number(params.amount);
        this.dataService.transaction.unitFund = Number(params.unit);
        this.dataService.transaction.transType = params.transType;
        this.dataService.transaction.fee.amountFund = '0.00'
        this.dataService.transaction.status = '??????????????????'

        setTimeout(() => {
            this.transactionCancel = true
            this.transactionType = params.transType + ' Cancel'
            this.progress.hide();
            this.checkSlipInvesment = true;
            this.checkFundType = false;
            this.checkTransferType = false;
            this.cancelFund = false;
        }, 2500);
    }

    // CHECK FUND SHOW FROM TO REDEEM
    redeemFundRedeem() {
        this.checkFundDetail = true;
        this.checkRedeemDetail = true
        this.checkRedeemFund = false
        this.checkFundConditionRedeem = false
        this.checkFundType = true;
    }

    // CONFIRM REDEEM FUND
    confirmRedeemFund() {
        this.checkConfirmBTN = true;
        this.progress.showProgressTransaction();
        this.progress.showSuccessWithMessage("??????????????????????????????????????????");
        this.investmentService.confirmOrder(this.resPrepareOrder).subscribe(response => {
            $("#buttonBack").hide();
            this.progress.showSuccessWithMessage("??????????????????????????????????????????");
            const datetime_day = moment(response.data.confirmOrderDetail.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
            const datetime_time = moment(response.data.confirmOrderDetail.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format('HH:mm');
            this.dataService.transaction.referenceNo = response.data.confirmOrderDetail.mutualFundRef;
            this.dataService.transaction.transactionDateTime.day = datetime_day;
            this.dataService.transaction.transactionDateTime.time = datetime_time;
            this.dataService.transaction.unitHolder = this.unitHolderId;
            this.dataService.transaction.effectiveDate = response.data.confirmOrderDetail.effectiveDate;
            this.dataService.transaction.fundCode = this.dataRedeem.fundCode
            this.dataService.transaction.fundNameEn = this.dataRedeem.fundNameEn
            this.dataService.transaction.status = '??????????????????'
            this.dataService.transaction.amountRedeem = this.amountRedeem;
            this.dataService.transaction.unitRedeem = this.unitRedeem;
            this.dataService.transaction.fee.amountRedeem = '0.00';
            setTimeout(() => {
                this.transactionType = 'REDEEM'
                this.progress.hide();
                this.checkSlipInvesment = true;
                this.checkFundType = false;
                this.checkTransferType = false;
            }, 2500);
        }, error => {
            this.checkConfirmBTN = false;
            this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
            this.userService.clearUserAuthen();
            this.resetAuthen();
        });
    }

    // CONFIRM SWICH FUND
    public confirmSwichFund() {
        this.checkConfirmBTN = true;
        this.progress.showProgressTransaction();
        this.investmentService.confirmOrder(this.resPrepareOrder).subscribe(response => {
            $("#buttonBack").hide();
            this.progress.showSuccessWithMessage("??????????????????????????????????????????");
            const datetime_day = moment(response.data.confirmOrderDetail.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format('DD/MM/YYYY');
            const datetime_time = moment(response.data.confirmOrderDetail.txnDate, 'DD/MM/YYYY HH:mm:ss').locale('th').format('HH:mm');
            this.dataService.transaction.referenceNo = response.data.confirmOrderDetail.mutualFundRef;
            this.dataService.transaction.transactionDateTime.day = datetime_day;
            this.dataService.transaction.transactionDateTime.time = datetime_time;
            this.dataService.transaction.unitHolder = this.unitHolderId;
            this.dataService.transaction.effectiveDate = response.data.confirmOrderDetail.effectiveDate;
            this.dataService.transaction.to.fundCode = this.dataSwichIn.fundCode
            this.dataService.transaction.to.fundNameEn = this.dataSwichIn.fundNameEn
            this.dataService.transaction.from.fundCode = this.dataSwichOut.fundCode
            this.dataService.transaction.from.fundNameEn = this.dataSwichOut.fundNameEn
            this.dataService.transaction.status = response.responseStatus.responseMessage
            this.dataService.transaction.amountSwich = this.amountSwich
            this.dataService.transaction.unitSwich = this.unitSwich
            this.dataService.transaction.fee.amountSwich = '0.00';
            setTimeout(() => {
                this.transactionType = 'SWITCH'
                this.progress.hide();
                this.checkSlipInvesment = true;
                this.checkFundType = false;
                this.checkTransferType = false;
                this.investmentService.selectFund = [];
            }, 2500);
        }, error => {
            this.checkConfirmBTN = false;
            this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
            this.userService.clearUserAuthen();
            this.resetAuthen();
        });
    }

    // GET ACCOUNT BANK BY UNIHOLDER FROM REDEEM
    getBankAccountByUniholder(fundId) {
        this.investmentService.getBankAccountByUniholder(fundId).subscribe(response => {
            if (response.header.success) {
                this.dataBankccount = response.data.unitHolder.filter(res => {
                    return res.unitHolderId === this.dataRedeem.unitholderId;
                });
                this.setAccountBankRedeem(this.dataBankccount[0].bankCode)
            }
        })
    }

    // SET MAP ACCOUNT BANK BY BANK CODE FROM REDEEM 
    setAccountBankRedeem(bankCode) {
        this.masterData.getMasterBank().subscribe(bankList => {
            this.bankList = bankList;
            this.bankList = bankList.filter(bank => bank.code === bankCode);
            this.dataService.transaction.to.bank.bg_color = this.bankList[0].bg_color
            this.dataService.transaction.to.bank.font_color = this.bankList[0].font_color
            this.dataService.transaction.to.bank.image = this.bankList[0].image
            this.dataService.transaction.to.bank.name = this.bankList[0].name
            this.dataService.transaction.to.unitHolderName = this.dataBankccount[0].unitHolderName
            this.dataService.transaction.to.accountNumber = this.dataBankccount[0].bankAccount
            this.dataService.transaction.to.bank.code = bankCode
            this.dataService.transaction.to.branchCode = this.dataBankccount[0].branchCode || ''
        }, error => {
            Modal.showAlert(error.responseStatus.responseMessage);
        });
    }

    // CHECK BUTTON TAPS INPUT AMOUNT || UNIT REDEEM AND SWICH FUND
    checkTapRedeemAndSwich(type) {
        switch (type) {
            case 'redeemAmount':
                this.dataService.transaction.amountRedeem = '';
                this.dataService.transaction.unitRedeem = '';
                this.redeemAmount = true;
                this.redeemUnit = false;
                this.redeemAllUnit = false;
                break;
            case 'redeemUnit':
                this.dataService.transaction.amountRedeem = '';
                this.dataService.transaction.unitRedeem = '';
                this.redeemUnit = true;
                this.redeemAmount = false;
                this.redeemAllUnit = false;
                break;
            case 'redeemAllUnit':
                this.dataService.transaction.unitRedeem = Utils.toStringNumber(this.dataRedeem.availableBalanceUnitForSell.toString());
                this.dataService.transaction.amountRedeem = '';
                this.redeemAllUnit = true;
                this.redeemAmount = false;
                this.redeemUnit = false;
                break;
            case 'swichAmount':
                this.dataService.transaction.amountSwich = '';
                this.dataService.transaction.unitSwich = '';
                this.swichAmount = true;
                this.swichUnit = false;
                this.swichAllUnit = false;
                break;
            case 'swichUnit':
                this.dataService.transaction.amountSwich = '';
                this.dataService.transaction.unitSwich = '';
                this.swichUnit = true;
                this.swichAmount = false;
                this.swichAllUnit = false;
                break;
            case 'swichAllUnit':
                this.dataService.transaction.unitSwich = Utils.toStringNumber(this.dataSwichOut.availableBalanceUnitForSell.toString());
                this.dataService.transaction.amountSwich = '';
                this.swichAllUnit = true;
                this.swichAmount = false;
                this.swichUnit = false;
                break;
            default:
        }
    }

    // BACK TO FUND LIST
    onClickBackToFundList(type) {
        if (type === 'REDEEM') {
            const queryParams = { type: 'redeem' };
            this.router.navigate(["kk", "fund-management", "redeem"], { queryParams: queryParams });
        } else if (type === 'PURCHASE') {
            this.router.navigate(["kk", "fund-management", "purchase"]);
        } else if (type === 'SWITCH_OUT') {
            const queryParams = { type: 'switch_out' };
            this.router.navigate(["kk", "fund-management", "switch_out"], { queryParams: queryParams });
        } else if (type === 'SWITCH_IN') {
            const queryParams = { type: 'switch_in', swich_out_fundId: this.dataSwichOut.fundId };
            this.router.navigate(["kk", "fund-management", "switch_in"], { queryParams: queryParams });
        }
    }

    // BACK TO POPOLIO
    onClickBackToTransactionMutualfund(type) {
        if (type === 'REDEEM') {
            this.router.navigate(['kk', 'transactionMutualfund']);
        } else if (type === 'PURCHASE') {
            this.router.navigate(["kk", "fund-management", "purchase"]);
        } else if (type === 'SWITCH_OUT') {
            const queryParams = { type: 'switch_out' };
            this.router.navigate(["kk", "fund-management", "switch_out"], { queryParams: queryParams });
        } else if (type === 'SWITCH_IN') {
            const queryParams = { type: 'switch_in', swich_out_fundId: this.dataSwichOut.fundId };
            this.router.navigate(["kk", "fund-management", "switch_in"], { queryParams: queryParams });
        }
    }
}
