import { isNullOrUndefined } from "util";
import { LocalStorage } from "ngx-webstorage";
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { Observable } from "rxjs/Rx";
import { AppConstant } from "./app.constant";

/**
 * Created by imac on 3/14/2017 AD.
 */

export const Environment = environment;

export class Utils {

    @LocalStorage("runningNumber")
    static runningNumber: number;

    static validateNationalID(id): boolean {

        if (!isNullOrUndefined(id)) {

            let sum: number;
            let i: number;
            if (id.length !== 13) {
                return false;
            }

            for (i = 0, sum = 0; i < 12; i++) {
                sum += parseFloat(id.charAt(i)) * (13 - i);
            }

            if ((11 - sum % 11) % 10 !== parseFloat(id.charAt(12))) {
                return false;
            }
            else {
                return true;
            }

        }
        else {
            return false;
        }
    }

    static getCurrentDate(prefix: string = "", format: string = "yyyy-mm-dd") {
        const now = new Date();
        return `${prefix}${dateFormat(now, format)}`;
    }

    static convertDate(date: string, fromFormat: string, toFormat: string) {
        return moment(date, fromFormat).format(toFormat);
    }

    static convertDateToAPI(date: string, toFormat: string) {
        date = new Date(date).toLocaleString(`en-TH`, { timeZone: `Asia/Bangkok` })
        return moment(date).format(toFormat);
    }

    static convertDateAsia(date: string, fromFormat: string, toFormat: string) {
        date = new Date(date).toLocaleString(`en-TH`, { timeZone: `Asia/Bangkok` })
        return moment(date, fromFormat).format(toFormat);
    }

    static getReferenceNo() {
        if ((Utils.runningNumber + "").length > 5) {
            Utils.runningNumber = 0;
        }
        Utils.runningNumber++;
        return `${Utils.getCurrentDate(Environment.machine_id, "yyyymmdd")}${Utils.setPadZero(Utils.runningNumber, 5)}`;
    }

    static AnnoDominiYeartoBuddhistYear(year) {
        return moment(year, 'YYYY').add(543, 'years').year().toString()
    }

    static getDatePickerOption(minDate = null, maxDate = null) {
        moment.locale('th');

        const option = {
            monthFormat: "MMM , YYYY",
            format: "DD/MM/YYYY",
            weekdayNames: {
                su: '?????????????????????',
                mo: '??????????????????',
                tu: '??????????????????',
                we: '?????????',
                th: '???????????????',
                fr: '???????????????',
                sa: '???????????????'
            },
            min: minDate,
            max: maxDate,
            dayBtnFormat: "D",
            monthBtnFormat: "MMMM",
            disableKeypress: true
        };
        return option;
    }

    static setPadZero(value: any, size: number) {

        while (value.toString().length < (size || 2)) {
            value = "0" + value;
        }
        return value;
    }

    static toStringNumber(numberWithFormat: string) {
        return numberWithFormat.split(',').join('');
    }

    static getCountDigit(number_string) {
        if (isNullOrUndefined(number_string)) {
            return 0;
        }

        const digitAmount = number_string.split('.')[1];
        return isNullOrUndefined(digitAmount) ? 0 : digitAmount.length;
    }

