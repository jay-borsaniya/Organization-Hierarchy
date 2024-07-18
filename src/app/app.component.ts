import { Component, OnInit } from '@angular/core';
import { HierarchyService } from './hierarchy/hierarchy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'organization-hierarchy';

  ngOnInit(): void {
    this.hierarchyService.getData();
  }

  constructor(private hierarchyService: HierarchyService) {}
}
