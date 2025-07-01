import { motion } from 'framer-motion'

const Loading = ({ type = 'table' }) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64"></div>
            <div className="h-10 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg w-32"></div>
          </div>
          
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded"></div>
          </div>
          
          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-5 gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                </div>
              </div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-16"></div>
                <div className="h-8 bg-gradient-to-r from-red-200 to-red-300 rounded w-16"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-primary-300 rounded-lg"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-16"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
  )
}

export default Loading