import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location, DatePipe } from '@angular/common';
import { DataService } from "../../_service/data.service";
import { UserService } from "../../_service/user.service";
import { Utils } from "../../../share/utils";
import { TransactionService } from "../../_service/api/transaction.service";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { AccountService } from "../../_service/api/account.service";
import * as moment from 'moment';
import { resolve, reject } from '../../../../../node_modules/@types/q';
import { TransactionPassbook } from '../../_model/transactionPassbook';
import { isNullOrUndefined } from 'util';
import { PassBook } from '../../_model/passbook';
import { AppConstant } from '../../../share/app.constant';
import { PassbookTD } from 'app/kiatnakin/_model/passbookTD';
import { TransactionPassbookTD } from 'app/kiatnakin/_model/transactionPassbookTD';

@Component({
    selector: 'app-transaction-bank',
    templateUrl: './transaction-bank.component.html',
    styleUrls: ['./transaction-bank.component.sass']
})
export class TransactionBankComponent implements OnInit, AfterViewInit {

    @Input() selectedAccount: string;

    public accountName: string;
    public accountNumber: string;
    public transaction: any[] = [];
    private isScroll: boolean = false;
    private onScroll: boolean = false;
    private $deposit;
    private $withdraw;
    private $transfer;
    private $bookCheque: any;
    private $investment;
    public $flag_passbook;
    private accountType: string = '';
    private tempAny: any;
    private totalTransactionPage: number[];
    private totalTransaction: number = 0;
    private totalPageNumber: number = 0;
    private sortTransaction: TransactionPassbook[];
    private passbooks: PassBook[] = [];
    private passbookTD: PassbookTD[] = [];

