import { motion } from 'framer-motion'
import AttendanceButton from '@/components/molecules/AttendanceButton'
import StatusPill from '@/components/atoms/StatusPill'
import ApperIcon from '@/components/ApperIcon'

const StudentRow = ({ student, attendanceRecord, onMarkAttendance }) => {
  const handleStatusClick = (status) => {
    onMarkAttendance(student.Id, status)
  }
  
  const getAttendancePercentage = () => {
    // Mock calculation - in real app would come from service
    return Math.floor(Math.random() * 30) + 70 // 70-100%
  }
  
  const percentage = getAttendancePercentage()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
    >
      {/* Student Info */}
      <div className="lg:col-span-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-700">
            {student.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{student.name}</h4>
          <p className="text-sm text-gray-500">{student.studentId}</p>
        </div>
      </div>
      
      {/* Status */}
      <div className="flex items-center">
        {attendanceRecord?.status ? (
          <StatusPill status={attendanceRecord.status} />
        ) : (
          <span className="text-sm text-gray-400">Not marked</span>
        )}
      </div>
      
      {/* Attendance Percentage */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      
      {/* Check-in Time */}
      <div className="flex items-center text-sm text-gray-600">
        {attendanceRecord?.checkInTime ? (
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" size={14} />
            {new Date(attendanceRecord.checkInTime).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-1">
        {['present', 'absent', 'tardy', 'excused'].map((status) => (
          <AttendanceButton
            key={status}
            status={status}
            active={attendanceRecord?.status === status}
            onClick={() => handleStatusClick(status)}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default StudentRow