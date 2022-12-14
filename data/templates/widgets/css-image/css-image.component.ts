import { Component, ElementRef, HostListener, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { generateId } from '../../common/StrongFB-common';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBService } from '../../services/StrongFB.service';
import { CssImageSchema } from './css-image-interfaces';

@Component({
    selector: 'css-image-widget',
    templateUrl: './css-image.component.html',
    styleUrls: ['./css-image.component.scss']
})
export class StrongFBCssImageWidgetComponent extends StrongFBBaseWidget<CssImageSchema> {
    @ViewChild('imageContent') imageContent: ElementRef<HTMLDivElement>;
    @Input() override schema: CssImageSchema;

    constructor(
        protected override elRef: ElementRef,
        protected srv: StrongFBService,
        protected override cdr: ChangeDetectorRef,
    ) {
        super(elRef, cdr);

    }

    override async onInit() {
        if (this.widgetHeader) {
            this.schema = this.widgetHeader.schema;
        }
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

        if (this.schema.type === 'illustration') {
            this.loadIllustration();
        }
        else if (this.schema.type === 'emoji') {
            this.loadEmoji();
        }

    }

    normalizeSchema(schema: CssImageSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.background) schema.background = 'transparent';
        if (!schema.minHeight) schema.minHeight = '50px';
        switch (schema.size) {
            case 'small':
                schema.height = '200px';
                schema.minHeight = '50px';
                break;
            case 'medium':
                schema.height = '500px';
                schema.minHeight = '100px';
                break;
            case 'large':
                schema.height = '100%';
                schema.minHeight = '200px';
                break;
        }

