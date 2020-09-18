import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class WebSocketService {
    private socket;

    connect(url: string, option?: any) {
        this.socket = io(url, option);
        return this.socket;
    }

    on(chanel: string) {
        const observable = new Observable(observer => {
            this.socket.on(chanel, (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    emit(chanel: string, data: any) {
        this.socket.emit(chanel, data);
    }
}