import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../_service/data.service";
import {BankAccount} from "../../_model/bankAccount";
import {InvestType} from "../../_model/transaction";


@Component({
    selector: 'app-select-investment-principal',
    templateUrl: './select-investment-principal.component.html',
    styleUrls: ['./select-investment-principal.component.sass']
})
export class SelectInvestmentPrincipalComponent implements OnInit {

    public ListRMF: any[] = [
        {
            "id": "04",
            "type": "กองทุนรวมตราสารหนี้",
            "group_type": "กลุ่มตราสารหนี้ที่มีกำหนดอายุโครงการ",
            "code": "ACT FIXED",
            "price": "23.153"
        },
        {
            "id": "05",
            "type": "กองทุนรวมตลาดเงิน",
            "group_type": "กลุ่มซื้อขาย-ทุกวันทำการ",
            "code": "PLUS",
            "price": "26.568"
        },
        {
            "id": "06",
            "type": "กองทุนรวมตราสารหนี้",
            "group_type": "กลุ่มตราสารหนี้ที่มีกำหนดอายุโครงการ",
            "code": "ACT FIXED",
            "price": "23.153"
        }
    ];

    public ListLTF: any[] = [
        {
            "id": "01",
            "type": "กองทุนรวมตลาดเงิน",
            "group_type": "กลุ่มซื้อขาย-ทุกวันทำการ",
            "code": "PLUS",
            "price": "26.568"
        },
        {
            "id": "02",
            "type": "กองทุนรวมตราสารหนี้",
            "group_type": "กลุ่มตราสารหนี้ที่มีกำหนดอายุโครงการ",
            "code": "ACT FIXED",
            "price": "23.153"
        },
        {
            "id": "03",
            "type": "กองทุนรวมตลาดเงิน",
            "group_type": "กลุ่มซื้อขาย-ทุกวันทำการ",
            "code": "PLUS",
            "price": "26.568"
        },
        {
            "id": "04",
            "type": "กองทุนรวมตลาดเงิน",
            "group_type": "กลุ่มซื้อขาย-ทุกวันทำการ",
            "code": "PLUS",
            "price": "26.568"
        },
        {
            "id": "05",
            "type": "กองทุนรวมตราสารหนี้",
            "group_type": "กลุ่มตราสารหนี้ที่มีกำหนดอายุโครงการ",
            "code": "ACT FIXED",
            "price": "23.153"
        },
        {
            "id": "06",
            "type": "กองทุนรวมตลาดเงิน",
            "group_type": "กลุ่มซื้อขาย-ทุกวันทำการ",
            "code": "PLUS",
            "price": "26.568"
        },
        {
            "id": "07",
            "type": "กองทุนรวมตลาดเงิน",
            "group_type": "กลุ่มซื้อขาย-ทุกวันทำการ",
            "code": "PLUS",
            "price": "26.568"
        },
        {
            "id": "08",
            "type": "กองทุนรวมตราสารหนี้",
            "group_type": "กลุ่มตราสารหนี้ที่มีกำหนดอายุโครงการ",
            "code": "ACT FIXED",
            "price": "23.153"
        },
        {
            "id": "09",
            "type": "กองทุนรวมตลาดเงิน",
            "group_type": "กลุ่มซื้อขาย-ทุกวันทำการ",
            "code": "PLUS",
            "price": "26.568"
        },
    ];
    @Output() selectedAccount: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();
    @Input() investType: string;
    public InvestType = InvestType;
    public investList: any[];
    selectedIndexPrincipal;
    public investType_txt: string;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        public dataService: DataService) {
    }

    ngOnInit() {
        if (this.investType === this.InvestType.LTF) {
            this.investType_txt = 'กองทุนระยะยาว (LTF)';
            this.investList = this.ListLTF;
        } else if (this.investType === this.InvestType.RMF) {
            this.investType_txt = 'กองทุนหุ้นระยะสั้น (RMF)';
            this.investList = this.ListRMF;
        } else {
            alert('error')
        }
    }

    public onSubmit() {
        const investData = this.investList[this.dataService.transaction.selectedIndexPrincipal];
        this.selectedAccount.emit(investData);
    }

}