    @ViewChildren('bookitem') things: QueryList<any>;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private transactionService: TransactionService,
        public dataService: DataService,
        public userService: UserService,
        public accountService: AccountService) {
    }

    ngOnInit() {
        this.initObject();
    }

    ngAfterViewInit() {
        Utils.logDebug('ngAfterViewInit', 'start');
        this.things.changes.subscribe(t => {
            this.ngForRendred();
          });
    }

    ngForRendred() {
        Utils.logDebug('ngForRendred', ' ======= > NgFor is Rendered');
        Modal.hide();
        this.updateBlockBook();
    }

    private checkCA() {
        if (this.dataService.selectedAccount.accountType === AppConstant.ProdTypeSaving
                && this.$flag_passbook === AppConstant.ProdTypeCurrent) {
            this.setupBookBankCA();
        } else {
            this.setupBookBank();
        }
    }

    private async initObject() {
        Modal.showProgress();
        this.$transfer = $("#transfer");
        this.$withdraw = $("#withdraw");
        this.$deposit = $("#deposit");
        this.$investment = $("#investment");

        // Tweene.get(this.$cheque).to({opacity: 1, right: -340, top: 0}, 500).play();
        // Tweene.get(this.$transfer).to({ opacity: 1, right: -360, top: 60 }, 500).play();
        // Tweene.get(this.$withdraw).to({ opacity: 1, right: -380, top: 120 }, 500).play();
        // Tweene.get(this.$deposit).to({ opacity: 1, right: -400, top: 180 }, 500).play();
        // Tweene.get(this.$investment).to({ opacity: 1, right: -360, top: 60 },s 500).play();
        Tweene.get(this.$transfer).to({ opacity: 1, right: -380, top: 120 }, 500).play();

        if (this.dataService.selectedAccount.accountType === AppConstant.ProdTypeFix) {
            await this.getPassbook();
        } else {
            await this.CheckEAccount();
        }
    }

    public setupBookBankCA() {
        console.log('setupBookBankCA');
        const $bookBlock = $('#bb-bookblock');
        const that = this;

        $bookBlock.bookblock({
            orientation: 'horizontal',
            speed: 1000,
            onEndFlip: function (old, page, isLimit) {
                //that.setInitScroll();
            },
            onBeforeFlip: function (page) {

            }
        });
        Utils.animate("#bb-bookblock", "slideInUp");

    }

    public setupBookBank() {
        Utils.logDebug('setupBookBank', 'start');
        const $bookBlock = $('#bb-bookblock');
        const $navNext = $('#bb-nav-next');
        const $navPrev = $('#bb-nav-prev');
        const that = this;

        $bookBlock.bookblock({
            orientation: 'horizontal',
            speed: 1000,
            onEndFlip: function (old, page, isLimit) {
                console.log('setInitScroll');
                //that.setInitScroll();
            },
            onBeforeFlip: function (page) {

            }
        });

        $navNext.on('click touchstart', function () {
            $bookBlock.bookblock('next');
            return false;
        });

        $navPrev.on('click touchstart', function () {
            $bookBlock.bookblock('prev');
            return false;
        });

        $('#tablescroll thead').on('click touchstart', function () {
            $bookBlock.bookblock('prev');
            return false;
        });

        $bookBlock.bookblock('update');
        $('.page-next').on('click touchstart', function () {
            $bookBlock.bookblock('next');
            return false;
        });
        $('.page-prev').on('click touchstart', function () {
            $bookBlock.bookblock('prev');
            return false;
        });
        setTimeout(() => {
            $bookBlock.bookblock('next');
        }, 500);
        // setTimeout(() => {
        //     const fragments: string[] = [];
        //     this.activatedRoute.fragment.forEach(p => fragments.push(p));
        //     const fragment: string = fragments.pop();
        //     if (fragment === "open") {
        //         $bookBlock.bookblock('jump', 3);
        //     }
        //     else {
        //         //$bookBlock.bookblock('jump', this.totalPageNumber);
        //         $bookBlock.bookblock('next');
        //     }
        // }, 500);
    }

    private updateBlockBook() {
        Utils.logDebug('updateBlockBook', 'start');
        const $bookBlock = $('#bb-bookblock');
        $bookBlock.bookblock('update');
        $('.page-next').on('click touchstart', function () {
            $bookBlock.bookblock('next');
            return false;
        });
        $('.page-prev').on('click touchstart', function () {
            $bookBlock.bookblock('prev');
            return false;
        });
        setTimeout(() => {
            $bookBlock.bookblock('last');
        }, 2000);
    }

    private setDataScroll() {
        console.log('setDataScroll');
        const cell_height = $('#tablescroll tbody tr').length * 35;
        const body_height = $('#tablescroll tbody').height();
        let h = 220;

        if (cell_height < (body_height - 220)) {
            h = (body_height) - cell_height + 28;
        } else {
            this.isScroll = true;
            $('th.lastcol').css('margin-right', '12px');
        }

        $('tr.lastrow td').each(function () {
            $(this).height(h);
        });
    }

    private checkScroll() {
        console.log('checkScroll');
        const current = $('#tablescroll tr.current');
        if (current.length) {
            if (current.offset().top > 800) {
                $('#setScroll').show();
            }
        } else {
            $('#setScroll').hide();
        }
    }

    private setInitScroll() {
        this.setDataScroll();
        const current = $('#tablescroll tr.current');
        if (current.length) {
            if (current.offset().top > 800) {
                if (this.isScroll) {
                    setTimeout(() => {
                        this.setScroll();
                    }, 100);
                }
            }
        } else {
            $('#setScroll').hide();
        }


        $('#tablescroll tbody').scroll(() => {

            if (!this.onScroll) {
                const current_scroll = $('#tablescroll tr.current');
                if (current_scroll.length) {
                    if (current_scroll.offset().top > 800) {
                        $('#setScroll').show();
                    } else {
                        $('#setScroll').hide();
                    }
                } else {
                    $('#setScroll').hide();
                }
            }
        });
    }

    public setScroll() {
        this.onScroll = true;
        $('#setScroll').hide();
        setTimeout(() => {
            $('#lastrow').ScrollTo({
                duration: 1500, easing: 'linear', callback: () => {
                    this.onScroll = false;
                    this.checkScroll();
                }
            });
        }, 100);

    }

    public onClickInvestment() {
        Tweene.get(this.$transfer).to({ opacity: 0, display: 'none' }, 500, () => {
            this.router.navigate(["/kk/investment"]);
        }).play();
    }

    public onClickTransfer() {
        Tweene.get(this.$transfer).to({ opacity: 0, display: 'none' }, 500, () => {
            this.router.navigate(["/kk/transfer"]);
        }).play();
    }

    public onClickWithdraw() {
        Tweene.get(this.$withdraw).to({ opacity: 0, display: 'none' }, 500, () => {
            this.router.navigate(["/kk/withdraw"]);
        }).play();

    }

    public onClickDeposit() {
        Tweene.get(this.$deposit).to({ opacity: 0, display: 'none' }, 500, () => {
            this.router.navigate(["/kk/deposit"]);
        }).play();
    }

    public onClickBack() {
        if (this.dataService.dataFrom === 'NC') {
            this.dataService.dataFrom = null;
            this.router.navigate(["/kk"]);
        } else {
            this.router.navigate(["kk", "selectBankAccount"]);
            // this.location.back();
        }
    }

    public onClickMainMenu() {
        this.router.navigate(["/kk"]);
    }

    public async CheckEAccount() {
        this.transactionService.CheckEAccount(this.dataService.selectedAccount.accountNumber)
            .subscribe(
                data => {
                    this.$flag_passbook = data.data.flag_passbook;
                    console.log('flag_passbook : ' + this.$flag_passbook);
                    // this.checkCA();
                    this.getPassbook();
                }, error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                    return;
                }
            );
    }

    public async getPassbook() {
        const date3month = Utils.minus3Months();
        const today = moment().format('YYYY-MM-DD');

        this.accountType = this.dataService.selectedAccount.accountType;
        // id_no, id_type, account_no, start_date, date_to
        if (this.dataService.selectedAccount.accountType === AppConstant.ProdTypeSaving) {
            try {
                Modal.showProgress();
                this.dataService.selectedAccount.transactionPassbook = [];
                let passBookStatement = null;
                passBookStatement = await this.getPassbookStatement(this.dataService.selectedAccount.accountNumber, this.dataService.selectedAccount.accountType, date3month, today)
                    if (!isNullOrUndefined(passBookStatement)) {
                        passBookStatement.data.passbookinquiry.forEach(data => {
                            this.dataService.selectedAccount.transactionPassbook.push(new TransactionPassbook(data));
                        });
                        this.totalTransaction = passBookStatement.data.passbookinquiry.length;
                    }

                if (this.$flag_passbook !== 'N') {
                    Utils.logDebug('getPassbook', 'totalTransaction = ' + this.totalTransaction);
                    this.totalPageNumber = this.totalTransaction / 20;
                    //sort data
                    this.sortTransaction = this.dataService.selectedAccount.transactionPassbook.reverse();
                    this.dataService.selectedAccount.transactionPassbook = this.sortTransaction;
                    Utils.logDebug('getPassbook', 'Sort reverse complete ');
                    //page data slice
                    this.pageSlice();
                } else {
                    this.sortTransaction = this.dataService.selectedAccount.transactionPassbook.reverse();
                    this.dataService.selectedAccount.transactionPassbook = this.sortTransaction;
                }
                this.checkSetupBookBank();
            } catch (e) {
                Modal.hide();
                Modal.showAlert(e)
                return;
            }
        } else if (this.dataService.selectedAccount.accountType === AppConstant.ProdTypeFix) {
            //Call Service GetPassbookTD
            Utils.logDebug('getPassbook', 'call GetPassbookTD');
            try {
                this.dataService.selectedAccount.transactionPassbookTD = [];
                let passbookTd = null;
                passbookTd = await this.getTDPassbookStatement(this.dataService.selectedAccount.accountNumber);
                if (!isNullOrUndefined(passbookTd.data.placementList)) {
                    Utils.logDebug('getPassbook', 'Passbook TD : ' + JSON.stringify(passbookTd.data.placementList));
                    passbookTd.data.placementList.forEach(data => {
                        this.dataService.selectedAccount.transactionPassbookTD.push(new TransactionPassbookTD(data.placement));
                    });
                    this.totalTransaction = this.dataService.selectedAccount.transactionPassbookTD.length;
                }

                Utils.logDebug('getPassbookTD', 'totalTransaction = ' + this.totalTransaction);
                this.totalPageNumber = this.totalTransaction / 20;
                this.pageSliceTD();
                //this.dataService.selectedAccount.transaction = passbookTd.data.placementList;
                //this.setupBookBank();
                this.checkCA();
                Modal.hide();
            } catch (e) {
                Modal.hide();
                Modal.showAlert(e)
            }
            return;
        } else {
            this.GetStatement();
        }
    }

    private pageSlice() {
        if (this.totalPageNumber > 0) {
            let lastIndex = 0;
            for (let i = 0; i < this.totalPageNumber; i++) {
                let countIndex = 0;
                const listTransaction: TransactionPassbook[] = [];
                for (let j = lastIndex; j < this.sortTransaction.length; j++) {
                    if (countIndex < 20) {
                        listTransaction.push(this.sortTransaction[j])
                        lastIndex = j;
                        countIndex++;
                    } else {
                        lastIndex = j;
                        break;
                    }
                }
                const rowBlank = 20 - listTransaction.length;
                this.passbooks.push(new PassBook(i, new Array(rowBlank), listTransaction));
            }
        } else {
            this.passbooks.push(new PassBook(0, new Array(20), null));
        }
        Utils.logDebug('getPassbook', 'Page slice complete ');
    }

    private pageSliceTD() {
        if (this.totalPageNumber > 0) {
            let lastIndex = 0;
            for (let i = 0; i < this.totalPageNumber; i++) {
                let countIndex = 0;
                const listTransaction: TransactionPassbookTD[] = [];
                for (let j = lastIndex; j < this.dataService.selectedAccount.transactionPassbookTD.length; j++) {
                    if (countIndex < 20) {
                        listTransaction.push(this.dataService.selectedAccount.transactionPassbookTD[j])
                        lastIndex = j;
                        countIndex++;
                    } else {
                        lastIndex = j;
                        break;
                    }
                }
                const rowBlank = 20 - listTransaction.length;
                this.passbookTD.push(new PassbookTD(i, new Array(rowBlank), listTransaction));
            }
        } else {
            this.passbookTD.push(new PassbookTD(0, new Array(20), null));
        }
        Utils.logDebug('getPassbookTD', 'Page slice complete ');
    }

    private checkSetupBookBank() {
        if (this.dataService.selectedAccount.accountType === AppConstant.ProdTypeFix
            || (this.dataService.selectedAccount.accountType === AppConstant.ProdTypeSaving && this.$flag_passbook === 'N'
            || this.dataService.selectedAccount.accountType === AppConstant.ProdTypeCurrent)) {
            this.setupBookBankCA();
        } else {
            this.setupBookBank();
        }
    }

    async getPassbookStatement(accountNumber, accountType, fromDate, toDate) {
        return new Promise((resolve, reject) => {
            this.transactionService
                .getPassbook(accountNumber, accountType, fromDate, toDate)
                .subscribe(
                    data => {
                        return resolve(data)
                    }, error => {
                            return resolve()
                    }
                )
        })
    }

    async getTDPassbookStatement(accountNumber) {
        return new Promise(( resolve, reject ) => {
            this.transactionService
                .getTDPassbook(accountNumber)
                .subscribe( data => {
                    return resolve(data);
                }, error => {
                    return resolve();
                });
        });
    }

    public GetStatement() {
        console.log('transaction-bank -> GetStatement');
        const date3month = Utils.minus3Months();
        const today = moment().format('YYYY-MM-DD');
        this.accountService.getAccountDetail(this.dataService.selectedAccount.accountNumber)
            .subscribe(
                data => {
                    const citizenID = data.citizenID;
                    const idType = data.idType;
                    this.transactionService.getstatementbyfunding(
                        citizenID, idType, this.dataService.selectedAccount.accountNumber, this.dataService.selectedAccount.accountType, date3month, today)
                        .subscribe(
                            dataStatement => {
                                console.log(dataStatement.data.StatementInfo.STATEMENTINFO);
                                this.dataService.selectedAccount.transaction = dataStatement.data.StatementInfo.STATEMENTINFO.reverse();
                            },
                            error => {
                                this.dataService.selectedAccount.transaction = [];
                            }
                        )
                    this.checkSetupBookBank();
                }, error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            )
    }
}
