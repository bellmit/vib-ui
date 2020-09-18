import {Component, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {DataService} from "../../_service/data.service";
import {UserService} from "../../_service/user.service";
import {MasterDataService} from "../../_service/api/master-data.service";
import {KeyboardService} from "../../_service/keyboard.service";
import {PaymentType, Transaction} from "../../_model/transaction";
import {Withdraw} from "../../_model/withdraw";
import {Bank} from "../../_model/bank";
import {isNullOrUndefined} from "util";
import {Utils} from "../../../share/utils";
import {Modal} from "../../_share/modal-dialog/modal-dialog.component";
import {BankAccount} from "../../_model/bankAccount";
import {ToStringNumberPipe} from "../../_pipe/toStringNumber.pipe";
import {ChequeService} from "../../_service/api/cheque.service";
import {ProgressDialogComponent} from "../progress-dialog/progress-dialog.component";
import {Deposit} from "../../_model/deposit";
import {Cheque} from "../../_model/cheque";
import {AppConstant} from "../../../share/app.constant";

@Component({
    selector: 'app-cheque',
    templateUrl: 'cheque.component.html',
    styleUrls: ['cheque.component.sass']
})
export class ChequeComponent implements OnInit {

    @ViewChild('progress') progress: ProgressDialogComponent;
    @Output() selectedAccount: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();
    @Input() queryParams: Map<string, string>;
    public ignoreAccountNO: string;
    public paymentType = PaymentType;
    public cheque: Cheque;
    public chequeType: string;
    public status;
    public bank = Bank;
    public accountName: string = '';
    public micrResult: string;
    public data: any;
    public bankList: any[];
    public showSelector: boolean = false;
    public dateNow = Utils.getCurrentDate("", "dd/mm/yyyy");
    public ActiveNow: any[];
    public selected: string;
    public titleTypeList = "ประเภทของเช็ค";
    public stock: boolean = false;
    public dataList = [
        {"data": "A/C Payee Onl", "value": "01"},
        {"data": "& CO", "value": "02"}
    ];

    constructor(private dataService: DataService,
        private masterData: MasterDataService,
        private chequeService: ChequeService,
        private userService: UserService) {

        if (isNullOrUndefined(dataService.transaction)) {
            this.dataService.transaction = new Withdraw();
        }

        if (this.userService.isLoggedin()) {
            this.dataService.transaction.to.beneficiary_name = this.userService.getUserLoginFullName();
        }
    }

    ngOnInit() {
        this.getBankList();
        KeyboardService.initKeyboardInputText();
    }

    public onShow() {
        if (this.showSelector === false) {
            this.showSelector = true;
        } else {
            this.showSelector = false;
        }

    }

    public getBankList() {

        this.masterData.getMasterBank()
            .subscribe(
                bankList => {

                    this.bankList = bankList;
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }

    public onSelectedAccount() {

        if (this.dataService.transaction.constructor === Withdraw || this.dataService.transaction.constructor === Deposit) {

            const bank = Bank.paymentChannel()[1]
            this.dataService.transaction.to = BankAccount.getAccountTypeCheque();
            this.dataService.transaction.to.bank.image = bank.image;
            this.dataService.transaction.to.bank.name = bank.name;
            this.dataService.transaction.to.bank.code = bank.code;
            this.dataService.transaction.to.beneficiary_name = this.accountName;
            this.dataService.transaction.to.chequeType = this.chequeType;
            //mock data
            this.dataService.transaction.to.micrResult = this.micrResult;

            this.data = 'closeCheque';
            this.selectedAccount.emit(this.data);
        }
    }

    public onSelector(id) {
        this.selected = id;
        switch (id) {
            case 'chequeType':
                this.titleTypeList = "ประเภทเช็ค";
                if (!isNullOrUndefined(this.chequeType)) {
                    this.ActiveNow = this.dataList.filter(data => data.data === this.chequeType);
                }
                break;
            default:
                break
        }
        this.onShow();
    }

    public onSet(value) {
        switch (value.id) {
            case 'chequeType':
                this.chequeType = value.selected.data;
                break;
            default:
                break
        }
        this.onShow();
    }
}
