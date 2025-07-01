import { motion } from 'framer-motion'

const StatusPill = ({ status, className = '' }) => {
  const statusConfig = {
    present: {
      label: 'Present',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    absent: {
      label: 'Absent',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    tardy: {
      label: 'Tardy',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    excused: {
      label: 'Excused',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }
  
  const config = statusConfig[status] || statusConfig.absent
  
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}
    >
      {config.label}
    </motion.span>
  )
}

export default StatusPill