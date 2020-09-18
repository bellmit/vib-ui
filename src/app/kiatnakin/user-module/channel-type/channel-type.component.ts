import {Component, OnInit, AfterContentInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {Utils} from "../../../share/utils";
import {PaymentType, SelectType, InvestType} from "../../_model/transaction";
import {BankAccount} from "../../_model/bankAccount";
import {DataService} from "../../_service/data.service";


@Component({
    selector: 'app-channel-type',
    templateUrl: './channel-type.component.html',
    styleUrls: ['./channel-type.component.sass']
})
export class ChannelTypeComponent implements OnInit, AfterContentInit {

    @Output() selectedAccount: EventEmitter<string> = new EventEmitter<string>();
    @Input() queryParams: Map<string, string>;
    public bankAccount = new BankAccount();
    public paymentType = PaymentType;
    public investType = InvestType;
    public selecType = SelectType;
    public CHEQUE: boolean = false;
    public CASH: boolean = false;
    public BookBank: boolean = false;
    public CABookBank: boolean = false;
    public ScanChq: boolean = false;
    public LTF: boolean = false;
    public RMF: boolean = false;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        public dataService: DataService) {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        $('#container_form').addClass("animated fadeIn");

        if (this.dataService.transaction.selectType === this.selecType.CHEQUE_CASH) {
            this.CHEQUE = true;
            this.CASH = true;
        } else if (this.dataService.transaction.selectType === this.selecType.CHEQUE_BookBank) {
            this.CHEQUE = true;
            this.BookBank = true;
        } else if (this.dataService.transaction.selectType === this.selecType.BookBank_CASH) {
            this.BookBank = true;
            this.CASH = true;
        } else if (this.dataService.transaction.selectType === this.selecType.CABookBank_ScanChq) {
            this.CABookBank = true;
            this.ScanChq = true;
        } else if (this.dataService.transaction.selectType === this.selecType.LTF_RMF) {
            this.LTF = true;
            this.RMF = true;
        }
    }


    public onSelectType(type: any) {
        this.selectedAccount.emit(type);
    }
}
