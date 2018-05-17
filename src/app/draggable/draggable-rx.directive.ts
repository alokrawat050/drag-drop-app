import { Directive, EventEmitter, HostBinding, HostListener, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { repeat, switchMap, take, takeUntil, mapTo } from 'rxjs/operators';

@Directive({
  selector: '[appDraggableRx]'
})
export class DraggableRxDirective implements OnInit {
  @HostBinding('class.draggable') draggable = true;
  @HostBinding('class.dragging') dragging = false;

  // to trigger pointer-events polyfill
  @HostBinding('attr.touch-action') touchAction = 'none';

  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  private pointerDown = new Subject<PointerEvent>();
  private pointerMove = new Subject<PointerEvent>();
  private pointerUp = new Subject<PointerEvent>();

  @HostListener('pointerdown', ['$event'])
  onpointerDown(event: PointerEvent): void {
    this.pointerDown.next(event);
  }

  @HostListener('document:pointermove', ['$event'])
  onpointerMove(event: PointerEvent): void {
    this.pointerMove.next(event);
  }

  @HostListener('document:pointerup', ['$event'])
  onpointerUp(event: PointerEvent): void {
    this.pointerUp.next(event);
  }

  ngOnInit(): void {
    // stream of dragStart
    // const dragStart$ = this.pointerDown.asObservable();

    this.pointerDown.asObservable()
      // .subscribe(event => this.dragStart.emit(event));
      .subscribe(this.dragStart);

    // test
    // dragStart$.subscribe(() => console.log('got a drag start'));

    // stream the dragMove
    this.pointerDown.pipe(
      switchMap(() => this.pointerMove),
      takeUntil(this.pointerUp),
      repeat()
    ) // .subscribe(event => this.dragMove.emit(event));
    .subscribe(this.dragMove);

    // stream the dragEnd
    this.pointerDown.pipe(
      switchMap(() => this.pointerUp),
      take(1),
      repeat()
    ) // .subscribe(event => this.dragEnd.emit(event));
    .subscribe(this.dragEnd);

    // test
   // dragEnd$.subscribe(() => console.log('got dragged'));

   // dragging true/false
  merge(
    this.dragStart.pipe(mapTo(true)),
    this.dragEnd.pipe(mapTo(false))
  ).subscribe(dragging => {
    this.dragging = dragging;
  });
  }
}
