import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {isNullOrUndefined} from "util";
import {DomSanitizer} from "@angular/platform-browser";

export enum stateInfo {
    unready = 0,
    ready = 1,
    reading = 2,
    success = 3,
    error = 4
}


@Component({
    selector: 'finger-scan-info',
    templateUrl: './finger-scan-info.component.html',
    styleUrls: ['./finger-scan-info.component.sass']
})
export class FingerScanInfoComponent implements OnInit, OnDestroy {

    @Input() textInfo: any = "";
    @Input() textInfoClass: string = "";
    public stateInfo: typeof stateInfo = stateInfo;
    public state: stateInfo = null;
    public customIcon: string = '';
    private $process: any;
    private $sucess_check: any;
    private $error_line: any;
    private $error_dot: any;
    private $textinfo: any;
    private animate: any = null;
    private timerRef;

    constructor(private sanitizer: DomSanitizer) {
        this.textInfoClass = "text-blue display-5";
    }

    ngOnInit() {

        this.$process = $('#fg-process');
        this.$sucess_check = $('#fg-sucess_check');
        this.$textinfo = $('#fg-textInfo');
        this.$error_line = $('#fg-error_line');
        this.$error_dot = $('#fg-error_dot');
    }

    ngOnDestroy() {

        if (!isNullOrUndefined(this.timerRef)) {
            clearInterval(this.timerRef);
        }
    }

    public setState(_state: stateInfo, _text: string = "", _customIcon: string = "") {
        this.state = _state;
        this.customIcon = _customIcon;
        this.createAnimation(_text);
    }

    public stopAnimation() {
        if (this.animate !== null) {
            this.animate.pause();
            this.animate = null;
            this.state = null;
        }
    }

    private createAnimation(_text?: string) {
        if (this.animate !== null) {
            this.animate.pause();
        }
        this.checkStateUnReady(_text);
        this.checkStateReady(_text);
        this.checkStateReading(_text);
        this.checkStateSuccess(_text);
        this.checkStateError(_text);

        if (this.animate !== null || this.customIcon === null) {
            this.animate.play();
        }

        this.textInfo = this.sanitizer.bypassSecurityTrustHtml(this.textInfo);
    }

    private checkStateUnReady(_text) {
        if (this.state === stateInfo.unready) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>เชื่อมต่ออุปกรณ์ไม่ได้</p>';
            this.animate = null;

        }
    }

    private checkStateReady(_text) {
        if (this.state === stateInfo.ready) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>กรุณาแตะนิ้วชี้ขวา</p><p> ที่เครื่องตรวจสอบลายนิ้วมือ</p>';
            this.animate = null;

        }
    }

    private checkStateReading(_text) {
        if (this.state === stateInfo.reading) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>กำลังตรวจสอบข้อมูล</p>';
            this.animate = this.processing();

        }
    }

    private checkStateSuccess(_text) {
        if (this.state === stateInfo.success) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>ตรวจสอบข้อมูลถูกต้อง</p>';
            this.animate = this.success();

        }
    }

    private checkStateError(_text) {
        if (this.state === stateInfo.error) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>ตรวจสอบข้อมูลไม่สำเร็จ</p><p ' + this.textInfoClass + '>กรุณาวางนิ้วอีกครั้ง</p>';
            this.animate = this.error();

        }
    }

    private processing() {
        const that = this;
        const t1 = Tweene.get(this.$process).to({strokeDashoffset: 0, ease: [0.215, 0.61, 0.355, 1]}, {duration: 1500});
        const t2 = Tweene.get(this.$process).to({strokeDashoffset: -300}, {duration: 1000});

        return Tweene.line()
            .add(t1)
            .add(t2, '1s')
            .on('begin', function () {
                that.$process.css('stroke-dashoffset', 300)
                    .css('stroke-dasharray', 300)
                    .css('stroke', '#7DB0D5');
                that.$sucess_check.css('stroke-width', 0);
                that.$error_dot.css('fill', 'none');
                that.$error_line.css('stroke-width', 0);

            })
            .loops(-1);
    }

    private success() {
        const that = this;
        const t1 = Tweene.get(this.$process).to({strokeDashoffset: 0}, {duration: 1500});
        const t2 = Tweene.get(this.$sucess_check).to({
            strokeDashoffset: 0,
            ease: [0.7, 0.435, 0.12, 0.6]
        }, {duration: 1000});

        return Tweene.line()
            .add(t1)
            .on('begin', function () {
                that.$process.css('stroke-dashoffset', 300)
                    .css('stroke-dasharray', 300)
                    .css('stroke', '#009900');
                that.$sucess_check.css('stroke-dashoffset', -257)
                    .css('stroke-width', 8)
                    .css('stroke-dasharray', 285)
                    .css('stroke', '#009900');
                that.$error_dot.css('fill', 'none');
                that.$error_line.css('stroke-width', 0);
                t2.play();
            });
    }

    private error() {
        const that = this;
        const t1 = Tweene.get(this.$process).to({strokeDashoffset: 0}, {duration: 1500});
        const t2 = Tweene.get(this.$error_line).to({strokeDashoffset: 0, ease: [0.7, 0.435, 0.12, 0.6]}, {
            duration: 700,
            delay: 700
        });
        const t3 = Tweene.get(this.$error_dot).to({fill: '#EF8720'}, {duration: 500, delay: 500});

        return Tweene.line()
            .add(t1)
            .on('begin', function () {
                that.$process.css('stroke-dashoffset', 300)
                    .css('stroke-dasharray', 300)
                    .css('stroke', '#EF8720');
                that.$sucess_check.css('stroke-width', 0);
                that.$error_dot.css('fill', 'none');
                that.$error_line.css('stroke-width', 8)
                    .css('stroke-dashoffset', 300)
                    .css('stroke-dasharray', 300)
                    .css('stroke', '#EF8720');
                t2.play();
                t3.play();
            });
    }
}
