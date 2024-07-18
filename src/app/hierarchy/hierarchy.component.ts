import { Component, OnInit } from '@angular/core';
import { HierarchyService } from './hierarchy.service';
import { Employee } from './hierarchy.model';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css'],
})
export class HierarchyComponent implements OnInit {
  employesData: Employee[];

  ngOnInit(): void {
    this.hierarchyService.employesData.subscribe((data) => {
      this.employesData = data;
    });
  }

  constructor(private hierarchyService: HierarchyService) {}
}
