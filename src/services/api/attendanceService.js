import { endOfMonth, format, startOfMonth, subDays } from 'date-fns'
import mockAttendance from '@/services/mockData/attendance.json'

// Simple delay function for simulating API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
class AttendanceService {
  constructor() {
    this.attendance = [...mockAttendance]
  }

  async getAll() {
    await delay(300)
    return [...this.attendance]
  }

  async getTodayAttendance() {
    await delay(250)
    const today = format(new Date(), 'yyyy-MM-dd')
    return this.attendance.filter(record => record.date === today)
  }

  async getById(id) {
    await delay(200)
    const record = this.attendance.find(a => a.Id === parseInt(id))
    if (!record) throw new Error('Attendance record not found')
    return { ...record }
  }

  async create(attendanceData) {
    await delay(300)
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...this.attendance.map(a => a.Id)) + 1
    }
    this.attendance.push(newRecord)
    return { ...newRecord }
  }

  async update(id, attendanceData) {
    await delay(250)
    const index = this.attendance.findIndex(a => a.Id === parseInt(id))
    if (index === -1) throw new Error('Attendance record not found')
    
    this.attendance[index] = { ...this.attendance[index], ...attendanceData }
    return { ...this.attendance[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.attendance.findIndex(a => a.Id === parseInt(id))
    if (index === -1) throw new Error('Attendance record not found')
    
    this.attendance.splice(index, 1)
    return true
  }

  async getAttendanceStats() {
    await delay(400)
    const stats = {}
    
    // Group attendance by student
    this.attendance.forEach(record => {
      if (!stats[record.studentId]) {
        stats[record.studentId] = { present: 0, absent: 0, tardy: 0, excused: 0, total: 0 }
      }
      stats[record.studentId][record.status]++
      stats[record.studentId].total++
    })
    
    return stats
  }

  async getMonthlyAttendance(startDate, endDate) {
    await delay(350)
    const monthlyData = {}
    
    // Generate mock data for the month
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateKey = format(d, 'yyyy-MM-dd')
      const dayOfWeek = d.getDay()
      
      // Skip weekends for school attendance
      if (dayOfWeek === 0 || dayOfWeek === 6) continue
      
      // Generate realistic attendance data
      const total = 25 + Math.floor(Math.random() * 5) // 25-30 students
      const present = Math.floor(total * (0.8 + Math.random() * 0.15)) // 80-95% attendance
      const absent = Math.floor((total - present) * 0.6)
      const tardy = Math.floor((total - present - absent) * 0.7)
      const excused = total - present - absent - tardy
      
      monthlyData[dateKey] = { present, absent, tardy, excused, total }
    }
    
    return monthlyData
  }

  async getAnalytics(timeRange = 'month') {
    await delay(500)
    
    // Mock analytics data
    return {
      overview: {
        averageAttendance: 87,
        atRiskStudents: 3,
        perfectAttendance: 8,
        chronicAbsence: 1
      },
      distribution: {
        values: [420, 45, 32, 18] // Present, Absent, Tardy, Excused
      },
      trends: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        values: [85, 87, 89, 87]
      },
      studentPerformance: [
        {
          id: 1,
          name: 'Emma Wilson',
          attendanceRate: 65,
          presentDays: 13,
          absentDays: 7,
          status: 'at-risk'
        },
        {
          id: 2,
          name: 'James Johnson',
          attendanceRate: 78,
          presentDays: 16,
          absentDays: 4,
          status: 'warning'
        },
        {
          id: 3,
          name: 'Sarah Davis',
          attendanceRate: 72,
          presentDays: 14,
          absentDays: 6,
          status: 'warning'
        }
      ]
    }
  }

  async getReports() {
    await delay(400)
    
    return [
      {
        Id: 1,
        name: 'Weekly Attendance Summary',
        type: 'Weekly Report',
        createdAt: subDays(new Date(), 2).toISOString(),
        fileSize: '2.4 MB'
      },
      {
        Id: 2,
        name: 'Monthly Analysis - November',
        type: 'Monthly Report',
        createdAt: subDays(new Date(), 7).toISOString(),
        fileSize: '5.1 MB'
      },
      {
        Id: 3,
        name: 'At-Risk Students Alert',
        type: 'Alert Report',
        createdAt: subDays(new Date(), 14).toISOString(),
fileSize: '1.2 MB'
      }
    ]
  }
  async getStudentAttendance(studentId) {
    await delay(300)
    const studentRecords = this.attendance
      .filter(record => record.studentId === parseInt(studentId))
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Most recent first
    
return [...studentRecords]
  }
}

export default new AttendanceService()