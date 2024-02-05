//Drag & Drop Interfaces
export interface Draggable {
    dragStartHandler(Event: DragEvent): void;
    dragEndHandler(Event: DragEvent): void;
  }
  
  export interface DropTarget {
    dragOverHandler(Event: DragEvent): void;
    dropHandler(Event: DragEvent): void;
    dragLeaveHandler(Event: DragEvent): void;
  }