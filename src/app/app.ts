import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Demo } from './demo/demo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Demo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  counter = signal(0);

  increment(){
    this.counter.update((perv) => perv + 1);
  }

  onChildCicked(){
    alert("Child button is clicked");
    this.counter.update((perv) => perv + 1);
  }
}
