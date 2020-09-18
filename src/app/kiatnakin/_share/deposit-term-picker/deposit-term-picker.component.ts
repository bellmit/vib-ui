import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { TransactionService } from "../../_service/api/transaction.service"
import { DataService } from "../../_service/data.service";
import { DepositTerm } from "../../_model/depositTerm";
import { UserService } from "../../_service/user.service";
import { AppConstant } from "../../../share/app.constant";
import { isNullOrUndefined } from "util";
import { Modal } from "../modal-dialog/modal-dialog.component";
import { PromotionTerm } from "../../_model/promotionTerm";
import { ProgressDialogComponent } from "../progress-dialog/progress-dialog.component";
import { Utils } from "../../../share/utils";
import { AccountService } from 'app/kiatnakin/_service';
import { BankAccount } from 'app/kiatnakin/_model';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'deposit-term-picker',
    templateUrl: './deposit-term-picker.component.html',
    styleUrls: ['./deposit-term-picker.component.sass']
})

export class DepositTermPickerComponent implements OnInit {

    @ViewChild('progress') progress: ProgressDialogComponent;

    @Input() accountNumber: string;
    @Input() transactionDate: any;

    public listTdTerm: any;
    public productList: any = new Array();
    public termList: any = new Array();
    public frequencyList: any = new Array();
    public divProduct;
    public divTerm;
    public divFrequency;
    public options = {
        horizontal: true,

        //Item base navigation
        itemNav: 'centered', // 'basic','centered','forceCentered'
        smart: true,
        activateOn: 'click',
        activateMiddle: true,

        //Scrolling
        scrollBy: 0,
        speed: 1200,
        easing: 'easeOutExpo',

        //Dragging
        mouseDragging: true,
        touchDragging: true,
        releaseSwing: true,
        elasticBounds: false,
        dragHandle: true,
        dynamicHandle: true,
        clickBar: false
    };
    public selectedProduct: any;
    public selectedTerm: any;
    public selectedFrequency: any;
    public ckSelectedProduct = false;
    public ckSelectedTerm = false;
    public ckSelectedFrequency = false;

    // for popup selector account
    public showSelector: boolean = false;
    public titleTypeList: string = "test";
    public dataList = [];
    public selected: string;
    public ActiveNow: any[];
    public RespondCode: string = "";
    public selectedAccountInterest = "accountInterest";
    progressIsShow;
    public showInputAccountInterest: boolean = false;

    constructor(private transactionService: TransactionService,
        public userService: UserService,
        public dataService: DataService,
        private accountService: AccountService,
        private translate: TranslateService) {
    }

    ngOnInit() {
        this.divProduct = $('#div-product');
        this.divTerm = $('#div-term');
        this.divFrequency = $('#div-frequency');
    }

    public initObject(forElement: string) {

        if (forElement === 'all') {
            this.divProduct.show();
            this.divTerm.show();
            this.divFrequency.show();

            this.initDivProduct();
            this.initDivTerm();
            this.initDivFrequency();
            return;
        }

        if (forElement === 'term') {
            this.divTerm.show();
            this.divFrequency.show();

            this.initDivTerm();
            this.initDivFrequency();
            return;
        }

        if (forElement === 'frequency') {
            this.divFrequency.show();

            this.initDivFrequency();
        }

        // this.selectedProduct = null;
        // this.selectedFrequency = null;
        // this.selectedTerm = null;
    }

    initDivProduct() {

        const that = this;
        this.divProduct.sly(false);
        this.divProduct.sly(this.options);
        this.divProduct.sly('on', 'active', function (e, index) {
            $('#ui-term').css('width', '3000px');
            $('#ui-frequency').css('width', '3000px');

            setTimeout(() => {
                that.ckSelectedProduct = true;
                that.ckSelectedTerm = false;
                that.ckSelectedFrequency = false;
                that.selectedProduct = undefined;
                that.selectedTerm = undefined;
                that.selectedFrequency = undefined;
                that.selectedProduct = that.productList[index];
                that.dataService.transaction.toTermProdCode = that.selectedProduct.ProductCode;

                that.termList = that.productList[index].DepositTermList.DepositTerm;
                that.selectedTerm = that.termList[index];

                that.frequencyList = that.termList[0].InterestTermList.InterestTerm;
                that.selectedFrequency = that.frequencyList[index]

                setTimeout(() => {
                    that.initDivTerm();
                    that.initDivFrequency();
                    that.initObject('term');
                }, 100);
            }, 200);
        });

    }

