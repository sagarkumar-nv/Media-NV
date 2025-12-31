import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StudentService {
    private students = [
        {id: 1, name: 'Sagar', age: 22},
        {id: 2, name: 'Anita', age: 21}
    ];

    getAllStudents() {
        return this.students;
    }
    getStudentById(id: number) {
        const student = this.students.find((s) =>
            student.id === id);
        if(!student) throw new NotFoundException(
            'Student Not Found!'
        )

        return student;
    }

    createStudent(data: {name: string; age: number}){
        const newStudent = {
            id: Date.now(),
            ...data,
        };
        this.students.push(newStudent);
        return newStudent;
    }
    
    updateStudent(id: number, data: {name: string; age: number}) {
        const index = this.students.findIndex((s) => s.id === id);
        if(index === -1) throw new NotFoundException(
            'Student Not Found!'
        )
        this.students[index] = { id, ...data};
        return this.students[index];
    }

}
