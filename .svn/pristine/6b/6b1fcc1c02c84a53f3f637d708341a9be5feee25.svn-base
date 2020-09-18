import { Pipe, PipeTransform } from "@angular/core";
import { isNullOrUndefined } from "util";
/**
 * Created by imac on 6/8/2017 AD.
 */

@Pipe({
    name: 'toStringNumber'
})
export class ToStringNumberPipe implements PipeTransform {

    transform(value: string, digits: number): any {

        if (isNullOrUndefined(value)) {
            return "";
        }

        value = value.toString().split(",").join("");
        if (value.length === 0) {
            return "";
        }

        const number = Number(value);
        if (isNaN(number)) {
            return "";
        }

        return number.toLocaleString('en-US', { minimumFractionDigits: digits });
    }

    transformtoNumber(value: string): any {

        if (isNullOrUndefined(value)) {
            return "";
        }

        value = value.toString().split(",").join("");
        if (value.length === 0) {
            return "";
        }

        const number = Number(value);
        if (isNaN(number)) {
            return "";
        }

        return number;
    }
}