    initDivTerm() {

        const that = this;
        this.divTerm.sly(false);
        this.divTerm.sly(this.options);
        this.divTerm.sly('on', 'active', function (e, index) {
            $('#ui-frequency').css('width', '3000px');

            setTimeout(() => {
                that.ckSelectedTerm = true;
                that.ckSelectedFrequency = false;
                that.selectedTerm = undefined;
                that.selectedFrequency = undefined;
                that.selectedTerm = that.termList[index];
                that.dataService.transaction.toTermId = that.selectedTerm.Term;
                that.dataService.transaction.toTermCode = that.selectedTerm.TermCode;
                that.frequencyList = that.termList[index].InterestTermList.InterestTerm;
                //that.getFrequencyList();
                that.initDivFrequency();
                setTimeout(() => {
                    that.initObject('frequency');
                }, 100);
            }, 200);
        });

    }

    initDivFrequency() {
        const that = this;
        this.divFrequency.sly(false);
        this.divFrequency.sly(this.options);
        this.divFrequency.sly('on', 'active', function (e, index) {
            that.ckSelectedFrequency = true;
            that.selectedFrequency = undefined;
            that.selectedFrequency = that.frequencyList[index]
            that.dataService.transaction.toFrequencyTermId = that.selectedFrequency.InterestTerm;
            that.dataService.transaction.toFrequencyTermCode = that.selectedFrequency.InterestTermCode;
        });
    }

    onShow() {

        this.termList = [];
        this.frequencyList = [];

        this.divTerm.hide();
        this.divFrequency.hide();

        // if (isNullOrUndefined(this.dataService.transaction.amount)
        //     || parseFloat(this.dataService.transaction.amount.replace(',', '')) < 5000) {
        //     Modal.showAlert("กรุณาระบุจำนวนเงินอย่างน้อย 5,000 บาท");
        //     return;
        // }

        if (isNullOrUndefined(this.dataService.transaction.amount)
            || parseFloat(Utils.replaceAll(this.dataService.transaction.amount, ',', '')) <= 0) {
            Modal.showAlert("กรุณาระบุจำนวนเงิน");
            return;
        }

        $("#modal-picker").modal({
            keyboard: false,
            backdrop: 'static'
        });

        $('.modal-backdrop').remove();

        this.progress.showProgressWithMessage("");

        this.transactionService
            .getTDTerm(this.accountNumber, this.dataService.transaction.amount.replace(',', ''), this.transactionDate.format('YYYYMMDD'))
            .subscribe(
                depositTermList => {
                    //this.termList = depositTermList;
                    this.listTdTerm = depositTermList;
                    this.productList = this.listTdTerm.data.ProductList.Product;
                    this.termList = this.productList[0].DepositTermList.DepositTerm;
                    this.frequencyList = this.termList[0].InterestTermList.InterestTerm;
                    this.progress.hide();
                    setTimeout(() => {
                        this.initObject('all');
                    }, 200);
                },
                error => {
                    this.progress.hide();
                    Modal.showAlertWithOk(error.responseStatus.responseMessage, () => {
                        this.progress.hide();
                        $("#modal-picker").modal('hide');
                    });
                }
            )
    }

    onSelectedTerm() {

        if (!this.ckSelectedProduct || !this.ckSelectedTerm || !this.ckSelectedFrequency
            || isNullOrUndefined(this.selectedProduct)
            || isNullOrUndefined(this.selectedTerm)
            || isNullOrUndefined(this.selectedFrequency)) {
            Modal.showAlert("กรุณาเลือก ผลิตภัณฑ์, ระยะในการฝาก และความถี่ในการรับดอกเบี้ย");
            return;
        }

        let frequency = "";
        let interestTermDesc = "";
        if (this.frequencyList.length >= 1 && !isNullOrUndefined(this.selectedFrequency)) {
            this.dataService.transaction.selectedFrequency = this.selectedFrequency; 
            if (this.selectedFrequency.InterestTermCodeDesc === 'เมื่อครบกำหนด') {
                interestTermDesc = this.selectedFrequency.InterestTermCodeDesc;
            } else {
                interestTermDesc = this.selectedFrequency.InterestTerm + ' ' + this.selectedFrequency.InterestTermCodeDesc;
            }
            frequency = `ความถี่ในการรับดอกเบี้ย: ${interestTermDesc}`;
        }

        this.dataService.transaction.selectedTDTerm = null;
        this.dataService.transaction.selectedPromotionTerm = null;
        this.dataService.transaction.selectedTermProduct = this.selectedProduct;
        this.dataService.transaction.selectedTDTerm = this.selectedTerm;
        this.dataService.transaction.selectedFrequency = this.selectedFrequency;

        this.dataService.transaction.selectedTDTermTitle = `ระยะในการฝาก : ${this.selectedTerm.Term} ${this.selectedTerm.TermCodeDesc} ${frequency}`;

        // set display
        this.dataService.transaction.selectedTDTerm.nameTH = this.selectedTerm.Term + ' ' + this.selectedTerm.TermCodeDesc;
        this.dataService.transaction.selectedFrequency.frequencyDesc = interestTermDesc;

        this.selectedProduct = undefined;
        this.selectedFrequency = undefined;
        this.selectedTerm = undefined;
        this.ckSelectedProduct = false;
        this.ckSelectedFrequency = false;
        this.ckSelectedTerm = false;
        this.progress.hide();
        $("#modal-picker").modal('hide');
    }

