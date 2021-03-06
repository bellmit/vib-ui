import { AfterContentInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "../_service/data.service";
import { Utils } from "../../share/utils";
import { Http } from '@angular/http'
import { Modal, CustomDatePickerComponent } from '../_share';
import { UserService } from '../_service';
import { HardwareService } from 'app/kiatnakin/_service/hardware.service';
import { TellerService } from '../_service/teller.service';

@Component({
    selector: 'kk-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.sass']
})

export class HomeComponent implements OnInit, AfterContentInit, OnDestroy {
    public animationState = {
        open: 0,
        close: 1,
        hide: 2
    };
    public titleSelectAccountType: string = "";
    public currentAnimationState: any = this.animationState.close;
    public selectedMenu: string = '';
    public selectedGroup: string = '';

    public $titleSelectAccountType: any;
    public $catalog: any;
    public $bookBank: any;
    public $bookCheque: any;
    public $cheque: any;
    public $investment: any;
    public $transfer: any;
    public $mutualFund: any;
    public $withdraw: any;
    public $deposit: any;
    public $folder1: any;
    public $folder2: any;
    public $fixed_book: any;
    public $current_book: any;
    public $saving_book: any;
    public $back: any;

    public objectId = ["#titleSelectAccountType", '#catalog', '#bookBank',
        '#investment', '#bookCheque', '#cheque', '#transfer', '#withdraw', '#deposit', "#investment",
        '#cover_folder1', '#cover_folder2', '#fixed_book', '#current_book', '#saving_book',
        '#back', '#mutualFund'];

    constructor(public router: Router,
        public dataService: DataService,
        public userService: UserService,
        public activatedRoute: ActivatedRoute,
        public hardwareService: HardwareService,
        public tellerService: TellerService,
        public http: Http
    ) {
        dataService.currentUrl = activatedRoute.snapshot['_routerState'].url;
        console.log('HomeComponent --- bass dataService.currentUrl->', dataService.currentUrl)
    }
    ngOnInit() {
        this.getObject();
        this.setAllDefault();
        setTimeout(() => {
            this.checkLogin();
        }, 3000);
        $("#investment, #transfer, #mutualFund").hide();

    }

    ngAfterContentInit() {
        Modal.hide()
        this.initConnectServerSocket()

        const timeout = 250;
        const elementId = ["#investment", "#transfer", "#mutualFund"];

        if (this.dataService.backFromDepositType) {
            elementId.forEach((id, index) => {
                $(id).hide()
            });
            Utils.animate('#saving_book', 'fadeIn')
            Utils.animate('#fixed_book', 'fadeIn')
            Utils.animate('#current_book', 'fadeIn')
            return this.onClick('deposit', this.animationState.open, 'deposit')
        }

        elementId.forEach((id, index) => {
            setTimeout(function () {
                Utils.animate(id, "slideInRight")
                    .then(() => {
                        $(id).removeClass("slideInRight")
                    })
            }, timeout * index);
        });

        const html = "<dp-date-picker  [theme]=\"'dp-material'\" </dp-date-picker>";
        $("#cc").html(html)

    }

    ngOnDestroy() {
        this.dataService.backFromDepositType = false;
        this.dataService.currentUrl = '';
    }

    public initConnectServerSocket() {
        this.hardwareService.connectHardware();
        this.tellerService.connectAbsorption();
    }

    public getObject() {

        $.each(this.objectId, (index, value) => {
            this[value.replace("#", '$')] = $(value);
        });

    }

    public setAllDefault() {
        $(this.objectId.join(",")).fadeIn();
        $(".deposit>.cover-text").fadeOut();

        this.currentAnimationState = this.animationState.close;
        this.$back.hide('fast');
        this.selectedMenu = '';
        this.selectedGroup = '';
        this.$bookBank.css("opacity", 1).css("top", "45%");
        this.$cheque.attr('src', './assets/kiatnakin/image/slip/slip_chq.png');

        // Tweene.get(this.$cheque).to({opacity: 1, right: -340, top: 0}, 500).play();
        // Tweene.get(this.$transfer).to({opacity: 1, right: -360, top: 60}, 500).play();
        // Tweene.get(this.$withdraw).to({opacity: 1, right: -380, top: 120}, 500).play();
        // Tweene.get(this.$deposit).to({opacity: 1, right: -400, top: 180}, 500).play();

        Tweene.get(this.$titleSelectAccountType).to({ opacity: 0, top: -200 }, 500).play();
        Tweene.get(this.$investment).to({ opacity: 1, right: -360, top: 60 }, 500).play();
        Tweene.get(this.$transfer).to({ opacity: 1, right: -380, top: 120 }, 500).play();
        Tweene.get(this.$mutualFund).to({ opacity: 1, right: -380, top: 120 }, 600).play();
        Tweene.get(this.$bookCheque).to({ opacity: 0, top: 0, left: -600 }, 500).play();
        Tweene.get(this.$saving_book).to({
            opacity: 1,
            rotate: 30,
            top: 60,
            width: 300,
            left: 100,
            marginLeft: '35%'
        }, 500).play();

        Tweene.get(this.$fixed_book).to({
            opacity: 1,
            rotate: 30,
            top: 60,
            width: 300,
            left: 200,
            marginLeft: '35%'
        }, 500).play();

        Tweene.get(this.$current_book).to({
            opacity: 1,
            rotate: 30,
            top: 60,
            width: 300,
            left: 300,
            marginLeft: '35%'
        }, 500).play();

    }

