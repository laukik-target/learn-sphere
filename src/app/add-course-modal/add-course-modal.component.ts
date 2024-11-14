import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.component.scss']
})
export class AddCourseModalComponent {
  courseData = {
    title: '',
    video_url: '',
    description: '',
    publish_date: null as Date | null,
    publish_time: ''
  };

  constructor(
    public dialogRef: MatDialogRef<AddCourseModalComponent>,
    private courseService: CourseService
  ) {}

  onSubmit(): void {
    if (!this.courseData.publish_date || !this.courseData.publish_time) {
      alert('Please select both a publish date and a publish time.');
      return;
    }

    // Combine date and time into a single ISO string
    const date = new Date(this.courseData.publish_date);
    const [hours, minutes] = this.courseData.publish_time.split(':').map(Number);

    date.setHours(hours, minutes);
    const publish_datetime = date.toISOString();

    const courseDataToSend = {
      ...this.courseData,
      publish_date: publish_datetime
    };

    this.courseService.addCourse(courseDataToSend).subscribe(
      (response) => {
        console.log('Course added successfully:', response);
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error adding course:', error);
        alert('Failed to add course. Please try again.');
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
