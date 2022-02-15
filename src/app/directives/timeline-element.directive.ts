import { Directive, ElementRef, Input, OnInit, Renderer2, HostBinding, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appTimelineElement]'
})
export class TimelineElementDirective implements AfterViewInit {

  @Input('appTimelineElement') order;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngAfterViewInit() {

    // console.log("ciao");
    //
    // console.log("ciao " + this.order);

    this.renderer.setStyle(this.el.nativeElement, 'order', this.order);
  }
}
