import { BaseComponent } from "../models/baseComponent";
import { Validatable, validator } from "../utils/validation";
import { Autobind } from "../utils/autobind";
import { projectState } from "../states/projectState";

// Project Input Class
export class ProjectInput extends BaseComponent<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      super("app", "project-input", true, "user-input");
      this.titleInputElement = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;
      this.configure();
    }
    private gatherUserInput(): [string, string, number] | void {
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = +this.peopleInputElement.value;
      const titleValidatable: Validatable = {
        data: enteredTitle,
        required: true,
        minLength: 2,
        maxLength: 50,
      };
      const descriptionValidatable: Validatable = {
        data: enteredDescription,
        required: true,
        minLength: 5,
        maxLength: 50,
      };
      const peopleValidatable: Validatable = {
        data: enteredPeople,
        required: true,
        minValue: 1,
        maxValue: 5,
      };
  
      if (
        !validator(titleValidatable) ||
        !validator(descriptionValidatable) ||
        !validator(peopleValidatable)
      ) {
        alert("one or more inputs is invalid");
        return;
      } else {
        return [enteredTitle, enteredDescription, enteredPeople];
      }
    }
    private clearInputs() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }
    @Autobind
    private submitHandler(evt: Event) {
      evt.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        projectState.addProjects(title, description, people);
  
        console.log(title, description, people);
        this.clearInputs();
      }
    }
    protected configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
  
    protected renderContent() {}
  }