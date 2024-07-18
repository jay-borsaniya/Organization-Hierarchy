import { Component, Input, OnInit } from '@angular/core';
import { Employee } from '../hierarchy.model';
import { HierarchyService } from '../hierarchy.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() employesData: Employee[] = [];
  owner: Employee;
  employeeData: Employee;
  subordinates: Employee[];

  ngOnInit(): void {
    this.hierarchyService.employesData.subscribe((data) => {
      this.owner = data?.[0];
    });
  }

  constructor(private hierarchyService: HierarchyService) {}

  onAdd(event: Event, id: string) {
    event.stopPropagation();
    this.hierarchyService.openDialog(id, 'add');
  }

  onChange(event: Event, id: string) {
    event.stopPropagation();
    this.hierarchyService.openDialog(id, 'change');
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
