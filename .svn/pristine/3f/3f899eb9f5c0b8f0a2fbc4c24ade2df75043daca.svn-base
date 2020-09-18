import {Component, OnInit, OnDestroy} from '@angular/core';


declare var startRemote: any;
declare var getOrigin: any;

@Component({
    selector: 'app-remote',
    templateUrl: './remote.component.html',
    styleUrls: ['./remote.component.sass']
})
export class RemoteComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit() {
        Remote.startSubscript();

    }

    ngOnDestroy() {
        Remote.stopSubscript();
    }
}
