import { Directive, EventEmitter, HostBinding, HostListener, Output } from "@angular/core";

@Directive({
  selector: '[appNavCollapse]'
})
export class NavCollapse {
  @HostBinding('class.collapsed') isExpanded = false;

  @Output('navExpand') expand = new EventEmitter<boolean>();

  @HostListener('click') toggleOpen() {
    this.isExpanded = !this.isExpanded;
    this.expand.emit(true);
    console.log('toggle expand');
  }
}
