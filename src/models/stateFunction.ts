export type State<T> = (item: T[]) => void;

// Project State Functions Class
export class StateFn<T> {
  protected stateManager: State<T>[] = [];

  addState(stateFn: State<T>) {
    this.stateManager.push(stateFn);
  }
}