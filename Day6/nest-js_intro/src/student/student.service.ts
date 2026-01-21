import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class STUDENTService {
    private students = [
        { id: 1, name: 'Sagar', age: 22 },
        { id: 2, name: 'Anita', age: 21 },
        { id: 3, name: 'Ramesh', age: 23 },
        { id: 4, name: 'Sunita', age: 20 },
        { id: 5, name: 'Alex', age: 54 }
    ];

    getAllSTUDENTs() {
        return this.students;
    }
    getSTUDENTById(id: number) {
        const student = this.students.find((s) =>
            s.id === id);
        if (!student) throw new NotFoundException(
            'STUDENT Not Found!'
        )

        return student;
    }

    createSTUDENT(data: { name: string; age: number }) {
        const newSTUDENT = {
            id: Date.now(),
            ...data,
        };
        this.students.push(newSTUDENT);
        return newSTUDENT;
    }

    updateSTUDENT(id: number, data: { name: string; age: number }) {
        const index = this.students.findIndex((s) => s.id === id);
        if (index === -1) throw new NotFoundException(
            'STUDENT Not Found!'
        )
        this.students[index] = { id, ...data };
        return this.students[index];
    }

    patchSTUDENT(id: number, data: Partial<{ name: string; age: number }>) {        //Partial use to get any value
        const student = this.getSTUDENTById(id);
        Object.assign(student, data);           //Object.assign create a copy of given id and update only the given data.
        return student;
    }

    deleteSTUDENT(id: number) {
        const index = this.students.findIndex((s) => s.id === id);
        if (index === -1) throw new NotFoundException('STUDENT not Found');

        const deleted = this.students.splice(index, 1);     //remove one index at a time
        return { message: 'student Deleted', student: deleted[0] }       //Splice returnt the array of deleted items
    }

}
