import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private coursesUrl = `${environment.apiUrl}/courses/view/`;
  private scheduledCoursesUrl = `${environment.apiUrl}/courses/view/`;
  private addCourseUrl = `${environment.apiUrl}/courses/add/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getScheduledCourses(): Observable<any> {
    const headers = this.authService.getAuthHeaders() || undefined;
    if (!headers) throw new Error('User is not authenticated'); // Optional: check if headers are present

    return this.http.get<any>(this.scheduledCoursesUrl, { headers });
  }

  addCourse(courseData: any): Observable<any> {
    const headers = this.authService.getAuthHeaders() || undefined;
    if (!headers) throw new Error('User is not authenticated'); // Optional: check if headers are present

    return this.http.post<any>(this.addCourseUrl, courseData, { headers });
  }
}
