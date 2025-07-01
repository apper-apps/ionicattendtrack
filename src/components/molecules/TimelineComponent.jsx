import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const TimelineComponent = ({ records, getStatusColor }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return 'CheckCircle'
      case 'absent': return 'XCircle'
      case 'tardy': return 'Clock'
      case 'excused': return 'Shield'
      default: return 'Circle'
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return null
    try {
      return format(parseISO(timeString), 'h:mm a')
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-4">
      {records.map((record, index) => (
        <motion.div
          key={record.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Timeline Line */}
          {index < records.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
          )}

          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(record.status)}`}>
              <ApperIcon 
                name={getStatusIcon(record.status)} 
                size={20}
                className={record.status === 'present' ? 'text-green-600' : 
                          record.status === 'absent' ? 'text-red-600' :
                          record.status === 'tardy' ? 'text-yellow-600' : 'text-blue-600'}
              />
            </div>

            {/* Record Details */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(record.date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    {record.checkInTime && (
                      <div className="text-xs text-gray-600">
                        Check-in: {formatTime(record.checkInTime)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {record.note && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <ApperIcon name="MessageSquare" size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Note: </span>
                      {record.note}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Timeline End */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
          <ApperIcon name="Calendar" size={16} className="text-gray-400" />
        </div>
        <div className="text-sm text-gray-500 italic">
          Start of attendance tracking
        </div>
      </div>
    </div>
  )
}

export default TimelineComponent