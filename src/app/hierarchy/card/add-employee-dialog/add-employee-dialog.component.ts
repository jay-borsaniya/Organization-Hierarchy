import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../hierarchy.model';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.css'],
})
export class AddEmployeeDialogComponent {
  form: FormGroup;
  type: string;
  employeeList: Employee[];

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = data?.type;
    this.employeeList = data?.employeeList;

    if (this.type === 'add') {
      this.form = new FormGroup({
        id: new FormControl(
          { value: data.userId, disabled: true },
          Validators.required
        ),
        name: new FormControl(null, [
          Validators.required,
          Validators.maxLength(20),
        ]),
        managerId: new FormControl(
          { value: data.managerId, disabled: true },
          Validators.required
        ),
        imageUrl: new FormControl(null, Validators.required),
        email: new FormControl(null, [
          Validators.required,
          Validators.maxLength(20),
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ]),
        designation: new FormControl(null, [
          Validators.required,
          Validators.maxLength(10),
        ]),
      });
    } else if (this.type === 'change') {
      this.form = new FormGroup({
        owner: new FormControl(this.employeeList[0].id, Validators.required),
      });
    }
  }

  onSubmit(confirm?: boolean): void {
    if (confirm) {
      this.dialogRef.close({ confirm: confirm });
    } else {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
