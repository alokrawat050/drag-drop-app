import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  onDragStart(): void {
    console.log('got drag start');
  }

  onDragMove(event: PointerEvent): void {
    console.log('got drag move', Math.round(event.clientX), Math.round(event.clientY));
  }

  onDragEnd(): void {
    console.log('got drag end');
  }

  trappedBoxes = ['Trapped 1', 'Trapped 2'];

  add(): void {
    this.trappedBoxes.push('New trapped');
  }
}
