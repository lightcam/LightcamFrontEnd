import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selection-buttons',
  templateUrl: './selection-buttons.component.html',
  styleUrls: ['./selection-buttons.component.scss'],
})
export class SelectionButtonsComponent implements OnInit {

  @Input()  activeButtons: Topics[] = [ Topics.ComputerVision, Topics.Photogrammetry, Topics.Robotics ];
  @Input()  activeTopic: Topics;
  @Output() activeTopicChange = new EventEmitter<Topics>();

  Topics = Topics;

  constructor() { }

  ngOnInit() {
    // TODO: better initial active topic selection
    if (!this.activeButtons.includes(this.activeTopic) && this.activeButtons.length > 0) {
      this.onBtnClick(this.activeButtons[0]);
    }
  }

  // When stuff changes (including @Input) re-init component
  ngOnChanges(model: any) {
    this.ngOnInit();

    // Send event via onBtnClick after some time, otherwise the header on the event cards will stay grey
    setTimeout(() => {
      if (this.activeButtons.length > 0) {
        this.onBtnClick(this.activeButtons[0]);
      }
    }, 400);
  }

  onBtnClick(topic: Topics) {
    this.activeTopic = topic;
    this.activeTopicChange.emit(topic);
  }

}

export enum Topics{

  Photogrammetry,
  ComputerVision,
  Robotics,
}
