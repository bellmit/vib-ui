import {Component, OnInit, Input, OnDestroy, AfterViewInit} from '@angular/core';

export enum stateDevice {
    in = 0,
    out = 1,
    stickOut = 2,
    stickIn = 3
}

@Component({
    selector: 'finger-scan-device',
    templateUrl: 'finger-scan-device.component.html',
    styleUrls: ['finger-scan-device.component.sass']
})

export class FingerScanDeviceComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() leftRatio: number = 1;
    private state: stateDevice = null;
    private animate: any = null;
    private $target: any;

    constructor() {
    }

    ngOnInit() {
        const left = $('#fingerbox').width() * this.leftRatio;
        this.$target = $('#finger');
        this.$target.css('left', left);
    }

    ngOnDestroy() {
        if (this.animate !== null) {
            this.animate.pause();
            this.animate = null;
        }
    }

    ngAfterViewInit() {

    }

    public getState(): stateDevice {
        return this.state;
    }

    public stopAnimation() {
        if (this.animate !== null) {
            this.animate.pause();
            this.animate = null;
            this.state = null;
        }
    }

    public stickOut() {
        // const thisState = stateDevice.stickOut;
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
        // this.$target = $('#finger');
        // const t1 = Tweene.get(this.$target).to({opacity: 1, top: 0}, {duration: 1000}, {delay: 500});
        // this.animate = Tweene.line().add(t1);
        // this.animate.play();
    }

    public stickIn() {

        // const thisState = stateDevice.stickIn;
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
        // this.$target = $('#finger');
        // const top = $('#fingerbox').height() * -0.8;
        // const t1 = Tweene.get(this.$target).to({opacity: 1, top: top}, {duration: 1000}, {delay: 500});
        // this.animate = Tweene.line().add(t1);
        // this.animate.play();

    }

    public moveIn() {
        // const thisState = stateDevice.in;
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
        // this.$target = $('#finger');
        // const top = $('#fingerbox').height() * -0.8;
        // const that = this;
        // const t1 = Tweene.get(this.$target).to({opacity: 1, top: top}, {duration: 1000}, {delay: 500});
        // const t2 = Tweene.get(this.$target).to({opacity: 0}, 500);
        // const t3 = Tweene.get(this.$target).to({opacity: 0, top: 0}, 500);
        // const t4 = Tweene.get(this.$target).to({opacity: 1, top: 0}, 500);
        //
        // this.animate = Tweene.line()
        //     .add(t1)
        //     .add(t2)
        //     .add(t3)
        //     .add(t4)
        //     .on('begin', function () {
        //         that.$target.css('top', '0px');
        //     })
        //     .loops(-1);
        //
        // this.animate.play();
    }

    public moveOut() {
        // const thisState = stateDevice.in;
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
        // const t1 = Tweene.get(this.$target).to({top: 0, opacity: 1}, {duration: 1200}, {delay: 500});
        // const t2 = Tweene.get(this.$target).to({opacity: 0}, 700);
        // this.animate = Tweene.line()
        //     .add(t1)
        //     .add(t2)
        //     .on('begin', function () {
        //         that.$target.css('top', top);
        //     })
        //     .loops(-1);
        //
        // this.animate.play();
    }

    public hide() {
        $(".container-animate").hide();
    }

    public show() {
        $(".container-animate").show();
    }
}
