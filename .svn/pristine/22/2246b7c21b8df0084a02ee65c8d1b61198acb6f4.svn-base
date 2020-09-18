import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utils } from "../../../share/utils";
import { DataService } from "../../_service/data.service";
import { IDatePickerConfig } from "ng2-date-picker";
import * as moment from 'moment';
import { OnMount } from "ng-dynamic";

@Component({
    selector: 'fee-picker',
    templateUrl: './fee-picker.component.html',
    styleUrls: ['./fee-picker.component.sass']
})
export class FeePickerComponent implements OnInit, OnMount {

    @Output() onSelectFee = new EventEmitter();
    @Input() feeAmount;
    @Input() feeDetailList;

    private feePickerId = "#fee_picker_content";
    private backgroundId = ".bg";
    configDatePicker: IDatePickerConfig;
    currentDate;

    constructor(private dataService: DataService) {

    }

    dynamicOnMount(attr: Map<string, string>, innerHTML: string, el: any) {
        this.feeAmount = attr.get("feeAmount");
        this.feeDetailList = attr.get("feeDetailList");
        console.log(`onMount: ${attr}`);
    }

    ngOnInit() {
        this.currentDate = moment().add(1, 'd');
        $(`${this.feePickerId},${this.backgroundId}`).hide();
    }

    onOpenFeePicker() {
        this.configDatePicker = Utils.getDatePickerOption(this.currentDate, moment().add(4, 'd'));

        $(`${this.feePickerId},${this.backgroundId}`).show();
        Utils.animate(this.feePickerId, "fadeInUp")
            .then(() => {
                $(this.feePickerId).removeClass('animated fadeInUp');

            });
    }

    onClickDismiss() {
        Utils.animate(this.feePickerId, "fadeOutDown")
            .then(() => {
                $(this.feePickerId).removeClass('animated fadeOutDown');
                $(`${this.feePickerId},${this.backgroundId}`).hide();
            });
    }

    onClickSelectFee(feeTransferType) {
        const fee = this.feeDetailList.filter(feeData => feeData.transferType === feeTransferType)[0];
        const feeAmount = fee.FeeDetailList.totalFeeAmount();

        if (feeTransferType !== "2D") {
            this.currentDate = moment();
        }

        // this.dataService.transaction.effectiveDate = moment(fee.CreditDate.substr(0,10));
        //this.dataService.transaction.fee.feeDetailList[0].creditDate = fee.creditDate;
        this.dataService.transaction.CreditDate = Utils.convertDateAsia(fee.creditDate, "MM-DD-YYYY", "DD/MM/YYYY");
        console.log(this.dataService.transaction.creditDate);
        this.dataService.transaction.DebitDate = Utils.convertDateAsia(fee.debitDate, "MM-DD-YYYY", "DD/MM/YYYY");
        this.dataService.transaction.FeeTransferType = feeTransferType;
        this.dataService.transaction.fee.setFeeDetail(fee);
        this.dataService.transaction.fee.getSubmitFeeParameter();

        Utils.animate(this.feePickerId, "fadeOutDown")
            .then(() => {
                $(this.feePickerId).removeClass('animated fadeOutDown');
                $(`${this.feePickerId},${this.backgroundId}`).hide();
                this.onSelectFee.emit({ fee: feeAmount });
            });
    }
}
