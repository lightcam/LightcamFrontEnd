import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineElementDirective } from './timeline-element.directive';


@NgModule({
  declarations: [
    TimelineElementDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TimelineElementDirective,
  ]
})
export class DirectivesModule { }