    public getFrequencyList() {
        this.divFrequency.hide();

        const productCode = this.dataService.transaction.to.getProductCode();
        const promotionId = this.selectedTerm.promotionId;
        const month = this.selectedTerm.month;
        const day = this.selectedTerm.day;

        this.transactionService.getTDPayoutFrequency(promotionId,
            productCode,
            month,
            day,
            this.dataService.transaction.effectiveDate.format("YYYY-MM-DD"),
            this.dataService.transaction.amount.split(',').join(''))
            .subscribe(
                frequencyList => {

                    this.frequencyList = frequencyList;
                    if (this.frequencyList.length > 0) {
                        setTimeout(() => {
                            this.divFrequency.show();
                            this.initDivFrequency();

                        }, 500);
                    }
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            )
    }

    public onSetAccount(event) {
        Utils.logDebug('onSetAccount', 'start');
        Utils.logDebug('onSetAccount', 'value : ' + JSON.stringify(event));
        if (event.selected.data) {
            this.dataService.transaction.selectedAccountInterestTitle = event.selected.data;
            this.dataService.transaction.selectedAccountInterest = event.selected.value;
            this.showSelector = false;
        }
    }

    public eventStatusSelector(event) {
        Utils.logDebug('eventStatusSelector', 'start');
        Utils.logDebug('eventStatusSelector', 'value : ' + JSON.stringify(event));
        this.showSelector = event;
    }

    public onShowAccountInterest() {
        Modal.showProgress();
        this.accountService.getaccountlistbyidcardForSelector(this.userService.getidNumber())
            .subscribe(
                data => {
                    Modal.hide();
                    this.titleTypeList = 'กรุณาเลือกบัญชีรับดอกเบี้ย';
                    const filterAccount = data.data.inquiryAccountList.inquiryAccount.filter(x => x.accountType !== AppConstant.ProdTypeFix);
                    this.dataList = [];
                    for (const item of filterAccount) {
                        if (item.accountStatusCode === AppConstant.AccountStatusCodeOpenToday
                            || item.accountStatusCode === AppConstant.AccountStatusCodeActive) {
                                this.dataList.push({
                                    'data': item.accountNo + ' : ' + this.translate.instant(item.accountType) + ' : ' + item.accountName,
                                    'value': item.accountNo,
                                    'accountType': item.accountType
                                });
                            }
                    }
                    this.ActiveNow = this.dataList[0];
                    this.showSelector = true;
                },
                Error => {
                    Modal.hide();
                    this.dataList = [];
                }
            )
    }

    onShowInputAccountInterest() {
        this.showInputAccountInterest = true;
        $("#input-modal").modal('hide');
        $("#input-modal").modal('show');
        $('.modal-backdrop').css('z-index', '2');
    }

    public onConfirmAccountInterest(selectedBankAccount) {

        if (isNullOrUndefined(selectedBankAccount) || selectedBankAccount === '') {
            return;

        } else {

            if (selectedBankAccount.substring(0, 1) === '1' || selectedBankAccount.substring(0, 1) === '2') { // CASA

                this.showInputAccountInterest = false;
                $("#input-modal").modal('hide');

                Modal.showProgress();
                this.accountService
                    .getAccountDetail(selectedBankAccount)
                    .subscribe(
                        (bankAccount: BankAccount) => {
                            Modal.hide();

                            if (!bankAccount.isStatusOpen()) {
                                Modal.showAlert(bankAccount.accountStatusDesc);
                                return;
                            }

                            this.dataService.transaction.selectedAccountInterestTitle =  bankAccount.accountNumber + ' ' + bankAccount.accountName;
                            this.dataService.transaction.selectedAccountInterest =  bankAccount.accountNumber;
                        },
                        error => {
                            Modal.hide();
                            Modal.showAlert(error.responseStatus.responseMessage);
                        }
                    );
            } else {
                Modal.showAlert('ระบุเลขที่บัญชีไม่ถูกต้อง');
            }
        }
    }
}
