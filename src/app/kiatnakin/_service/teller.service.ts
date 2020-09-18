import { Injectable, Output, EventEmitter } from '@angular/core';
import { AppConstant, JSONKey, API } from "../../share/app.constant";
import { Router } from "@angular/router";
import { Environment } from "../../share/utils";
import { Observable } from 'rxjs/Rx';
import { isNullOrUndefined } from "util";
import { WebSocketService } from "../_share/websocket.service";
import { DataService } from "../_service/data.service";
import { AbsorptionComponent } from "../service-module/absorption/absorption.component";
import { APIService } from "./api/api.service";
import * as moment from 'moment';

type requestCallback = (data: any) => any;

@Injectable()
export class TellerService {
    @Output() openFunction: EventEmitter<string> = new EventEmitter<string>();
    // private url = Environment.socketTeller;
    private url = Environment.socketTellerAbsorption;
    private isRequestingEDC: boolean = false;
    private socket: SocketIOClient.Socket;
    private absorption: AbsorptionComponent;
    public fromType: string;
    public toType: string;

    constructor(private router: Router,
        private apiService: APIService,
        private dataService: DataService) {

    }

    private connect(url?: string) {

        if (!isNullOrUndefined(url)) {
            if (!isNullOrUndefined(this.socket)) {
                this.socket.disconnect();
            }
            this.socket = null;
            this.url = url;
        }

        if (!this.socket || !this.socket.connected) {
            this.socket = new WebSocketService().connect(this.url, {
                forceNew: false,
                timeout: 500,
                reconnectionDelay: 5000
            });

            this.isRequestingEDC = false;

            this.socket.on("connect", () => {
                console.log(`Teller Connected on ${Environment.machine_id}`);
                this.JoinAbsorpRoom().subscribe()
            });

            this.socket.on("disconnect", () => {
                console.log(`Teller Disconnected on ${Environment.machine_id}`);
            });
        }
    }

    public connectAbsorption() {
        this.url = Environment.socketTellerAbsorption + Environment.machine_id;
        this.checkConnectionTeller()
    }

    public JoinAbsorpRoom() {

        return new Observable(observer => {
            const machine_id = Environment.machine_id;
            this.socket.removeAllListeners()
            // console.log('%c Join Room : ' + machine_id, 'background: #4BB543; color: #FFFFFF')
            this.socket.on("message", (data) => {
                switch (data.status) {
                    case "Teller_request_Absorption":
                        this.dataService.absorption = true;
                        this.dataService.openFunction = 'startTimer';
                        observer.next(this.dataService.openFunction);
                        break;
                    case "Retry":
                        this.dataService.openFunction = 'reStartTimer';
                        observer.next(this.dataService.openFunction);
                        break;
                    case "back":
                        this.dataService.openFunction = 'onClickBack';
                        observer.next(this.dataService.openFunction);
                        break;
                    default:
                        break
                }
            });
        })
    }

    public checkConnectionTeller() {
        console.log("Checking TellerServer Connection");
        if (isNullOrUndefined(this.socket) || !this.socket.connected) {
            console.log(`Try to connect to Teller ${Environment.machine_id}`);
            console.log('TellerService --- bass this.url ->', this.url); // this.url = http://10.202.104.236:5800?machine_id=A001
            this.connect(this.url);

            const sleep = milliseconds => {
                const start = new Date().getTime();
                for (let i = 0; i < 1e7; i++) {
                    if ((new Date().getTime() - start) > milliseconds) {
                        break;
                    }
                }
            };
            sleep(1500);
        }
        else {
            console.log(`TellerServer already connected ${Environment.machine_id}`);
        }
    }

    public SendStatusToTeller(status, machine_id) {
        const jsonData = {
            machine_id: machine_id,
            status: status
        };

        console.log('%c Send STATUS ', 'background: #4BB543; color: #FFFFFF');
        this.socket.emit("message", jsonData);
        this.socket.on("message", (data) => { });
    }

    public SendImgToTeller(transaction, machine_id) {
        const that = this;
        return new Observable(observer => {

            const jsonData = {
                machine_id: machine_id,
                fileName: transaction.fileName,
                base64: transaction.base64,
                status: "Success"
            };

            console.log('%c Send IMG ', 'background: #4BB543; color: #FFFFFF');
            this.socket.emit("message", jsonData);
        });
    }

    public sendApproveTransaction(data) {
        // const data = {
        //   "txn_type": "เปิดบัญชี",
        //   "txn_detail": content,
        //   "cust_name": this.userService.getUser().nameTH,
        //   "cust_cif": this.userService.getUser().kkcisid,
        //   "user_id": this.userService.getUser().idNumber
        // }

        const json = data

        const url = API.CreateApproveList;
        return this.apiService.postVIBWithHeader(url, json, false)

    }

    public checkApproveStatus(id) {
        const json = {
            "date": moment().format("DD/MM/YYYY"),
            "txn_id": id
        }

        const url = API.InquiryApproveList;
        return this.apiService.postVIBWithHeader(url, json, false)
    }

    public clearAllListener() {
        if (this.socket !== null) {
            this.socket.removeAllListeners();
        }
    }
}
