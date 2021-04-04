import axios from 'axios';
import { Course } from './models';

type CourseResponse = { data: Course };
type CoursesResponse = { data: Course[] };

export class CoursesService {
  async updateCourse(id: number, data: Partial<Course>) {
    const result = await axios.put<CourseResponse>(`/api/course/${id}`, data);
    return result.data.data;
  }

  async createCourse(data: Partial<Course>) {
    const result = await axios.post<CourseResponse>(`/api/course/`, data);
    return result.data.data;
  }

  async createCourseCopy(data: Partial<Course>, id: number) {
    const result = await axios.post<CourseResponse>(`/api/course/${id}/copy`, data);
    return result.data.data;
  }

  async getCourses() {
    const result = await axios.get<CoursesResponse>(`/api/courses`);
    return result.data.data;
  }

  async getCourse(id: number) {
    const result = await axios.get<CourseResponse>(`/api/course/${id}`);
    return result.data.data;
  }
}
