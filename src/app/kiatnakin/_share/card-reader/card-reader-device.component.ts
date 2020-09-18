import {Component, OnInit, OnDestroy} from '@angular/core';

export enum stateDevice {
    in = 0,
    out = 1,
    stickOut = 2,
    stickIn = 3
}

@Component({
    selector: 'card-reader-device',
    templateUrl: './card-reader-device.component.html',
    styleUrls: ['./card-reader-device.component.sass']
})
export class CardReaderDeviceComponent implements OnInit, OnDestroy {

    private stateDevice: typeof stateDevice = stateDevice;
    private state: stateDevice = null;
    private animate: any = null;
    private $target: any;

    constructor() {
    }

    ngOnInit() {
        // this.$target = $('#card');
    }

    ngOnDestroy() {
        // if (this.animate != null) {
        //     this.animate.pause();
        //     this.animate = null;
        // }
    }

    public getState(): stateDevice {
        return this.state;
    }

    public stopAnimation() {
        // if (this.animate != null) {
        //     this.animate.pause();
        //     this.animate = null;
        //     this.state = null;
        // }
    }

    public stickOut(): any {
        const thisState = stateDevice.stickOut;

        if (this.state === thisState) {
            return;
        }
        //
        // if (this.animate !== null) {
        //     this.animate.pause();
        // }
        //
        // this.state = thisState;
        // this.animate = Tweene.get(this.$target).to({opacity: 1, top: 0}, {duration: 1000}, {delay: 500});
        // this.animate.play();
    }

    public stickIn() {
        const thisState = stateDevice.stickIn;

        if (this.state === thisState) {
            return;
        }
        //
        // if (this.animate !== null) {
        //     this.animate.pause();
        // }
        //
        // this.state = thisState;
        // const top = $('#cardbox').height() * -0.4;
        // this.animate = Tweene.get(this.$target).to({opacity: 1, top: top}, {duration: 1000}, {delay: 500});
        // this.animate.play();
    }

    public moveIn(): any {
        console.log('Move IN');
        const thisState = stateDevice.in;

        if (this.state === thisState) {
            return;
        }

        // if (this.animate !== null) {
        //     this.animate.pause();
        // }
        //
        // this.state = thisState;
        // const that = this;
        // const top = $('#cardbox').height() * -0.4;
        // const t1 = Tweene.get(this.$target).to({opacity: 1, top: top}, {duration: 1000}, {delay: 500});
        // const t2 = Tweene.get(this.$target).to({opacity: 0}, 500);
        // const t3 = Tweene.get(this.$target).to({opacity: 0, top: 0}, 500);
        // const t4 = Tweene.get(this.$target).to({opacity: 1, top: 0}, 500);
        // this.animate = Tweene.line()
        //     .add(t1)
        //     .add(t2)
        //     .add(t3)
        //     .add(t4)
        //     .on('begin', function () {
        //         that.$target.css('top', '0px');
        //
        //     })
        //     .loops(-1);
        // this.animate.play();
    }

    public moveOut() {
        // const thisState = stateDevice.out;
        //
        // if (this.state === thisState) {
        //     return;
        // }
        //
        // if (this.animate !== null) {
        //     this.animate.pause();
        // }
        //
        // this.state = thisState;
        // const that = this;
        // const top = $('#cardbox').height() * -0.4;
        // const t1 = Tweene.get(this.$target).to({top: 0, opacity: 1}, {duration: 1200}, {delay: 500});
        // const t2 = Tweene.get(this.$target).to({opacity: 0}, 700);
        // this.animate = Tweene.line()
        //     .add(t1)
        //     .add(t2)
        //     .on('begin', function () {
        //         that.$target.css('top', top);
        //
        //     })
        //     .loops(-1);
        //
        // this.animate.play();
    }
}
