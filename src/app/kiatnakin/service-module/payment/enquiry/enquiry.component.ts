import {Component, OnInit, AfterContentInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location, DatePipe} from '@angular/common';
import {BahtTextPipe} from "../../../_pipe/bahttext.pipe";
import {HardwareService} from "../../../_service/hardware.service";
import {KeyboardService} from "../../../_service/keyboard.service";
import {UserService} from "../../../_service/user.service";
import {DataService} from "../../../_service/data.service";
import {isNullOrUndefined} from "util";
import {Utils} from "../../../../share/utils";
import {PaymentType} from "../../../_model/transaction";
import {Bank} from "../../../_model/bank";
import {Enquiry} from "../../../_model/index";

@Component({
    selector: 'app-enquiry',
    templateUrl: 'enquiry.component.html',
    styleUrls: ['enquiry.component.sass']
})
export class EnquiryComponent implements OnInit, AfterContentInit {
    public enquiryList: any[] = [
        {
            "id": "01",
            "type": "รถยนต์",
            "description": "Toyota Feed ทะเบียน 1 กก 2222",
            "price": "80000"
        },
        {
            "id": "02",
            "type": "รถยนต์",
            "description": "Toyota Yaris ทะเบียน 3 กก 3333",
            "price": "90000"
        },
        {
            "id": "03",
            "type": "รถยนต์",
            "description": "Mazda2 ทะเบียน 1 กก 2222",
            "price": "80000"
        },
        {
            "id": "04",
            "type": "บ้าน",
            "description": "บ้านเลขที่ 11/190 สุขุมวิท 20",
            "price": "2000000"
        },
        {
            "id": "05",
            "type": "บัตรเครดิต",
            "description": "เลขที่บัตร 1111-1111-11111",
            "price": "10000"
        },
        {
            "id": "05",
            "type": "บัตรเครดิต",
            "description": "เลขที่บัตร 1111-1111-11111",
            "price": "10000"
        },
        {
            "id": "05",
            "type": "บัตรเครดิต",
            "description": "เลขที่บัตร 1111-1111-11111",
            "price": "10000"
        },
        {
            "id": "05",
            "type": "บัตรเครดิต",
            "description": "เลขที่บัตร 1111-1111-11111",
            "price": "10000"
        },
        {
            "id": "05",
            "type": "บัตรเครดิต",
            "description": "เลขที่บัตร 1111-1111-11111",
            "price": "10000"
        },
        {
            "id": "05",
            "type": "บัตรเครดิต",
            "description": "เลขที่บัตร 1111-1111-11111",
            "price": "10000"
        }
    ];
    public enquiryListDetail: any[] = [
        {
            "id": "01",
            "per": "1/24",
            "duedate": "5/5/2560",
            "price": "8000",
            "fine_price": "300",
            "total_price": "8300",
            "status": "l"
        },
        {
            "id": "01",
            "per": "2/24",
            "duedate": "5/5/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "n"
        },
        {
            "id": "01",
            "per": "3/24",
            "duedate": "5/7/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "w"
        },
        {
            "id": "01",
            "per": "4/24",
            "duedate": "5/8/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "w"
        },
        {
            "id": "01",
            "per": "5/24",
            "duedate": "5/8/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "w"
        },
        {
            "id": "01",
            "per": "6/24",
            "duedate": "5/9/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "w"
        },
        {
            "id": "01",
            "per": "7/24",
            "duedate": "5/10/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "w"
        },
        {
            "id": "01",
            "per": "8/24",
            "duedate": "5/11/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "w"
        },
        {
            "id": "01",
            "per": "9/24",
            "duedate": "5/12/2560",
            "price": "8000",
            "fine_price": "0",
            "total_price": "8000",
            "status": "w"
        },
    ];
    public enquiry: Enquiry;
    public bankName: string;
    public imageName: string;
    public paymentType = PaymentType;
    public bankList: any[];
    public show_btn_back: boolean = true;
    public status;

