/**
 * Created by imac on 7/18/2017 AD.
 */
import {Injectable} from '@angular/core';
import {API, JSONKey} from "../../../share/app.constant";
import {APIService} from "./api.service";
import {Bank} from "../../_model/bank";

@Injectable()
export class MasterDataService {

    constructor(private apiService: APIService) {

    }

    getMasterBank() {
        const param = {};
        const url = API.GetMasterBank;
        return this.apiService.postVIBWithHeader(url, param).map(jsonData => Bank.parseJSONArray(jsonData));
    }

}