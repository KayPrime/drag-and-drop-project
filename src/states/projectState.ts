import { StateFn } from "../models/stateFunction";
import { Project } from "../types/project-type";
import { ProjectStatus } from "../types/project-type";
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
export const projectState = ProjectState.getinstance();