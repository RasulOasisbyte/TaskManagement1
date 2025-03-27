import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChartModule } from 'primeng/chart';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  variant: string;
  status: 'To Do' | 'In Progress' | 'Completed';
}

interface CalendarDay {
  date: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: Task[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,

})
export class DashboardComponent {
  isSidebarOpen: boolean = false;

  onSidebarToggle(): void {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the state
    console.log('Sidebar toggled:', this.isSidebarOpen); // Debugging log
}
  isSidebarCollapsed = false;
  isDialogVisible = false;
  isTaskListVisible = false;
  isEditing = false;
  currentTaskIndex: number | null = null;
  currentTaskList: string | null = null;
  searchQuery: string = '';
  selectedPriority: 'low' | 'medium' | 'high' | 'all' = 'all';
  date: Date = new Date();
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  users: { id: string; name: string }[] = [
    { id: '1', name: 'Rasul Ahmed Khan' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Bob Brown' },
  ];
  currentTask: Task | null = null;
  currentMonth: Date = new Date();
  calendarDates: CalendarDay[] = [];
  weeks: CalendarDay[][] = [];

  // Doughnut chart properties
  chartData: any;
  chartOptions: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.generateCalendarDates();
    this.initializeSampleTasks(); // Add some sample tasks for demo
  }

  ngOnInit() {
    this.initChart();
  }

