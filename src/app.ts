// Code goes here!

//Drag & Drop Interfaces
interface Draggable {
  dragStartHandler(Event: DragEvent): void;
  dragEndHandler(Event: DragEvent): void;
}

interface DropTarget {
  dragOverHandler(Event: DragEvent): void;
  dropHandler(Event: DragEvent): void;
  dragLeaveHandler(Event: DragEvent): void;
}

// Project type
enum ProjectStatus {
  Active,
  Finished,
}

type State<T> = (item: T[]) => void;

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Functions Class
class StateFn<T> {
  protected stateManager: State<T>[] = [];

  addState(stateFn: State<T>) {
    this.stateManager.push(stateFn);
  }
}
// Project State management
class ProjectState extends StateFn<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    super();
  }

  static getinstance() {
    if (this.instance instanceof ProjectState) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addProjects(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.runStates();
  }
  moveProject(id: string, status: ProjectStatus) {
    const project = this.projects.find((project) => project.id === id);
    if (project && project.status !== status) {
      project.status = status;
    }
    this.runStates();
  }

  private runStates() {
    for (const stateFn of this.stateManager) {
      stateFn(this.projects.slice());
    }
  }
}

// Project state instance
const projectState = ProjectState.getinstance();

//  Validatble interface
interface Validatable {
  data: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

// Validator function
function validator(input: Validatable) {
  let isValid: boolean = true;
  if (input.required && input.data !== null) {
    isValid = isValid && input.data.toString().trim().length !== 0;
  }
  if (input.minLength && typeof input.data === "string") {
    isValid = isValid && input.data.trim().length >= input.minLength;
  }
  if (input.maxLength && typeof input.data === "string") {
    isValid = isValid && input.data.trim().length <= input.maxLength;
  }
  if (input.minValue && typeof input.data === "number") {
    isValid = isValid && input.data >= input.minValue;
  }
  if (input.maxValue && typeof input.data === "number") {
    isValid = isValid && input.data <= input.maxValue;
  }
  return isValid;
}

// Autobind Decorator;
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalFunction = descriptor.value;

  const modifiedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFunc = originalFunction.bind(this);
      return boundFunc;
    },
  };
  return modifiedDescriptor;
}

abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
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

// Project Items Class
class ProjectItem
  extends BaseComponent<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }
  constructor(hostElId: string, tempElId: string, project: Project) {
    super(hostElId, tempElId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }
  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(_: DragEvent) {
    console.log("Drag Ended");
  }
  protected configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  protected renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//Project class
class ProjectList
  extends BaseComponent<HTMLDivElement, HTMLElement>
  implements DropTarget
{
  assignedProjects: Project[] = [];

  constructor(private type: "active" | "finished") {
    super("app", "project-list", false, `${type}-projects`);

    this.configure();
    this.renderContent();
  }
  @Autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }
  @Autobind
  dropHandler(event: DragEvent) {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }
  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const project of this.assignedProjects) {
      new ProjectItem(listEl.id, "single-project", project);
    }
  }

  protected renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  protected configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    projectState.addState((projects: Project[]) => {
      const filteredProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });
  }
}

// Project Input Class
class ProjectInput extends BaseComponent<HTMLDivElement, HTMLFormElement> {
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

const project1 = new ProjectInput();
const activeProject = new ProjectList("active");
const finishedProject = new ProjectList("finished");
