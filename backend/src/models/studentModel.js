import {students} from '../database/fakedb.js';

export async function create({ name, birthdate, parent_id }) { /// parent_name
    const newStudent = {
        id: students.length + 1,
        name,
        birthdate,
        parent_id,
    };

    students.push(newStudent);
    return newStudent;
}

export async function findByParent(parentId) {
  return students.filter(s => s.parent_id === parentId);
}