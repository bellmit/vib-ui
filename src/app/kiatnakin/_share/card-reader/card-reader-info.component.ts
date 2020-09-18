import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

export enum stateInfo {
    unready = 0,
    ready = 1,
    reading = 2,
    success = 3,
    error = 4
}

@Component({
    selector: 'card-reader-info',
    templateUrl: './card-reader-info.component.html',
    styleUrls: ['./card-reader-info.component.sass']
})
export class CardReaderInfoComponent implements OnInit, OnDestroy {

    @Input("textInfoClass") textInfoClass: string = "";

    public stateInfo: typeof stateInfo = stateInfo;
    public state: stateInfo = null;
    private $process: any;
    private $sucess_check: any;
    private $error_line: any;
    private $error_dot: any;
    private $textInfo: any;

    private animate: any = null;
    public textInfo: any = '';
    public customIcon: string = '';

    constructor(private sanitizer: DomSanitizer) {
        this.textInfoClass = "text-blue display-5";
    }

    ngOnInit() {
        this.$process = $('#process');
        this.$sucess_check = $('#sucess_check');
        this.$textInfo = $('#textInfo');
        this.$error_line = $('#error_line');
        this.$error_dot = $('#error_dot');
    }

    ngOnDestroy() {

    }

    public setState(_state: stateInfo, _text: string = "", _customIcon: string = "") {
        console.log('Hello');
        this.customIcon = _customIcon;
        // this.createAnimate(_text, _state);
    }

    public stopAnimation() {
        if (this.animate !== null) {
            this.animate.pause();
            this.animate = null;
            this.state = null;
        }
    }

    private createAnimate(_text: string, _state?: stateInfo) {
        if (this.animate !== null) {
            this.animate.pause();
        }
        this.checkStateUnready(_state, _text);
        this.checkStateReady(_state, _text);
        this.checkStateReading(_state, _text);
        this.checkStateSuccess(_state, _text);
        this.checkStateError(_state, _text);

        if (_state !== this.state) {
            this.state = _state;
            if (this.animate !== null) {
                this.animate.play();
            }
        }

        this.textInfo = this.sanitizer.bypassSecurityTrustHtml(this.textInfo);
    }

    private checkStateUnready(_state, _text) {
        if (_state === stateInfo.unready) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>เชื่อมต่ออุปกรณ์ไม่ได้</p>';
            this.animate = null;
        }
    }

    private checkStateReady(_state, _text) {
        if (_state === stateInfo.ready) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>กรุณาสอดบัตรประจำตัวประชาชน</p><p>เพื่อทำการยืนยัน</p><br/><p>กำลังอ่านข้อมูล...</p>';
            this.animate = null;
        }
    }

    private checkStateReading(_state, _text) {
        if (_state === stateInfo.reading) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>กำลังอ่านข้อมูล</p>';
            this.animate = this.processing();
        }
    }

    private checkStateSuccess(_state, _text) {
        if (_state === stateInfo.success) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>อ่านข้อมูลสำเร็จ</p><p ' + this.textInfoClass + '>กรุณาดึงบัตรออกเพื่อทำขั้นตอนต่อไป</p>';
            this.animate = this.success();
        }
    }

    private checkStateError(_state, _text) {
        if (_state === stateInfo.error) {
            this.textInfo = (_text) ? _text : '<p ' + this.textInfoClass + '>ระบบไม่สามารถทำรายการได้</p><p ' + this.textInfoClass + '>กรุณาสอดบัตรประจำตัวประชาชนอีกครั้ง</p>';
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