    static animate(elementId: string, animation: string) {

        return new Promise((resolve) => {
            if ($(elementId).length === 0) {
                resolve();
            }
            else {
                $(elementId).show().addClass(`animated ${animation}`);
                $(elementId).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    resolve();
                });
            }
        });
    }

    static removeClass(elementId: string, className: string) {
        $(elementId).removeClass(className);
    }

    static splitMICRNumber(micrNumber) {
        const data = micrNumber.split("@");

        if (data.length < 2 || isNullOrUndefined(data[2])) {
            return null;
        }
        const bank_code = data[2].split("-")[0];

        const temp = data[2].split("-")[1];
        if (isNullOrUndefined(temp)) {
            return null;
        }
        const office_no = temp.split("[")[0];
        const account_no = temp.split("[")[1];
        if (isNullOrUndefined(data[3])) {
            return null;
        }
        const cheque_type = data[3];

        return {
            cheque_no: data[1],
            bank_code: this.setPadZero(bank_code, 3),
            branch_code: office_no,
            account_no: account_no,
            chequeType: cheque_type
        }
    }

    static getClientIP() {
        return window.location.hostname;
    }

    static idCardformat(idcard) {
        let idcardtxt = '';
        const format = '0-0000-00000-00-0'.split("");
        const value = idcard.split("");
        let i = 0;
        format.forEach(function (data2, index) {
            if (data2 === '0') {
                idcardtxt = idcardtxt + value[index - i];
            } else if (data2 === '-') {
                const data3 = '-';
                idcardtxt = idcardtxt + data3;
                i++;
            }
        });
        return idcardtxt;
    }

    static subDistrict(district) {
        let districtstr = '';
        if (!isNullOrUndefined(district)) {
            if (district.match('?????????')) {
                districtstr = district.substring(3);
            } else if (district.match('???????????????')) {
                districtstr = district.substring(5);
            } else {
                districtstr = district;
            }
        }
        return districtstr;
    }

    static subSubDistrict(subdistrict) {
        let subdistrictstr = '';
        if (!isNullOrUndefined(subdistrict)) {
            if (subdistrict.match('????????????')) {
                subdistrictstr = subdistrict.substring(4);
            } else if (subdistrict.match('????????????')) {
                subdistrictstr = subdistrict.substring(4);
            } else {
                subdistrictstr = subdistrict
            }
        }
        return subdistrictstr;
    }

    static subProvince(province) {
        let provincestr = '';
        if (!isNullOrUndefined(province)) {
            if (province.match('?????????????????????')) {
                provincestr = province.substring(7);
            } else {
                provincestr = province;
            }
        }
        return provincestr;
    }

    static subVillage(village) {
        let villagestr = '';
        if (!isNullOrUndefined(village)) {
            villagestr = village.substring(8);
        }
        return villagestr
    }

    static getshotMonth(month) {

        let monthtxt = '';
        monthtxt = this.checkshotMonth1(month);
        if (isNullOrUndefined(monthtxt) || monthtxt === '') {
            monthtxt = this.checkShotMonth2(month);
        }
        return monthtxt
    }

    static checkshotMonth1(month) {
        switch (month) {
            case '01':
                return '???.???.';
                break;
            case '02':
                return '???.???.';
                break;
            case '03':
                return '??????.???.';
                break;
            case '04':
                return '??????.???.';
                break;
            case '05':
                return '???.???.';
                break;
            case '06':
                return '??????.???.';
                break;
        }
    }

    static checkShotMonth2(month) {
        switch (month) {
            case '07':
                return '???.???.';
                break;
            case '08':
                return '???.???.';
                break;
            case '09':
                return '???.???.';
                break;
            case '10':
                return '???.???.';
                break;
            case '11':
                return '???.???.';
                break;
            case '12':
                return '???.???.';
                break;
        }
    }

    static getshotMonthEN(month) {
        let monthtxt = '';
        monthtxt = this.checkShotMonthEN1(month);
        if (isNullOrUndefined(monthtxt) || monthtxt === '') {
            monthtxt = this.checkShotMonthEN2(month);
        }
        return monthtxt
    }

    static checkShotMonthEN1(month) {
        switch (month) {
            case '01':
                return 'Jan';
                break;
            case '02':
                return 'Feb';
                break;
            case '03':
                return 'Mar';
                break;
            case '04':
                return 'Apr';
                break;
            case '05':
                return 'May';
                break;
            case '06':
                return 'Jun';
                break;
        }
    }

    static checkShotMonthEN2(month) {
        switch (month) {
            case '07':
                return 'Jul';
                break;
            case '08':
                return 'Aug';
                break;
            case '09':
                return 'Sep';
                break;
            case '10':
                return 'Oct';
                break;
            case '11':
                return 'Nov';
                break;
            case '12':
                return 'Dec';
                break;
        }
    }

    static getMinusYearEn(year) {
        const years = year - 543;
        return years
    }

    static getMonthtoNumber(month) {

        let monthtxt = '';
        monthtxt = this.checkMonthToNumber1(month);
        if (isNullOrUndefined(monthtxt) || monthtxt === '') {
            monthtxt = this.checkMonthToNumber2(month);
        }

        return monthtxt
    }

    static checkMonthToNumber1(month) {
        switch (month) {
            case '??????????????????':
                return '01';
                break;
            case '??????????????????????????????':
                return '02';
                break;
            case '??????????????????':
                return '03';
                break;
            case '??????????????????':
                return '04';
                break;
            case '?????????????????????':
                return '05';
                break;
            case '????????????????????????':
                return '06';
                break;
        }
    }

    static checkMonthToNumber2(month) {
        switch (month) {
            case '?????????????????????':
                return '07';
                break;
            case '?????????????????????':
                return '08';
                break;
            case '?????????????????????':
                return '09';
                break;
            case '??????????????????':
                return '10';
                break;
            case '???????????????????????????':
                return '11';
                break;
            case '?????????????????????':
                return '12';
                break;
        }
    }

    static getMonthShottoNumber(month) {
        let monthtxt = '';
        monthtxt = this.checkMonthShotToNumber1(month);
        if (isNullOrUndefined(monthtxt) || monthtxt === '') {
            monthtxt = this.checkMonthShotToNumber2(month);
        }
        return monthtxt
    }

    static checkMonthShotToNumber1(month) {
        switch (month) {
            case '???.???.':
                return '01';
                break;
            case '???.???.':
                return '02';
                break;
            case '??????.???.':
                return '03';
                break;
            case '??????.???.':
                return '04';
                break;
            case '???.???.':
                return '05';
                break;
            case '??????.???.':
                return '06';
                break;
        }
    }

    static checkMonthShotToNumber2(month) {
        switch (month) {
            case '???.???.':
                return '07';
                break;
            case '???.???.':
                return '08';
                break;
            case '???.???.':
                return '09';
                break;
            case '???.???.':
                return '10';
                break;
            case '???.???.':
                return '11';
                break;
            case '???.???.':
                return '12';
                break;
            case '?????????????????????':
                return '01';
                break;
        }
    }

    static getMonthtoShotMonth(month) {

        let monthtxt = '';
        monthtxt = this.checkMonthToShotMonth1(month);
        if (isNullOrUndefined(monthtxt) || monthtxt === '') {
            monthtxt = this.checkMonthToShotMonth2(month);
        }
        return monthtxt
    }

    static checkMonthToShotMonth1(month) {
        switch (month) {
            case '??????????????????':
                return '???.???.';
                break;
            case '??????????????????????????????':
                return '???.???.';
                break;
            case '??????????????????':
                return '??????.???.';
                break;
            case '??????????????????':
                return '??????.???.';
                break;
            case '?????????????????????':
                return '???.???.';
                break;
            case '????????????????????????':
                return '??????.???.';
                break;
        }
    }

    static checkMonthToShotMonth2(month) {
        switch (month) {
            case '?????????????????????':
                return '???.???.';
                break;
            case '?????????????????????':
                return '???.???.';
                break;
            case '?????????????????????':
                return '???.???.';
                break;
            case '??????????????????':
                return '???.???.';
                break;
            case '???????????????????????????':
                return '???.???.';
                break;
            case '?????????????????????':
                return '???.???.';
                break;
        }
    }

    static changeDateFormat(value) {
        const date = value.sum.split('/');

        const days = date[0];
        const months = date[1];
        const year = date[2];

        const years = year - 543;
        const dates = years + '-' + months + '-' + Utils.setPadZero(days, 2);

        return dates;
    }

    static changeDateFormat2(value) {
        const date = value.split('/');
        const day = date[0];
        const mounth = Utils.getshotMonth(date[1]);
        const year = new Date(date[2]).getFullYear() + 543;
        const dates = day + " " + mounth + " " + year;
        return dates;
    }

    static changeDateFormat3(value) {
        const date = value;
        const days = date[0];
        const months = date[1];
        const year = date[2];

        const years = year - 543;
        const dates = years + '-' + months + '-' + days;
        return dates;
    }


    static dateNow() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        let Months: string;
        let Days: string;
        if (month.toString().length === 1) {
            Months = '0' + month.toString();
        } else {
            Months = month.toString();
        }

        if (day.toString().length === 1) {
            Days = '0' + day.toString();
        } else {
            Days = day.toString();
        }

        return year + '-' + Months + '-' + Days;
    }

    static minus3Months() {
        const today = new Date();
        today.setMonth(today.getMonth() - 3);
        return moment(today).format('YYYY-MM-DD');
    }

    static checkIsEmail(value) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    }

    static markAccountNumber(accountNo) {
        let mark = "";
        function replaceRange(s, start, end, substitute) {
            return s.substring(0, start) + substitute + s.substring(end);
        }
        if (accountNo.length === 14) {
            mark = "xxxxxxxxxx"
        } else if (accountNo.length === 0) {
            mark = ""
        } else {
            mark = "xxxxxx"
        }
        return replaceRange(accountNo, 0, accountNo.length - 4, mark);
    }

    static replaceEnter(Text) {
        return Text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

    static shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    static timeout(time) {
        return Observable.timer(0, 1000).map(i => time - i).take(time + 1)
    }

    static logDebug(method: string, process: string) {
        console.log('[' + method + '] -> ' + process);
    }

    static checkEmptyValue(data: any) {
        if (isNullOrUndefined(data)) {
            return "";
        } else {
            return data;
        }
    }

    static replaceAll(value: string, replaceValue: string, replaceToValue: string) {
        return value.replace(new RegExp(replaceValue, 'g'), replaceToValue);
    }

    static validateThaiCitizenID(idCard: string): boolean {
        if (idCard.length !== 13
            || idCard.charAt(0).match(/[09]/)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(idCard.charAt(i), 10) * (13 - i);
        }

        if ((11 - sum % 11) % 10 !== parseInt(idCard.charAt(12), 10)) {
            return false;
        }

        return true;
    }
}
