export abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
    hostElement: T;
    templateElement: HTMLTemplateElement;
    element: U;
  
    constructor(
      hostElId: string,
      templateElId: string,
      afterbegin: boolean,
      eleId?: string
    ) {
      this.hostElement = document.getElementById(hostElId)! as T;
      this.templateElement = document.getElementById(
        templateElId
      )! as HTMLTemplateElement;
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.childNodes[1] as U;
      if (eleId) {
        this.element.id = eleId;
      }
      this.attach(afterbegin);
    }
    protected abstract configure(): void;
    protected abstract renderContent(): void;
    private attach(position: boolean) {
      this.hostElement.insertAdjacentElement(
        position ? "afterbegin" : "beforeend",
        this.element
      );
    }
  }
  
