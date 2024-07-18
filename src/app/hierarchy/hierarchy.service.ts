import { Injectable } from '@angular/core';
import { Employee } from './hierarchy.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeDialogComponent } from './card/add-employee-dialog/add-employee-dialog.component';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, catchError, take, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class HierarchyService {
  employesData = new BehaviorSubject<Employee[]>(null);

  private openEmployeeIds: string[] = [];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  generateUUID() {
    return uuidv4();
  }

  setOpenEmployeeId(id: string) {
    const index = this.openEmployeeIds.indexOf(id);
    if (index === -1) {
      this.openEmployeeIds.push(id);
    } else {
      this.openEmployeeIds.splice(index + 1);
    }
  }

  removeEmployeeAndSubordinates(id: string) {
    const index = this.openEmployeeIds.indexOf(id);
    if (index !== -1) {
      this.openEmployeeIds.splice(index);
    }
  }

  isEmployeeOpen(id: string): boolean {
    return this.openEmployeeIds.includes(id);
  }

  openDialog(id: string, type: string): void {
    if (type === 'add') {
      const userId = this.generateUUID();
      const addDialogRef = this.dialog.open(AddEmployeeDialogComponent, {
        width: '500px',
        data: {
          userId: userId,
          managerId: id,
          type: type,
        },
      });

      addDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.employesData.pipe(take(1)).subscribe((data) => {
            data.push(result);
            const parent = data.find((obj) => obj.id === result.managerId);
            if (parent.subordinates) {
              parent.subordinates.push(result.id);
            } else {
              parent.subordinates = [result.id];
            }

            this.setData(data);
          });
        }
      });
    } else if (type === 'change') {
      let employeeList: Employee[];
      this.employesData.subscribe((data) => {
        employeeList = data;
      });

      const changeDialogRef = this.dialog.open(AddEmployeeDialogComponent, {
        width: '500px',
        data: {
          type: type,
          employeeList: employeeList,
        },
      });

      changeDialogRef.afterClosed().subscribe((result) => {
        if (result && result?.owner !== id) {
          this.employesData.pipe(take(1)).subscribe((data) => {
            const obj = data.find((obj) => obj.id === result?.owner);
            const objIndex = data.indexOf(obj);
            if (obj) {
              const tmp = JSON.parse(JSON.stringify(data[0]));

              data[0].name = obj.name;
              data[0].email = obj.email;
              data[0].imageUrl = obj.imageUrl;

              data[objIndex].name = tmp.name;
              data[objIndex].email = tmp.email;
              data[objIndex].imageUrl = tmp.imageUrl;
            }

            this.setData(data);
          });
        }
      });
    } else if (type === 'remove') {
      const changeDialogRef = this.dialog.open(AddEmployeeDialogComponent, {
        width: '500px',
        data: {
          type: type,
        },
      });

      changeDialogRef.afterClosed().subscribe((result) => {
        if (result?.confirm) {
          this.employesData.pipe(take(1)).subscribe((data) => {
            const index = data.findIndex((obj) => obj.id === id);
            const parentId = data[index].managerId;
            const parentObj = data.find((obj) => obj.id === parentId);
            parentObj.subordinates = parentObj.subordinates.filter(
              (obj) => obj !== id
            );
            const updatedData = data.filter((obj) => obj.id !== id);

            this.setData(updatedData);
          });
        }
      });
    }
  }

  getData() {
    return this.http
      .get<Employee[]>(`${environment.API}.json`)
      .pipe(catchError(this.handleError))
      .subscribe(
        (res) => {
          this.employesData.next(res);
        },
        (errorMessage) => {
          alert(errorMessage);
        }
      );
  }

  setData(data: Employee[]) {

    this.http
      .put<Employee[]>(`${environment.API}.json`, data)
      .pipe(catchError(this.handleError))
      .subscribe(
        (res) => {
          this.employesData.next(res);
        },
        (errorMessage) => {
          alert(errorMessage);
        }
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string;

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
        errorMessage = 'Too many requests. Try later';
        break;
      default:
        errorMessage = 'Internal Server Error';
        break;
    }

    return throwError(errorMessage);
  }

}