    public onClickBack() {
        this.setAllDefault();
    }

    public onClick(view: string, animationState: number, group: string) {

        const that = this;
        let showElement = [];
        let hideElement = [];

        if (group === 'bookbank') {

            showElement = [this.$bookBank.attr('id')];

            Tweene.get(this.$bookBank).to({ opacity: 0 }, {
                duration: 700, complete: () => {

                    // that.goRouter('selectBankAccount');
                    that.goRouter('transactiontype');
                }
            }).play();

        } else if (group === 'catalog') {

            hideElement = $.grep(this.objectId, (el, index) => {
                return $.inArray(el.replace("#", ""), showElement) === -1;
            });
            $(hideElement.join(",")).fadeOut('fast');
            this.goRouter('catalog', null, 500);

        } else if (group === 'deposit') {
            this.titleSelectAccountType = "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????";
            showElement = this.checkStateAnimateDeposit(animationState, view);
        } else if (group === 'transfer') {
            showElement = this.checkStateAnimateTransfer(animationState, view);
        } else if (group === 'investment') {
            that.goRouter("investment");
        } else if (group === 'termMutualFund') {
            showElement = this.checkStateAnimateTransfer(animationState, view);
        }


        hideElement = $.grep(this.objectId, (el, index) => {
            return $.inArray(el.replace("#", ""), showElement) === -1;
        });

        // $(hideElement.join(",")).fadeOut('fast');
        $(hideElement.join(",")).hide();
        this.$back.show('fast');
        this.currentAnimationState = animationState;
        this.selectedMenu = view;
        this.selectedGroup = group;

        showElement = null;
        hideElement = null;

    }

    public checkStateAnimateDeposit(animationState, view) {
        const that = this;
        if (animationState === this.animationState.open &&
            this.currentAnimationState === this.animationState.open) {

            // this.userService.depositGroup = view;
            const showElement = [this.$saving_book.attr('id'), this.$fixed_book.attr('id'), this.$current_book.attr('id')];

            Tweene.get(this.$titleSelectAccountType).to({ opacity: 0, top: -200 }, 300).play();

            if (view === 'Saving' || view === 'Fixed' || view === 'Current') {
                $('#saving_book').removeClass("fadeIn")
                $('#fixed_book').removeClass("fadeIn")
                $('#current_book').removeClass("fadeIn")
            }

            if (view === 'Saving') {
                Tweene.get(this.$current_book).to({ opacity: 0, bottom: -200 }, 700).play();
                Tweene.get(this.$fixed_book).to({ opacity: 0, bottom: -200 }, 700).play();
                Tweene.get(this.$saving_book).to({ left: 100 }, {
                    duration: 700, complete: () => {
                        that.goRouter('depositType', { type: "saving" });
                    }
                }).play();
            } else if (view === 'Fixed') {
                // Modal.showAlert("??????????????????????????????????????????????????? ?????????????????????????????????????????????????????????")
                // return;
                Tweene.get(this.$saving_book).to({ opacity: 0, bottom: -200 }, 700).play();
                Tweene.get(this.$current_book).to({ opacity: 0, bottom: -200 }, 700).play();
                Tweene.get(this.$fixed_book).to({ left: 100 }, {
                    duration: 700, complete: () => {
                        that.goRouter('depositType', { type: "fixed" });
                    }
                }).play();
            } else if (view === 'Current') {
                Tweene.get(this.$saving_book).to({ opacity: 0, bottom: -200 }, 700).play();
                Tweene.get(this.$fixed_book).to({ opacity: 0, bottom: -200 }, 700).play();
                Tweene.get(this.$current_book).to({ left: 100 }, {
                    duration: 700, complete: () => {
                        that.goRouter('depositType', { type: "current" });
                    }
                }).play();
            }

            return showElement;
        } else if (animationState === this.animationState.open &&
            this.currentAnimationState === this.animationState.close) {

            const showElement = [this.$fixed_book.attr('id'),
            this.$current_book.attr('id'),
            this.$saving_book.attr('id'),
            this.$titleSelectAccountType.attr('id')];

            Tweene.get(this.$saving_book).to({
                rotate: 0,
                top: '+=35%',
                width: 499,
                left: 0,
                marginLeft: 100
            }, 700).play();
            Tweene.get(this.$fixed_book).to({
                rotate: 0,
                top: '+=35%',
                width: 499,
                left: 599,
                marginLeft: 100
            }, 700).play();
            Tweene.get(this.$current_book).to({ rotate: 0, top: '+=35%', width: 499, left: 1198, marginLeft: 100 }, {
                duration: 700, complete: () => {
                    Tweene.get(that.$titleSelectAccountType).to({ opacity: 1, top: '+=35%' }, 500).play();
                }
            }).play();
            $(".deposit>.cover-text").fadeIn();

            return showElement;
        }
    }

