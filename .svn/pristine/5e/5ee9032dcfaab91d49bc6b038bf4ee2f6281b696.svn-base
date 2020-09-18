import {Pipe, PipeTransform} from "@angular/core";
import {isNullOrUndefined} from "util";

/**
 * Created by imac on 6/8/2017 AD.
 */

@Pipe({
    name: 'idCard'
})
export class IdCardPipe implements PipeTransform {
    transform(value: number): any {

        const formatInput = '0-0000-00000-00-0';
        const idcard = value.toString().split("");
        if (isNullOrUndefined(value)) {
            return "";
        }
        const format = formatInput.split("");

        let idcardtxt = '';
        let i = 0;
        format.forEach(function (data, index) {
            if (data === '0') {
                idcardtxt = idcardtxt + idcard[index - i];
            } else if (data === '-') {
                idcardtxt = idcardtxt + data;
                i++;
            }
        })
        return idcardtxt;
    }
}