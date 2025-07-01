import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import StudentRow from '@/components/molecules/StudentRow'
import StatCard from '@/components/molecules/StatCard'
import SearchInput from '@/components/atoms/SearchInput'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { studentService } from '@/services/api/studentService'
import { attendanceService } from '@/services/api/attendanceService'

const TodayAttendance = () => {
  const [students, setStudents] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getTodayAttendance()
      ])
      
      setStudents(studentsData)
      setAttendanceRecords(attendanceData)
    } catch (err) {
      setError('Failed to load attendance data. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleMarkAttendance = async (studentId, status) => {
    try {
      const record = {
        studentId,
        date: new Date().toISOString().split('T')[0],
        status,
        checkInTime: new Date().toISOString()
      }
      
      const existingRecordIndex = attendanceRecords.findIndex(
        r => r.studentId === studentId
      )
      
      let updatedRecord
      if (existingRecordIndex >= 0) {
        updatedRecord = await attendanceService.update(
          attendanceRecords[existingRecordIndex].Id, 
          record
        )
        const newRecords = [...attendanceRecords]
        newRecords[existingRecordIndex] = updatedRecord
        setAttendanceRecords(newRecords)
      } else {
        updatedRecord = await attendanceService.create(record)
        setAttendanceRecords([...attendanceRecords, updatedRecord])
      }
      
      const student = students.find(s => s.Id === studentId)
      toast.success(`${student?.name} marked as ${status}`)
    } catch (err) {
      toast.error('Failed to update attendance')
      console.error('Error updating attendance:', err)
    }
  }
  
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const getStats = () => {
    const total = students.length
    const present = attendanceRecords.filter(r => r.status === 'present').length
    const absent = attendanceRecords.filter(r => r.status === 'absent').length
    const tardy = attendanceRecords.filter(r => r.status === 'tardy').length
    
    return { total, present, absent, tardy }
  }
  
  const stats = getStats()
  
  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (students.length === 0) {
    return (
      <Empty
        title="No students found"
        description="Add students to your class to start taking attendance"
        actionLabel="Add Student"
        icon="Users"
      />
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.total}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Present"
          value={stats.present}
          icon="Check"
          color="success"
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          icon="X"
          color="danger"
        />
        <StatCard
          title="Tardy"
          value={stats.tardy}
          icon="Clock"
          color="warning"
        />
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search students..."
          />
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" icon="Download" size="sm">
            Export
          </Button>
          <Button icon="Save" size="sm">
            Save All
          </Button>
        </div>
      </div>
      
      {/* Students List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Student Attendance</h2>
          <p className="text-sm text-gray-600 mt-1">
            Mark attendance for {filteredStudents.length} students
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          {filteredStudents.length === 0 ? (
            <Empty
              title="No students match your search"
              description="Try adjusting your search terms"
              icon="Search"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <StudentRow
                    student={student}
                    attendanceRecord={attendanceRecords.find(r => r.studentId === student.Id)}
                    onMarkAttendance={handleMarkAttendance}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodayAttendance