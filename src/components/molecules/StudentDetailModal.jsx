import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import StatusPill from '@/components/atoms/StatusPill'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'
import TimelineComponent from '@/components/molecules/TimelineComponent'
import { attendanceService } from '@/services/api/attendanceService'

const StudentDetailModal = ({ student, isOpen, onClose }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && student) {
      loadStudentAttendance()
    }
  }, [isOpen, student])

  const loadStudentAttendance = async () => {
    try {
      setLoading(true)
      setError('')
      
      const records = await attendanceService.getStudentAttendance(student.Id)
      setAttendanceRecords(records)
    } catch (err) {
      setError('Failed to load attendance records')
      toast.error('Failed to load attendance records')
      console.error('Error loading student attendance:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const total = attendanceRecords.length
    if (total === 0) return { present: 0, absent: 0, tardy: 0, excused: 0, total: 0, percentage: 0 }

    const present = attendanceRecords.filter(r => r.status === 'present').length
    const absent = attendanceRecords.filter(r => r.status === 'absent').length
    const tardy = attendanceRecords.filter(r => r.status === 'tardy').length
    const excused = attendanceRecords.filter(r => r.status === 'excused').length
    const percentage = Math.round((present / total) * 100)

    return { present, absent, tardy, excused, total, percentage }
  }

  const stats = calculateStats()

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50 border-green-200'
      case 'absent': return 'text-red-600 bg-red-50 border-red-200'
      case 'tardy': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'excused': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-primary-700">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-sm text-gray-600">ID: {student.studentId}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row h-full">
            {/* Student Info Panel */}
            <div className="lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Student Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{student.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Enrolled:</span>
                      <span className="text-sm text-gray-900">
                        {format(new Date(student.enrollmentDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Stats */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Attendance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Rate:</span>
                      <span className="text-lg font-bold text-primary-600">{stats.percentage}%</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-bold text-green-600">{stats.present}</div>
                        <div className="text-xs text-gray-600">Present</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-bold text-red-600">{stats.absent}</div>
                        <div className="text-xs text-gray-600">Absent</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-bold text-yellow-600">{stats.tardy}</div>
                        <div className="text-xs text-gray-600">Tardy</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-lg font-bold text-blue-600">{stats.excused}</div>
                        <div className="text-xs text-gray-600">Excused</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Panel */}
            <div className="lg:w-2/3 p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Attendance Timeline</h3>
                <p className="text-sm text-gray-600">Chronological attendance history</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loading type="spinner" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
                  <p className="text-red-600">{error}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadStudentAttendance}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No attendance records found</p>
                </div>
              ) : (
                <TimelineComponent 
                  records={attendanceRecords}
                  getStatusColor={getStatusColor}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default StudentDetailModal