    constructor(private router: Router,
        public userService: UserService,
        private hardwareService: HardwareService,
        public dataService: DataService) {
        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Enquiry();
        }
        this.status = dataService.transaction.status;
        this.bankList = Bank.paymentChannel();
        this.imageName = this.bankList[1].image;
        this.bankName = this.bankList[1].name;
    }

    ngOnInit() {
        this.initObject();
    }

    public initObject() {

        setTimeout(() => {

            let lastedStatus = this.dataService.transaction.currentStatus ? this.dataService.transaction.currentStatus : this.status.dataList;

            if (lastedStatus !== this.status.dataList && !this.dataService.isAuthenticated) {
                lastedStatus = this.status.dataList;
            }
            this.onMoveStep(lastedStatus);

        }, 500);

    }

    ngAfterContentInit() {
        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 500);
    }

    public onClickDetail() {
        this.onMoveStep(this.status.detail)
    }

    public onMoveStep(step) {
        this.dataService.transaction.currentStatus = step;

        const status = this.dataService.transaction.status;
        switch (step) {
            case status.dataList:
                this.checkLogin();
                break;
            case status.detail:
                break;
            case status.inputData:
                this.dataService.transaction.serviceName = 'ชำระสินเชื่อบ้าน';
                this.dataService.transaction.service_accountName = 'คณิน ประดิษฐานนท์';
                this.dataService.transaction.service_address = '53/363 กฤษดานคร ถ.แจ้งวัฒนะ ต.บางตลาด อ.ปากเกร็ด จ.นนทบุรี 11120';
                this.dataService.transaction.contract_no = "1111-1111-1111";
                break;
            case status.confirmation:
                this.onGetTransactionFee();
                break;
            case this.status.complete:
                this.show_btn_back = false;
                break;
            case this.paymentType.Cash:
                this.onMoveStep(this.dataService.transaction.status.Cashto)
                break;
            case this.status.Cashto:
                setTimeout(() => {
                    this.onMoveStep(this.dataService.transaction.status.complete);
                }, 3000);
                break;
            case this.status.waitCash:
                setTimeout(() => {
                    this.onMoveStep(this.dataService.transaction.status.favorite);
                }, 3000);
                break;
            case this.status.favorite:
                break;
            default:
                break
        }

        KeyboardService.initKeyboardInputText();
    }

    public checkLogin() {
        if (this.userService.isLoggedin()) {
            this.dataService.transaction.service_accountName = this.userService.getUserLoginFullName();
            this.dataService.transaction.service_address = "";
        } else {
            this.dataService.transaction.service_accountName = 'นาย ทดสอบ ไม่ได้ Login';
            this.dataService.transaction.service_address = "99/9 Moo 2 Unit 1204-5 12 th Floor Chaengwattana Rd. Bangtalad, Pakkret, Nonthaburi 11120";
        }
    }

    public onGetTransactionFee() {
        this.dataService.transaction.totalAmount = 0;
        this.dataService.transaction.amount = Utils.toStringNumber(this.dataService.transaction.amount);
        this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount) + this.dataService.transaction.fee.amount;
    }

    public onClickSubmit() {

        this.onMoveStep(this.status.confirmation);
    }

    public onClickPrintSlip(isPrint: boolean) {

        if (isPrint) {
            this.onRequestPrint();
            // this.progress.showProgressWithMessage("กำลังปริ้นใบเสร็จ");
            setTimeout(() => {
                // this.progress.showSuccessWithMessage("");
                // this.progress.hide();
            }, 3000);
            this.onMoveStep(this.dataService.transaction.status.favorite);
        } else {
            this.onMoveStep(this.dataService.transaction.status.favorite);
        }

    }

    public onRequestPrint() {

        const currentTimestamp = (new Date()).getTime();
        const datePipe = new DatePipe('en');
        const bahtTextPipe = new BahtTextPipe();

        const data = {
            "cmd": "printerSendQuery",
            "params": {
                "doc": "TRANSFER_SLIP",
                "data": {
                    "branch": $("#label-branch").text(),
                    "doc_date": datePipe.transform(currentTimestamp, 'dd/MM/') + (Number(datePipe.transform(currentTimestamp, 'yyyy')) + 543),
                    "doc_time": datePipe.transform(currentTimestamp, 'HH:mm:ss'),
                    "acc_no_from": this.dataService.transaction.from.accountNumber,
                    "acc_no_to": this.dataService.transaction.to.accountNumber,
                    "acc_name_from": this.dataService.transaction.from.accountName,
                    "acc_name_to": this.dataService.transaction.to.accountName,
                    "amount": this.dataService.transaction.amount,
                    "fee": this.dataService.transaction.fee.amount,
                    "total_amount": this.dataService.transaction.totalAmount,
                    "total_amount_str": bahtTextPipe.transform(this.dataService.transaction.totalAmount)
                }
            }
        };
        const json = JSON.stringify(data);
        console.log("json print ", data);
        this.hardwareService.requestPrintSlip(json);

    }

    public isInputAmount(value) {

        if (isNullOrUndefined(value)) {
            return false;
        }

        value = value.split(',').join('');
        const isNumber = !isNaN(value);
        if (isNumber) {

            const number = Number(value);
            return number >= 0.25;
        }

        return false;
    }

    public onFavorite(favorite: boolean) {

        this.onClickBack();
    }

    public onClickBack() {
        this.router.navigate(["/kk"]);

    }
}
