import { Injectable } from "@angular/core";
import { Log, Level } from 'ng2-logger'
import { Environment, Utils } from "../../../share/utils";
import { Http } from "@angular/http";
import { environment } from "../../../../environments/environment";
import * as fs from 'fs';

@Injectable()
export class VIBLogger {

    constructor(private http: Http) { }

    debug(topic: string, message: string, ...optionalParams: any[]) {
        if (!environment.isProduction) {
            const log = Log.create(topic);
            message = this.setDateTime(message);
            log.color = 'blue';
            log.data(message, optionalParams);
        }
        this.writeFile(message, optionalParams);
    }

    info(topic: string, message: string, ...optionalParams: any[]) {
        if (!environment.isProduction) {
            const log = Log.create(topic);
            message = this.setDateTime(message);
            log.color = 'green';
            log.info(message, optionalParams);
        }
        this.writeFile(message, optionalParams);
    }

    error(topic: string, message: string, ...optionalParams: any[]) {
        if (!environment.isProduction) {
            const log = Log.create(topic);
            message = this.setDateTime(message);
            log.color = 'red';
            log.error(message, optionalParams);
        }
        this.writeFile(message, optionalParams);
    }

    private setDateTime(message) {
        message = `[${Utils.getCurrentDate("", "yyyy-mm-dd:HH:mm:ss")}] ${message}`;
        return message;
    }

    private writeFile(parameter: string, ...optionalParams: any[]) {
        // this.http.post(Environment.domainLogger, 
        //     {   action: parameter, 
        //         parameter: JSON.stringify(optionalParams) 
        //     }).subscribe();
    }
}