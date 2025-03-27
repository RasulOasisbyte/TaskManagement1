import { Component } from '@angular/core';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss'],
  standalone:false,
})
export class AddTaskDialogComponent {
  taskTitle: string = '';
  taskDescription: string = '';
  isImportant: boolean = false;
display: any;

  onCancel(): void {
    console.log('Dialog canceled');
  }
}
