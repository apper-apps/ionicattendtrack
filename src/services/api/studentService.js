import mockStudents from '@/services/mockData/students.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class StudentService {
  constructor() {
    this.students = [...mockStudents]
  }

  async getAll() {
    await delay(300)
    return [...this.students]
  }

  async getById(id) {
    await delay(200)
    const student = this.students.find(s => s.Id === parseInt(id))
    if (!student) throw new Error('Student not found')
    return { ...student }
  }

  async create(studentData) {
    await delay(400)
    const newStudent = {
      ...studentData,
      Id: Math.max(...this.students.map(s => s.Id)) + 1,
      enrollmentDate: new Date().toISOString()
    }
    this.students.push(newStudent)
    return { ...newStudent }
  }

  async update(id, studentData) {
    await delay(350)
    const index = this.students.findIndex(s => s.Id === parseInt(id))
    if (index === -1) throw new Error('Student not found')
    
    this.students[index] = { ...this.students[index], ...studentData }
    return { ...this.students[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.students.findIndex(s => s.Id === parseInt(id))
    if (index === -1) throw new Error('Student not found')
    
    this.students.splice(index, 1)
    return true
  }
}

export const studentService = new StudentService()