  initializeSampleTasks() {
    this.todoTasks = [

    ];
    this.inProgressTasks = [];
    this.completedTasks = [];
    this.generateCalendarDates();
    this.initChart(); // Initialize chart after adding sample tasks
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#000000';

    // Calculate the number of tasks in each status
    const totalTasks = this.getAllTasks().length;
    const todoCount = this.todoTasks.length;
    const inProgressCount = this.inProgressTasks.length;
    const completedCount = this.completedTasks.length;

    // Calculate percentages
    const todoPercentage = totalTasks ? (todoCount / totalTasks) * 100 : 0;
    const inProgressPercentage = totalTasks ? (inProgressCount / totalTasks) * 100 : 0;
    const completedPercentage = totalTasks ? (completedCount / totalTasks) * 100 : 0;

    this.chartData = {
      labels: ['To Do', 'In Progress', 'Completed'],
      datasets: [
        {
          data: [todoPercentage, inProgressPercentage, completedPercentage],
          backgroundColor: [
            documentStyle.getPropertyValue('--red-500') || '#ff0000', // Red for To Do
            documentStyle.getPropertyValue('--yellow-500') || '#ffeb3b', // Yellow for In Progress
            documentStyle.getPropertyValue('--green-500') || '#4caf50', // Green for Completed
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--red-400') || '#ff3333',
            documentStyle.getPropertyValue('--yellow-400') || '#ffee58',
            documentStyle.getPropertyValue('--green-400') || '#66bb6a',
          ],
        },
      ],
    };

    this.chartOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value.toFixed(2)}%`;
            },
          },
        },
      },
    };

    this.cdr.markForCheck();
  }

  // Update chart whenever tasks change
  updateChart() {
    this.initChart();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleTaskList() {
    this.isTaskListVisible = !this.isTaskListVisible;
  }

  getAllTasks(): Task[] {
    return [...this.todoTasks, ...this.inProgressTasks, ...this.completedTasks];
  }

  openAddTaskDialog() {
    this.isDialogVisible = true;
    this.isEditing = false;
    this.currentTaskIndex = null;
    this.currentTaskList = null;
    this.currentTask = this.createNewTask();
  }

  createNewTask(): Task {
    return {
      id: this.generateTaskId(),
      title: '',
      description: '',
      dueDate: '',
      priority: 'low',
      assignee: '',
      variant: '',
      status: 'To Do',
    };
  }

  generateTaskId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  editTask(task: Task, list: string, index: number) {
    this.isDialogVisible = true;
    this.isEditing = true;
    this.currentTaskIndex = index;
    this.currentTaskList = list;
    this.currentTask = { ...task };
  }

  deleteTask(list: string, index: number) {
    if (list === 'todo') this.todoTasks.splice(index, 1);
    else if (list === 'inProgress') this.inProgressTasks.splice(index, 1);
    else if (list === 'completed') this.completedTasks.splice(index, 1);
    this.generateCalendarDates();
    this.updateChart(); // Update chart after deleting a task
    this.cdr.detectChanges();
  }

  submitTask() {
    if (this.currentTask) {
      if (this.isEditing && this.currentTaskIndex !== null && this.currentTaskList !== null) {
        this.updateTaskInList(this.currentTask);
      } else {
        this.addTaskToList(this.currentTask);
      }
      this.isDialogVisible = false;
      this.currentTaskList = null;
      this.generateCalendarDates();
      this.updateChart(); // Update chart after adding/updating a task
      this.cdr.detectChanges();
    }
  }

  updateTaskInList(task: Task) {
    if (this.currentTaskIndex === null || this.currentTaskList === null) return;

    let originalList: Task[];
    switch (this.currentTaskList) {
      case 'todo':
        originalList = this.todoTasks;
        break;
      case 'inProgress':
        originalList = this.inProgressTasks;
        break;
      case 'completed':
        originalList = this.completedTasks;
        break;
      default:
        return;
    }

    originalList.splice(this.currentTaskIndex, 1);

    if (task.status === 'To Do') {
      this.todoTasks.push({ ...task });
    } else if (task.status === 'In Progress') {
      this.inProgressTasks.push({ ...task });
    } else if (task.status === 'Completed') {
      this.completedTasks.push({ ...task });
    }

    this.cdr.detectChanges();
  }

  addTaskToList(task: Task) {
    if (task.status === 'To Do') this.todoTasks.push(task);
    else if (task.status === 'In Progress') this.inProgressTasks.push(task);
    else if (task.status === 'Completed') this.completedTasks.push(task);
    this.cdr.detectChanges();
  }

  closeTaskDialog() {
    this.isDialogVisible = false;
    this.currentTaskList = null;
  }

  drop(event: CdkDragDrop<Task[]>) {
    const targetList = event.container.id;
    const movedTask = event.item.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (targetList === 'todo') {
        movedTask.status = 'To Do';
        this.todoTasks[event.currentIndex] = { ...movedTask };
      } else if (targetList === 'inProgress') {
        movedTask.status = 'In Progress';
        this.inProgressTasks[event.currentIndex] = { ...movedTask };
      } else if (targetList === 'completed') {
        movedTask.status = 'Completed';
        this.completedTasks[event.currentIndex] = { ...movedTask };
      }
    }

    this.generateCalendarDates();
    this.updateChart(); // Update chart after moving a task
    this.cdr.detectChanges();
  }

  getFilteredTasks(tasks: Task[]) {
    return tasks.filter(task => {
      return (
        (this.selectedPriority === 'all' || task.priority === this.selectedPriority) &&
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  onSearchQueryChange(query: string) {
    this.searchQuery = query;
  }

  onPriorityFilterChange(priority: 'low' | 'medium' | 'high' | 'all') {
    this.selectedPriority = priority;
  }

  getTaskCardClass(task: Task): string {
    const priority = task.priority?.toLowerCase().trim();
    switch (priority) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return '';
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  // Calendar Methods
  prevMonth() {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.currentMonth = newMonth;
    this.generateCalendarDates();
    this.cdr.detectChanges();
  }

  nextMonth() {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.currentMonth = newMonth;
    this.generateCalendarDates();
    this.cdr.detectChanges();
  }

  generateCalendarDates() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const today = new Date();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const allTasks = this.getAllTasks();

    this.calendarDates = [];
    this.weeks = [];

    for (let i = 0; i < startingDay; i++) {
      this.calendarDates.push({
        date: null,
        isToday: false,
        isCurrentMonth: false,
        events: [],
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday =
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      const events = allTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return (
          dueDate.getDate() === day &&
          dueDate.getMonth() === month &&
          dueDate.getFullYear() === year
        );
      });

      this.calendarDates.push({
        date: day,
        isToday,
        isCurrentMonth: true,
        events,
      });
    }

    const remainingDays = (7 - (this.calendarDates.length % 7)) % 7;
    for (let i = 0; i < remainingDays; i++) {
      this.calendarDates.push({
        date: null,
        isToday: false,
        isCurrentMonth: false,
        events: [],
      });
    }

    for (let i = 0; i < this.calendarDates.length; i += 7) {
      this.weeks.push(this.calendarDates.slice(i, i + 7));
    }
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
}



