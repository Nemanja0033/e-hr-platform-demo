import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  @Input() counter: number | undefined;
  @Output() countChange = new EventEmitter<number>();
  // counter = 0;

  inc(){
    // this.counter++;
    this.countChange.emit();
  }

  demo_title = signal("DEMO WORKS, BINDING WORKS!");
  isHidden = signal(false);
  users = [{ name: 'jhon' }, {name: "Ben"}, {name: "Nick"}];

  hideContent(){
    this.isHidden.update((perv) => perv === false ? true : false);
  }

  changeTitle(event: Event) {
    console.log("EVENT", event.target)
  }
}
