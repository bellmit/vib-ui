import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from "@angular/http";
import { Headers } from '@angular/http';
import "rxjs/Rx";
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { JSONKey, AppConstant, API } from "../../../share/app.constant";
import { Observable } from "rxjs/Rx";
import { Environment, Utils } from "../../../share/utils";
import { isNullOrUndefined } from "util";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { VIBLogger } from "../logger/logger";
import { DataService } from 'app/kiatnakin/_service/data.service';
import { SessionStorageService } from "ngx-webstorage";
import { LocalStorageService } from "ngx-webstorage";
import { DatePipe } from '@angular/common';

const responseCode = {
    success: 200,
    failure: 1
};

@Injectable()
export class APIService {
    static logger;
    providers: [HttpClient]

    constructor(
        private http: Http,
        public VIBlogger: VIBLogger,
        private sessionStorageService: SessionStorageService,
        private localStorageService: LocalStorageService,
        private datePipe: DatePipe,
        private https: HttpClient,
        private dataService: DataService) {
        APIService.logger = this.VIBlogger;
    }

    private getHeaderNewVIB(): Headers {
        const header = new Headers();
        const dateNow = new Date;
        const timeMillisecond = dateNow.getMilliseconds();
        const refId = this.datePipe.transform(dateNow, 'yyyyMMddHHmmss') + timeMillisecond;
        header.append('Content-Type', 'application/json;charset=utf-8');
        header.append('TokenAccess', this.sessionStorageService.retrieve("tellertoken"));
        header.append('ReferenceNo', refId);
        header.append('MachineId', Environment.machine_id);
        return header;
    }

    get(url: string, header: any = {}) {
        APIService.logger.debug("API Service", "=> Requesting", url, header);
        header = this.getHeader(header);
        return this
            .http
            .get(url, { headers: header })
            .timeout(Environment.requestTimeout)
            .map(res => this.extractData(res, true))
            .catch(this.handleError);
    }

    post(url: string, parameter, header: any = {}) {
        APIService.logger.debug("API Service", "=> Requesting", url, parameter, header, JSON.stringify(parameter));
        header = this.getHeader(header);
        return this
            .http
            .post(url, parameter, { headers: header })
            .timeout(Environment.requestTimeout)
            .map(res => this.extractData(res, true))
            .catch(this.handleError);
    }

    postMfs(url: string, parameter, header: any = {}) {
        APIService.logger.debug("API Service", "=> Requesting", url, parameter, header, JSON.stringify(parameter));
        header = this.getHeader(header);
        const body = this
            .http
            .post(url, parameter, { headers: header })
            .timeout(Environment.requestTimeout)
            .map(res => {
                return this.extractMfsData(res, true);
            })
            .catch(this.handleError);
        return body
    }

    postVIBWithHeader(url: string, parameter, closeModalLoadingWhenFinished: boolean = true) {
        // APIService.logger.debug("API Service", "=> Requesting", url, JSON.stringify(this.getHeaderNewVIB()), JSON.stringify(parameter));
        return this.http
            .post(url, parameter, { headers: this.getHeaderNewVIB() })
            .timeout(Environment.requestTimeout)
            .map(res => this.extractData(res, closeModalLoadingWhenFinished))
            .catch(this.handleError);
    }

    postPDF(url: string, parameter, header: any = {}) {
        APIService.logger.debug("API Service", "=> Requesting", url, parameter, header, JSON.stringify(parameter));
        header = this.getHeader(header);
        return this
            .http
            .post(url, parameter)
            .timeout(Environment.requestTimeout)
            .map(this.extractDataPDF)
            .catch(this.handleError);

    }

    private extractData(res: Response, closeModalLoadingWhenFinished: boolean) {
        APIService.logger.info("API Service", "=> Response", res.url, res.json(), JSON.stringify(res.json()));
        if (closeModalLoadingWhenFinished) {
            Modal.hide();
        }
        const body = res.json();
        if (body.header.success !== true) {
            if (body.header.serviceName.toLowerCase() === 'CheckCustomer'.toLowerCase()
                && body.responseStatus.responseCode === 'CBS-M-2001') {
                body.data = {
                    customerExist: false
                };

            } else if (body.header.serviceName.toLowerCase() === 'GetTDPassbook'.toLowerCase()
                && body.responseStatus.responseCode === 'CBS-M-2001') {
                body.data = {};
            } else if (body.header.serviceName.toLowerCase() === 'gettdaccountdetailbyaccountno'.toLowerCase()
                && body.responseStatus.responseCode === 'CBS-M-2001') {
                body.data = {
                    'responseCode': body.responseStatus.responseCode,
                    'responseMessage': body.responseStatus.responseMessage
                };

            } else if (body.header.serviceName.toLowerCase() === 'gettermdepositlist'.toLowerCase()
                && body.responseStatus.responseCode === 'CBS-M-2001') {
                body.data = {};
            } else if (body.header.serviceName.toLowerCase() === 'InquiryOutstanding'.toLowerCase()
                && body.data === null) {
                body.data = null;
            } else {
                throw body;
            }
        }
        return body || {};
    }

    public extractMfsData(res: Response, closeModalLoadingWhenFinished: boolean) {
        APIService.logger.info("API Service", "=> Response", res.url, res.json(), JSON.stringify(res.json()));
        if (closeModalLoadingWhenFinished) {
            Modal.hide();
        }
        const body = res.json();
        if (body.header.success !== true) {
            if (body.header.serviceName.toLowerCase() === 'InquiryCurrentCustSuitScore'.toLowerCase()
                && body.data === null) {
                body.data = null;
            } else {
                throw body;
            }
        }
        return body || {};
    }

    private extractDataPDF(res: Response) {
        let value = "False"
        if (!isNullOrUndefined(res["_body"])) {
            value = "Success";
        }
        APIService.logger.info("API Service", "=> Response", res.url, value);
        Modal.hide();
        const body = res["_body"]
        return body || {};
    }

    private handleError(error: Response | any) {
        Modal.hide();
        APIService.logger.error("API Service", "=> Response Error", error);
        if (!isNullOrUndefined(error.message)) {
            error = {
                responseStatus: {
                    responseMessage: error.message
                }
            }
        } else if (!error.hasOwnProperty("responseStatus")) {
            error = {
                responseStatus: {
                    responseMessage: "Cannot connect to server"
                }
            }
        }
        return Observable.throw(error);
    }

    private getHeader(header: any) {
        header["Content-Type"] = "application/json;charset=utf-8";
        header["TokenAccess"] = this.sessionStorageService.retrieve("tellertoken");
        header[JSONKey.ReferenceNo] = Utils.getReferenceNo();
        header[JSONKey.MachineId] = Environment.machine_id
        return header;
    }

    getHrefLinkPDF(url: string) {
        const header = this.headerGetHrefLinkPDF();
        return this.https.get(url, { headers: header, responseType: 'text', observe: 'response' }).catch(this.handleError);
    }

    downloadFundFactSheet(url, parameter) {
        const header = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(url, parameter, { headers: header, responseType: ResponseContentType.Blob }).catch(this.handleError);
    }

    headerGetHrefLinkPDF() {
        let header: HttpHeaders = new HttpHeaders();
        header = header.append('Content-Type', 'text/plain; charset=utf-8');
        return header;
    }
}
