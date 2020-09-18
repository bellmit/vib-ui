import { AfterViewInit, Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { LocalStorage } from "ngx-webstorage";
import { isNullOrUndefined } from 'util';
import { Utils } from 'app/share/utils';
const moment = require('moment');

/**
 * Custom DatePickerTH
 * @constructor
 * @param {string} currentDate - วัน เช่น 1, 2, 3
 * @param {string} currentMonth - เดือนแบบเต็ม หรือ ย่อ เช่น ม.ค.
 * @param {string} currentYear - ปีไทย เช่น 2550
 * @param {string} inputWidth - กำหนดความกว้าง Input เช่น 100px (default 70px)
 *
 * @returns {{day:string, monyh:string, year:string}} onChanged
 */
@Component({
    selector: 'custom-date-picker',
    templateUrl: './custom-date-picker.component.html',
    styleUrls: ['./custom-date-picker.component.sass']
})
export class CustomDatePickerComponent implements OnInit {

    @LocalStorage("lang", "th")
    language: string;

    public listDay = new Array()
    public listMonth = []
    public listYear = []
    public showSelector = false
    public selectedId = ""
    public selectedTitle = ""
    public selectDataList = []
    public selectActive;

    public defaultYear;
    @Input('type') type = ""
    @Input('maxYear') maxYear
    @Input('minYear') minYear
    @Input('currentDay') inputCurrentDay = "";
    @Input('currentMonth') inputCurrentMonth = "";
    @Input('currentMonthValue') inputCurrentMonthValue = "";
    @Input('currentYear') inputCurrentYear = "";
    @Input('inputdayWidth') inputdayWidth = '40px';
    @Input('inputmonthWidth') inputmonthWidth = '40px';
    @Input('inputyearWidth') inputyearWidth = '50px';
    @Input('inputExiredDateWidth') inputExiredDateWidth = '120px';
    @Input('inputyearto') inputyearto = "";
    @Input('idClose') idClose = "";
    @Output('onChanged') onChanged = new EventEmitter();

    public monthList = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค."
    ];
    constructor() {
    }

    init() {
        moment.locale(this.language);
        const months = moment.months();
        let currentYear = moment().year() + 543;
        this.defaultYear = 0;
        if (this.type !== 'birthdate') {
            if (currentYear > this.maxYear) {
                currentYear = this.maxYear;
            }

            if (this.type === 'issueDate') {
                this.minYear = currentYear - 15;
                this.maxYear = currentYear;
            }
            else if (this.type === 'expireDate') {
                this.maxYear = currentYear + 15;
                this.minYear = currentYear;
                currentYear = currentYear + 15;
            }
            else {
                currentYear = currentYear + 10;
            }
        } else {
            this.defaultYear = (currentYear - 15);
        }

        if (this.minYear === "" || isNullOrUndefined(this.minYear)) {
            this.minYear = currentYear - 100
        }



        for (let i = 1; i <= 31; i++) {
            const data = {
                value: i.toString(),
                data: i.toString()
            };
            this.listDay.push(data)
        }

        this.monthList.forEach((month, index) => {
            const data = {
                value: index,
                data: months[index]
            };
            this.listMonth.push(data)
        });

        for (let i = currentYear; i >= this.minYear; i--) {
            const data = {
                value: i.toString(),
                data: i.toString()
            };
            this.listYear.push(data)
        }
        if (this.type === 'expireDate') {
            const d = {
                value: "01",
                data: "ตลอดชีพ"
            };
            this.listDay.push(d)
            this.listMonth.push(d)
            const y = {
                value: "9999",
                data: "ตลอดชีพ"
            };
            this.listYear.push(y)
        }
    }

    public ngOnInit() {
        console.log(this.type);
        this.init()
    }
    public onClickSelect(type) {
        this.selectedId = type;
        $('#' + this.idClose).hide();
        switch (type) {
            case 'day':
                this.selectActive = this.listDay.filter(data => data.value === this.inputCurrentDay)
                this.selectedTitle = 'กรุณาเลือกวัน';
                this.selectDataList = this.listDay;

                break;
            case 'month':
                this.selectActive = this.listMonth.filter(data => data.value === (this.inputCurrentMonth === "01" ? this.inputCurrentMonth : this.monthList.indexOf(this.inputCurrentMonth)))
                this.selectedTitle = 'กรุณาเลือกเดือน';
                this.selectDataList = this.listMonth;
                break;
            case 'year':
                const filterYear = (this.inputCurrentYear.length > 0 ? this.inputCurrentYear : this.defaultYear)
                this.selectActive = this.listYear.filter(data => data.value === filterYear.toString())
                this.selectedTitle = 'กรุณาเลือกปี';
                this.selectDataList = this.listYear;
                break;
            default:
                break;
        }

        this.showSelector = true
    }

    onSelectData($data) {
        this.showSelector = false;
        const { id, selected } = $data;
        $('#' + this.idClose).show();

        if (selected.data === 'ตลอดชีพ') {
            this.inputCurrentDay = "01"
            this.inputCurrentMonth = "ตลอดชีพ"
            this.inputCurrentMonthValue = "01"
            this.inputCurrentYear = "9999"
        } else {
            if (this.inputCurrentYear === "9999") {
                this.inputCurrentYear = ""
                this.inputCurrentDay = ""
                this.inputCurrentMonth = ""
                this.inputCurrentMonthValue = ""
            }
        }

        switch (id) {
            case 'day':
                this.onValidateDate(selected.value, this.inputCurrentMonth, 'day');
                this.inputCurrentDay = selected.value;
                break;
            case 'month':
                this.onValidateDate(this.inputCurrentDay, this.monthList[selected.value], 'month');

                if (selected.data !== 'ตลอดชีพ') {
                    this.inputCurrentMonth = this.monthList[selected.value];
                }

                if (this.inputCurrentYear !== '9999') {
                    this.inputCurrentMonthValue = Utils.setPadZero(selected.value + 1, 2);
                }
                break;
            case 'year':
                this.inputCurrentYear = selected.value;
                break;
            default:
                break;
        }

        this.onChanged.emit({ day: this.inputCurrentDay, month: this.inputCurrentMonth, monthValue: this.inputCurrentMonthValue, year: this.inputCurrentYear })
    }

    onValidateDate(inputCurrentDay, inputCurrentMonth, type) {
        if (type === 'month') {
            this.checkmonth(inputCurrentMonth, inputCurrentDay);
        } else if (type === 'day') {
            this.checkDay(inputCurrentMonth, inputCurrentDay);
        }
    }

    checkmonth(inputCurrentMonth, inputCurrentDay) {
        switch (inputCurrentMonth) {
            case 'ก.พ.':
                switch (inputCurrentDay) {
                    case '30':
                    case '31':
                        this.inputCurrentDay = "";
                        break
                }
                break;
            case 'เม.ย.':
            case 'มิ.ย.':
            case 'ก.ย.':
            case 'พ.ย.':
                switch (inputCurrentDay) {
                    case '31':
                        this.inputCurrentDay = "";
                        break
                }
                break
        }
    }

    checkDay(inputCurrentMonth, inputCurrentDay) {
        switch (inputCurrentDay) {
            case '30':
                switch (inputCurrentMonth) {
                    case 'ก.พ.':
                        this.inputCurrentMonth = "";
                        break
                }
                break;
            case '31':
                switch (inputCurrentMonth) {
                    case 'ก.พ.':
                    case 'เม.ย.':
                    case 'มิ.ย.':
                    case 'ก.ย.':
                    case 'พ.ย.':
                        this.inputCurrentMonth = "";
                        break
                }
                break
        }
    }

    onUpdateSelectState($event) {
        this.showSelector = $event
    }

    isValid() {
        return this.inputCurrentDay.length > 0
            && this.inputCurrentMonth.length > 0
            && this.inputCurrentYear.length > 0
    }

    getValue() {
        return `${this.inputCurrentDay}/${this.inputCurrentMonth}/${this.inputCurrentYear}`
    }

    public setExpiredDate() {
        this.inputCurrentDay = "01"
        this.inputCurrentMonth = "01"
        this.inputCurrentYear = "9999"

        this.onChanged.emit({ day: this.inputCurrentDay, month: this.inputCurrentMonth, year: this.inputCurrentYear })
    }
}