    public checkStateAnimateTransfer(animationState, view) {
        const that = this;
        if (animationState === this.animationState.open &&
            this.currentAnimationState === this.animationState.open) {

            if (view === 'cheque') {
                Tweene.get(this.$bookCheque).to({ opacity: 0 }, 700).play();
                Tweene.get(this.$titleSelectAccountType).to({ opacity: 0 }, 500).play();
                Tweene.get(this.$cheque).to({ opacity: 0 }, {
                    duration: 700, complete: () => {
                        that.goRouter("cashierChqBuy");
                    }
                }).play();
            }
            if (view === 'transfer5') {

                Tweene.get(this.$bookCheque).to({ opacity: 0 }, 700).play();
                Tweene.get(this.$titleSelectAccountType).to({ opacity: 0 }, 500).play();
                Tweene.get(this.$cheque).to({ opacity: 0 }, {
                    duration: 700, complete: () => {
                        that.goRouter("currentChqBuy");
                    }
                }).play();
            }

        }
        else if (animationState === this.animationState.open &&
            this.currentAnimationState === this.animationState.close) {
            const showElement = this.checkViewAnimateTransfer(view);
            return showElement;
        }
    }

    public checkViewAnimateTransfer(view) {
        const that = this;
        if (view === 'cheque' || view === 'transfer5') {
            const showElement = [that.$cheque.attr('id'), that.$bookCheque.attr('id'), that.$titleSelectAccountType.attr('id')];

            that.titleSelectAccountType = "??????????????????????????????????????????????????????????????????????????????????????????????????????";
            that.$cheque.attr('src', './assets/kiatnakin/image/buy_cashier_cheque.png');

            Tweene.get(that.$titleSelectAccountType).to({ opacity: 0, top: -200 }, 150).play();
            Tweene.get(that.$bookCheque).to({ opacity: 1, left: '55%', top: 0 }, 700).play();
            Tweene.get(that.$cheque).to({ right: '55%', top: 0 }, {
                duration: 700, complete: () => {
                    Tweene.get(that.$titleSelectAccountType).to({ opacity: 1, top: '+=30%' }, 500).play();
                }
            }).play();
            return showElement;
        } else if (view === 'transfer') {
            const showElement = [that.$transfer.attr('id')];

            Utils.animate("#transfer", "slideOutRight")
                .then(function () {
                    that.goRouter("transfer");
                });
            return showElement;
        } else if (view === 'withdraw') {
            const showElement = [that.$withdraw.attr('id')];
            Utils.animate("#withdraw", "slideOutRight")
                .then(function () {
                    that.goRouter("withdraw");
                });
            return showElement;
        } else if (view === 'deposit') {
            const showElement = [that.$deposit.attr('id')];
            Utils.animate("#deposit", "slideOutRight")
                .then(function () {
                    that.goRouter("deposit");
                });
            return showElement;
        } else if (view === 'termMutualFund') {
            const showElement = [that.$mutualFund.attr('id')];
            Utils.animate("#mutualFund", "slideOutRight")
                .then(function () {
                    that.goRouter("termMutualFund");
                });
            return showElement;
        }
    }

    public goRouter(router: string, param?: any, delay: number = 0) {
        setTimeout(() => {
            this.router.navigate(["kk", router], { queryParams: param });
        }, delay);

    }
    checkLogin() {
        if (!this.userService.isLoggedin()) {
            this.dataService.isAcceptedTermMutualFund = false
        }
    }
}
