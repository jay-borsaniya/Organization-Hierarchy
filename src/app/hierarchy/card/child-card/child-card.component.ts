import { Component, Input } from '@angular/core';
import { HierarchyService } from '../../hierarchy.service';
import { Employee } from '../../hierarchy.model';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.css', '../card.component.css'],
})
export class ChildCardComponent {
  @Input() employesData: Employee[];
  employeeData: Employee;
  subordinates: Employee[];

  isActive: string;

  constructor(private hierarchyService: HierarchyService) {}

  onAdd(event: Event, id: string) {
    event.stopPropagation();
    this.hierarchyService.openDialog(id, 'add');
  }

  onRemove(event: Event, id: string) {
    event.stopPropagation();
    this.hierarchyService.openDialog(id, 'remove');
  }

  onShowSubordinates(employeeData: Employee) {
    this.subordinates = null;

    if (this.isActive === employeeData.id) {
      this.isActive = null;
    } else {
      this.isActive = employeeData.id;
    }

    if (employeeData.subordinates) {
      if (this.isActive) {
        this.hierarchyService.employesData.subscribe((data) => {
          this.subordinates = data.filter((obj) =>
            employeeData.subordinates.includes(obj.id)
          );
        });
      } else {
        this.subordinates = null;
      }
    } else {
      this.subordinates = null;
    }
  }

  toggleSubordinates(employeeData: Employee) {
    if (employeeData.subordinates) {
      if (this.isOpen(employeeData.id)) {
        this.hierarchyService.removeEmployeeAndSubordinates(employeeData.id);
      } else if (this.isOpen(employeeData.managerId)) {
        this.hierarchyService.removeEmployeeAndSubordinates(
          this.employeeData?.id
        );
        this.hierarchyService.setOpenEmployeeId(employeeData.id);
      } else {
        this.hierarchyService.setOpenEmployeeId(employeeData.id);
      }

      if (this.isOpen(employeeData.id)) {
        this.hierarchyService.employesData.subscribe((data) => {
          this.subordinates = this.getSubordinateEmployees(
            data,
            employeeData.subordinates
          );
        });
      } else {
        this.subordinates = null;
      }
    } else {
      this.subordinates = null;
    }

    this.employeeData = employeeData;
  }

  isOpen(id: string): boolean {
    return this.hierarchyService.isEmployeeOpen(id);
  }

  getSubordinateEmployees(
    data: Employee[],
    subordinates: string[]
  ): Employee[] {
    return data.filter((emp) => subordinates.includes(emp.id));
  }
}