        return schema;
    }

    loadIllustration() {
        // =>cactus name
        if (this.schema.name === 'cactus') {
            let potWidth = 40;
            if (this.schema.size === 'medium') {
                potWidth = 90;
            } else if (this.schema.size === 'large') {
                potWidth = 150;
            }
            let id = 'el_' + generateId('cacuts');
            this.imageContent.nativeElement.innerHTML = `<div  id="${id}"><div class="george">
            <div class="shadow"></div>
            <div class="george_flower"></div>
            <div class="george_head">
                <div class="line"></div>
                <div class="cheek"></div>
                <div class="eye"></div>
                <div class="eye"></div>
            </div>
            <div class="pot_top"></div>
            <div class="pot_body"></div>
            <div class="pot_plate"></div>
        </div>
        ${this.schema.title ? `<h1>${this.schema.title}</h1>` : ''}
        </div>`;
            this.srv.loadStyleBlock(`
    #${id} {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: ${this.schema.background};
        z-index: 1;
        --pot-width: ${potWidth}px;
        position:relative;
    }

    #${id} h1 {
        position: absolute;
        bottom: -1em;
        font-size: 1.4em;
        opacity: 0.8;
    }
      
    #${id} .george {
        text-align: center;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        position: absolute;
        padding-top: calc(var(--pot-width) * 1.5);
        z-index: 1;
      }
      #${id} .george .pot_top {
        width: calc(var(--pot-width) * 1.5);
        height: 0;
        border-top: calc(var(--pot-width) / 4) solid #dd8740;
        border-left: calc(var(--pot-width) / 22) solid transparent;
        border-right: calc(var(--pot-width) / 22) solid transparent;
      }
      #${id} .george .pot_body {
        width: var(--pot-width);
        height: 0;
        border-top: calc(var(--pot-width) * 0.95) solid #e5a26b;
        border-left: calc(var(--pot-width) / 5) solid transparent;
        border-right: calc(var(--pot-width) / 5) solid transparent;
      }
      #${id} .george .pot_plate {
        width: calc(var(--pot-width) * 1.15);
        height: 0;
        border-top: calc(var(--pot-width) / 5) solid #dd8740;
        border-left: calc(var(--pot-width) / 25) solid transparent;
        border-right: calc(var(--pot-width) / 25) solid transparent;
      }
      #${id} .george .george_flower {
        position: absolute;
        top: 0;
        left: calc(calc(var(--pot-width) * 0.3) + calc(var(--pot-width) / 4));
        height: calc(var(--pot-width) / 3);
        width: calc(var(--pot-width) / 4);
        border-radius: 0 100% 0 100%;
        background-color: #e2641b;
      }
      #${id} .george .george_flower:before {
        content: "";
        top: 0;
        left: calc(var(--pot-width) / 4);
        transform: rotate(70deg);
        position: absolute;
        height: calc(var(--pot-width) / 3);
        width: calc(var(--pot-width) / 4);
        border-radius: 0 100% 0 100%;
        background-color: #e2641b;
      }
      #${id} .george .george_head {
        position: absolute;
        z-index: -1;
        top: calc(var(--pot-width) / 3);
        left: calc(var(--pot-width) * 0.1);
        height: calc(var(--pot-width) * 1.5);
        width: calc(var(--pot-width) * 1.4);
        background-color: #98d30c;
        border-radius: 100%;
      }
      #${id} .george .george_head .line {
        height: calc(var(--pot-width) * 1.5);
        width: calc(var(--pot-width) / 20);
        background-color: #ccf668;
        position: absolute;
        left: calc(var(--pot-width) / 20 * 13);
      }
      #${id} .george .george_head:before {
        content: "";
        display: block;
        height: calc(var(--pot-width) * 1.5);
        width: calc(var(--pot-width) * 1.4 / 1.35);
        border: solid calc(var(--pot-width) / 20) #ccf668;
        border-radius: 100%;
        position: absolute;
        left: calc(var(--pot-width) * 0.125);
      }
      #${id} .george .george_head:after {
        content: "";
        display: block;
        height: calc(var(--pot-width) * 1.5);
        width: calc(var(--pot-width) * 1.4 / 3);
        border: solid calc(var(--pot-width) / 20) #ccf668;
        border-radius: 100%;
        position: absolute;
        left: calc(var(--pot-width) * 0.4);
      }
      #${id} .george .george_head .eye {
        height: calc(var(--pot-width) / 2.5);
        width: calc(var(--pot-width) / 2.5);
        position: absolute;
        background-color: #464d5b;
        border-radius: 100%;
        z-index: 1;
        top: calc(var(--pot-width) / 2);
        left: 0;
      }
      #${id} .george .george_head .eye:before {
        content: "";
        display: block;
        position: absolute;
        height: calc(var(--pot-width) / 12);
        width: calc(var(--pot-width) / 12);
        background-color: #ffffff;
        border-radius: 100%;
        bottom: calc(var(--pot-width) /  20);
        right: calc(var(--pot-width) / 12);
        -webkit-animation: shimmer 0.25s infinite alternate;
                animation: shimmer 0.25s infinite alternate;
      }
      #${id} .george .george_head .eye:after {
        content: "";
        display: block;
        position: absolute;
        height: calc(var(--pot-width) / 4);
        width: calc(var(--pot-width) / 4);
        background-color: #ffffff;
        border-radius: 100%;
        bottom: calc(var(--pot-width) / 10);
        right: calc(var(--pot-width) / 10);
        -webkit-animation: shimmer 0.25s infinite alternate;
                animation: shimmer 0.25s infinite alternate;
      }
      #${id} .george .george_head .eye:last-of-type {
        left: calc(var(--pot-width) / 1.75);
      }
      #${id} .george .george_head .cheek {
        height: calc(var(--pot-width) / 8);
        width: calc(var(--pot-width) / 3.5);
        border-radius: 60%;
        background-color: #f2a4ca;
        position: absolute;
        top: calc(calc(var(--pot-width) / 2) + calc(var(--pot-width) / 3));
        left: calc(-1 * calc(var(--pot-width) / 10));
        z-index: 5;
      }
      #${id} .george .george_head .cheek:after {
        content: "";
        height: calc(var(--pot-width) / 8);
        width: calc(var(--pot-width) / 3.5);
        border-radius: 60%;
        background-color: #f2a4ca;
        position: absolute;
        left: calc(var(--pot-width) / 1.15);
        z-index: 5;
      }
      #${id} .george .shadow {
        height: calc(var(--pot-width) / 4);
        width: calc(var(--pot-width) * 3);
        position: absolute;
        bottom: calc(-1 * calc(var(--pot-width) / 8));
        right: calc(-1 * calc(var(--pot-width) * 0.75));
        background-color: #464d5b;
        opacity: 0.25;
        border-radius: 100%;
        z-index: -10;
      }
      
      @-webkit-keyframes shimmer {
        0% {
            transform: translateX(calc(-1 * calc(var(--pot-width) / 150))) translateY(calc(var(--pot-width) / 150));
          }
          50% {
            transform: translateX(calc(-1 * calc(var(--pot-width) / 150))) translateY(calc(-1 * calc(var(--pot-width) / 150)));
          }
          100% {
            transform: translateX(calc(-1 * calc(var(--pot-width) / 150))) translateY(calc(-1 * calc(var(--pot-width) / 150)));
          }
      }
      
      @keyframes shimmer {
        0% {
            transform: translateX(calc(-1 * calc(var(--pot-width) / 150))) translateY(calc(var(--pot-width) / 150));
          }
          50% {
            transform: translateX(calc(-1 * calc(var(--pot-width) / 150))) translateY(calc(-1 * calc(var(--pot-width) / 150)));
          }
          100% {
            transform: translateX(calc(-1 * calc(var(--pot-width) / 150))) translateY(calc(-1 * calc(var(--pot-width) / 150)));
          }
      }
        `);

        }
    }

    loadEmoji() {
        // =>failed name
        if (this.schema.name === 'failed') {
            let id = 'el_' + generateId('failed');
            this.imageContent.nativeElement.innerHTML = `<div  id="${id}">
            <div class="face2">
              <div class="eye"></div>
              <div class="eye right"></div>
              <div class="mouth sad"></div>
            </div>
            <div class="shadow move"></div>
            <div class="message">${this.schema.title ? `<p>${this.schema.title}</p>` : ''}</div>
        
        </div>`;
            this.srv.loadStyleBlock(`
    #${id} {
            display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: ${this.schema.background};
        z-index: 1;
        position:relative;
    }
    #${id} p{
      margin-top: 1px;
      font-size: 0.8em;
  font-weight: 100;
  color: #5e5e5e;
  letter-spacing: 1px;
    }
      
      #${id} .face2 {
        position: absolute;
        width: 3.8em;
        height: 3.8em;
        background: #FCFCFC;
        border-radius: 50%;
        border: 1px solid #777777;
        top: 21%;
        left: 37.5%;
        z-index: 2;
        animation: roll 3s ease-in-out infinite;
      }
      
      #${id} .eye {
        position: absolute;
        width: 5px;
        height: 5px;
        background: #777777;
        border-radius: 50%;
        top: 40%;
        left: 20%;
      }
      
      #${id} .right {
        left: 68%;
      }
      
      #${id} .mouth {
        position: absolute;
        top: 43%;
        left: 37%;
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }
      
      #${id} .sad {
        top: 49%;
        border: 2px solid;
        border-color: #777777 transparent transparent #777777;
        transform: rotate(45deg);
      }
      
      #${id} .shadow {
        position: absolute;
        width: 21%;
        height: 3%;
        opacity: 0.5;
        background: #777777;
        left: 40%;
        top: 47%;
        border-radius: 50%;
        z-index: 1;
      }
      
      #${id} .scale {
        animation: scale 1s ease-in infinite;
      }
      
      #${id} .move {
        animation: move 3s ease-in-out infinite;
      }

      #${id} .message {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 50%;
      }
      @keyframes scale {
        50% {
          transform: scale(0.9);
        }
      }
      @keyframes roll {
        0% {
          transform: rotate(0deg);
          left: 25%;
        }
        50% {
          left: 60%;
          transform: rotate(168deg);
        }
        100% {
          transform: rotate(0deg);
          left: 25%;
        }
      }
      @keyframes move {
        0% {
          left: 25%;
        }
        50% {
          left: 60%;
        }
        100% {
          left: 25%;
        }
      }
    `);
        }
    }
}
