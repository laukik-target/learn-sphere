import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCourseModalComponent } from '../add-course-modal/add-course-modal.component';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  courses: any[] = []; // Array to hold fetched courses

  courseData = {
    title: '',
    video_url: '',
    description: '',
    publish_date: '',
    publish_time: ''
  };

  constructor(private courseService: CourseService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCourses(); // Load courses when component initializes
  }

  // Load courses from the backend
  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (response) => {
        this.courses = response; // Store response in courses array
      },
      (error) => {
        console.error('Failed to load courses', error);
      }
    );
  }

  // Function to handle adding a course
  addCourse(): void {
    if (!this.courseData.publish_date || !this.courseData.publish_time) {
      alert('Please select both a publish date and a publish time.');
      return;
    }

    // Convert date and time to ISO format
    const date = new Date(this.courseData.publish_date);
    const [hours, minutes] = this.courseData.publish_time.split(' ')[0].split(':').map(Number);
    const modifier = this.courseData.publish_time.split(' ')[1];

    if (modifier === 'PM' && hours !== 12) {
      date.setHours(hours + 12, minutes);
    } else if (modifier === 'AM' && hours === 12) {
      date.setHours(0, minutes);
    } else {
      date.setHours(hours, minutes);
    }

    const publish_datetime = date.toISOString();

    const courseDataToSend = {
      title: this.courseData.title,
      video_url: this.courseData.video_url,
      description: this.courseData.description,
      publish_date: publish_datetime,
      admin: 1 // Replace with the actual admin ID if available
    };

    this.courseService.addCourse(courseDataToSend).subscribe(
      (response: any) => {
        console.log('Course added successfully:', response);
        alert('Course added successfully');

        // Refresh the course list to include the new course
        this.loadCourses();

        // Reset form fields
        this.courseData = {
          title: '',
          video_url: '',
          description: '',
          publish_date: '',
          publish_time: ''
        };
      },
      (error: any) => {
        console.error('Error adding course:', error);
        alert('Failed to add course. Please try again.');
      }
    );
  }

  // Function to open the course form (for example, in a modal)
  openCourseForm(): void {
    const dialogRef = this.dialog.open(AddCourseModalComponent, {
      width: 'auto',
      maxWidth: '500px', // Set a reasonable max width for larger screens
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourses(); // Refresh course list after adding a new course
      }
    });
  }


}
