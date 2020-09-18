import {AfterViewInit, Component, OnInit} from '@angular/core';
import {OnMount} from "ng-dynamic";
import {IDatePickerConfig} from "ng2-date-picker";
import {Utils} from "../../../share/utils";
import * as moment from 'moment';
import {isNullOrUndefined} from "util";

@Component({
    selector: 'date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.sass']
})
export class DatePickerComponent implements OnInit, OnMount, AfterViewInit {

    configDatePicker: IDatePickerConfig;
    currentDate;
    minDate = null;
    maxDate = null;
    class = "";

    constructor() {
        this.configDatePicker = Utils.getDatePickerOption(this.currentDate, moment().add(4, 'd'));
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        $(".dp-picker-input").addClass(this.class);

    }

    dynamicOnMount(attr: Map<string, string>, innerHTML: string, el: any) {

        const _currentDate = attr.get("current_date");
        const _minDate = attr.get("min_date");
        const _maxDate = attr.get("max_date");
        const _class = attr.get("class");
        if (!isNullOrUndefined(_currentDate)) {
            this.currentDate = _currentDate;
        }

        if (!isNullOrUndefined(_minDate)) {
            this.minDate = moment(_minDate);
        }

        if (!isNullOrUndefined(_maxDate)) {
            this.maxDate = moment(_maxDate);
        }

        this.class = !isNullOrUndefined(_class) ? _class : this.class;

        this.configDatePicker = Utils.getDatePickerOption(this.minDate, this.maxDate);

        attr.forEach((value, key, map) => {
            console.log(`DatePickerComponent: onMount: key=> ${key}, value=> ${value}`);
        });
    }

}
