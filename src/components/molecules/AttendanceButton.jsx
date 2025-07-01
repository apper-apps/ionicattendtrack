import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const AttendanceButton = ({ status, active, onClick, className = '' }) => {
  const statusConfig = {
    present: {
      icon: 'Check',
      label: 'Present',
      color: 'green',
      activeClass: 'bg-green-600 text-white border-green-600',
      inactiveClass: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    },
    absent: {
      icon: 'X',
      label: 'Absent',
      color: 'red',
      activeClass: 'bg-red-600 text-white border-red-600',
      inactiveClass: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    },
    tardy: {
      icon: 'Clock',
      label: 'Tardy',
      color: 'yellow',
      activeClass: 'bg-yellow-600 text-white border-yellow-600',
      inactiveClass: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
    },
    excused: {
      icon: 'FileText',
      label: 'Excused',
      color: 'blue',
      activeClass: 'bg-blue-600 text-white border-blue-600',
      inactiveClass: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
    }
  }
  
  const config = statusConfig[status]
  const buttonClass = active ? config.activeClass : config.inactiveClass
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${buttonClass} ${className}`}
    >
      <ApperIcon name={config.icon} size={14} />
      <span className="hidden sm:inline">{config.label}</span>
    </motion.button>
  )
}

export default AttendanceButton