import { Injectable } from '@angular/core';
import { AppConstant, JSONKey, API } from "../../../share/app.constant";
import { APIService } from "./api.service";
import { Product } from 'app/kiatnakin/_model/Product';

@Injectable()
export class ProductService {
    constructor(private apiService: APIService) {
    }


    ProductNeed() {
        const json = {}
        const url = API.ProductNeed;
        return this.apiService.postVIBWithHeader(url, json)
    }

    ProductList(prodType, needType) {
        const json = {
            'prod_type': prodType,
            'need_type': needType
        }
        const url = API.ProductList;
        return this.apiService.postVIBWithHeader(url, json)
    }
    ProductListType(prodType, needType) {
        const json = {
            'prod_type': prodType,
            'need_type': needType
        }

        const url = API.ProductList;
        return this.apiService.postVIBWithHeader(url, json)
    }

    ProductDetail() {
        const json = {}
        const url = API.ProductDetail;
        return this.apiService.postVIBWithHeader(url, json)
    }
}