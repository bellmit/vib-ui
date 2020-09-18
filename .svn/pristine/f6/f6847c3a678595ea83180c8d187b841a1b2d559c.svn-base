import {Pipe, PipeTransform} from '@angular/core';
import { isNullOrUndefined } from 'util';

@Pipe({name: 'bahttext'})
export class BahtTextPipe implements PipeTransform {
    transform(value: string): string {
        return this.convertThaiBaht(value);
    }

   /**
     * Thank you.
     * http://peacefulkate.blogspot.com
     * customize support 0.01 and 0.1 by Khanate L.
     */
    public convertThaiBaht(amount: string) {
        // validate and clean input amount
        // for (var i = 0; i < Number.length; i++) {
        //     Number = Number.replace(',', '); // clean comman
        //     Number = Number.replace(' ', '); // clean space
        //     Number = Number.replace('บาท', '); // clean unit currency
        //     Number = Number.replace('฿', '); // clean unit currency symbol
        // }
        const txtNumArr = new Array('ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า', 'สิบ');
        const txtDigitArr = new Array('', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน');
        let bahtText = '';
        if (isNullOrUndefined(amount)) {
            return 'ข้อมูลนำเข้าไม่ถูกต้อง';
        } else {
            // check max value can convert
            if ((Number(amount) - 0) > 999999999.9999) {
                return 'ข้อมูลนำเข้าเกินขอบเขตที่ตั้งไว้';
            } else {
                const amountFloat = amount.toString().split('.');
                if (amountFloat.length > 1 && amountFloat[1].length > 0) {
                    amountFloat[1] = amountFloat[1].substring(0, 2);
                }
                const numberLen = amountFloat[0].length - 0;
                let oldTmp = 0;
                for (let i = 0; i < numberLen; i++) {
                    const tmp = Number(amountFloat[0].substring(i, i + 1)) - 0;
                    if (tmp !== 0) {
                        if ((i === (numberLen - 1) || i === (numberLen - 7)) && (tmp === 1) && oldTmp !== 0) {
                            bahtText += 'เอ็ด';
                        } else
                            if (((i === (numberLen - 2)) && (tmp === 2)) || ((i === (numberLen - 8)) && (tmp === 2))) {
                                bahtText += 'ยี่';
                            } else
                                if (((i === (numberLen - 2)) && (tmp === 1)) || ((i === (numberLen - 8)) && (tmp === 1))) {
                                    bahtText += '';
                                } else {
                                    bahtText += txtNumArr[tmp];
                                }
                        bahtText += txtDigitArr[numberLen - i - 1];
                    } else if ((i === (numberLen - 7)) && (tmp === 0)) {
                        bahtText += txtDigitArr[numberLen - i - 1];
                    }
                    oldTmp = tmp;
                }
                if (amountFloat[0] !== '0') {
                    bahtText += 'บาท';
                }
                oldTmp = -1;
                if ((amountFloat.length <= 1)) {
                    bahtText += 'ถ้วน';
                } else {
                    const decimalLen = amountFloat[1].length - 0;
                    for (let i = 0; i < decimalLen; i++) {
                        const tmp = Number(amountFloat[1].substring(i, i + 1)) - 0;
                        if (tmp !== 0) {
                            if ((i === (decimalLen - 1)) && (tmp === 1) && oldTmp === -1) {
                                //bahtText += 'สิบ';
                            } else if ((i === (decimalLen - 1)) && (tmp === 1) && oldTmp !== 0) {
                                bahtText += 'เอ็ด';
                            } else {
                                if ((i === (decimalLen - 2)) && (tmp === 2)) {
                                    bahtText += 'ยี่';
                                } else {
                                    if ((i === (decimalLen - 2)) && (tmp === 1)) {
                                        bahtText += '';
                                    } else {
                                        if (tmp === 2) {
                                            if (amountFloat[1].length > 1) {
                                                bahtText += txtNumArr[tmp];
                                            } else {
                                                bahtText += 'ยี่';
                                            }
                                        } else {
                                            bahtText += txtNumArr[tmp];
                                        }
                                    }
                                }
                            }
                            if (amountFloat[1].length > 1) {
                                bahtText += txtDigitArr[decimalLen - i - 1];
                            } else {
                                bahtText += txtDigitArr[decimalLen - i];
                            }
                        } else {
                            if (tmp !== 0) {
                                if (tmp === 2) {
                                    bahtText += 'ยี่';
                                } else {
                                    bahtText += txtNumArr[tmp];
                                }
                            }
                        }
                        oldTmp = tmp;
                    }
                    bahtText += 'สตางค์';
                }
                return bahtText;
            }
        }
    }

    /*
    public convertbahttext(inputNumber: number): string {
        const that = this;
        const getText = function (input) {

            const toNumber = input.toString();
            const numbers = toNumber.split('').reverse();
            const numberText = "/หนึ่ง/สอง/สาม/สี่/ห้า/หก/เจ็ด/แปด/เก้า/สิบ".split('/');
            const unitText = "/สิบ/ร้อย/พัน/หมื่น/แสน/ล้าน/สิบ/ร้อย/พัน/หมื่น/แสน/ล้าน".split('/');
            let output = "";
            output = that.checkFormatNumber(numbers, numberText, unitText);
            return output;
        };

        const fullNumber = Math.floor(inputNumber);
        let decimal = inputNumber - fullNumber;

        if (decimal === 0) {
            return getText(fullNumber) + "บาทถ้วน";

        } else {
            decimal = decimal * 100;
            decimal = Math.round(decimal);

            if (fullNumber >= 1) {
                return getText(fullNumber) + "บาท" + getText(decimal) + "สตางค์";
            } else {
                return getText(decimal) + "สตางค์";
            }
        }
    }

    public checkFormatNumber(numbers, numberText, unitText) {
        const that = this;
        let output = "";
        for (let i = 0; i < numbers.length; i++) {

            const number = parseInt(numbers[i], 10);
            let text = numberText[number];
            const unit = unitText[i];

            if (number === 0 && i !== 6) {
                continue;
            }

            text += that.checkNumberEleven(numbers, number, i);

            if ((i === 1 || i === 7) && number === 2) {
                output = "ยี่สิบ" + output;
                continue;
            }

            if ((i === 1 || i === 7) && number === 1) {
                output = "สิบ" + output;
                continue;
            }


            output = text + unit + output;
        }
        return output;
    }

    public checkNumberEleven(numbers, number, i) {
        if (numbers.length > 1 && (i === 0 || i === 6) && number === 1) {
            if (numbers.length >= 2) {
                const number2 = parseInt(numbers[i + 1], 10);
                if (number2 !== 0 && !isNaN(number2)) {
                    return "เอ็ด";
                } else {
                    return "";
                }
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
    */
}
