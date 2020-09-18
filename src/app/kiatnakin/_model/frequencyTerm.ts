import {isNullOrUndefined} from "util";
/**
 * Created by imac on 6/30/2017 AD.
 */


export class FrequencyTerm {

    flagDefault: string;
    frequency: string;
    frequencyDesc: string;

    public static parseJSONArray(jsonData: any) {
        const dataList = jsonData.tdPayoutFrequencyData;

        const list = new Array();

        if (isNullOrUndefined(dataList)) {
            return list;
        }

        if (dataList.constructor === Array) {
            for (const data of dataList) {
                list.push(new FrequencyTerm(data));
            }
        }
        else {
            list.push(new FrequencyTerm(dataList));
        }

        return list;

    }

    constructor(jsonData: any) {

        if (!isNullOrUndefined(jsonData)) {

            this.flagDefault = jsonData.flagDefault;
            this.frequency = jsonData.frequency;
            this.frequencyDesc = jsonData.frequencyDesc;
        }
    }

}