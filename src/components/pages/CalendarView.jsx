import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { attendanceService } from '@/services/api/attendanceService'

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      
      const data = await attendanceService.getMonthlyAttendance(
        monthStart.toISOString(),
        monthEnd.toISOString()
      )
      
      setAttendanceData(data)
    } catch (err) {
      setError('Failed to load calendar data. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [currentDate])
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }
  
  const getDayAttendance = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return attendanceData[dateKey] || { present: 0, absent: 0, tardy: 0, excused: 0, total: 0 }
  }
  
  const getAttendanceRate = (date) => {
    const stats = getDayAttendance(date)
    if (stats.total === 0) return 0
    return Math.round((stats.present / stats.total) * 100)
  }
  
  const getHeatMapColor = (rate) => {
    if (rate === 0) return 'bg-gray-100'
    if (rate >= 95) return 'bg-green-500'
    if (rate >= 85) return 'bg-green-400'
    if (rate >= 75) return 'bg-yellow-400'
    if (rate >= 65) return 'bg-orange-400'
    return 'bg-red-400'
  }
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-1">Monthly attendance overview</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          />
          <span className="text-lg font-semibold text-gray-900 min-w-48 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button
            variant="secondary"
            size="sm"
            icon="ChevronRight"
            onClick={() => navigateMonth(1)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const stats = getDayAttendance(day)
                const rate = getAttendanceRate(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isTodayDate = isToday(day)
                
                return (
                  <motion.button
                    key={day.toISOString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-200 text-left
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-transparent hover:border-gray-300'
                      }
                      ${isTodayDate ? 'ring-2 ring-primary-200' : ''}
                      ${!isSameMonth(day, currentDate) ? 'opacity-40' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        isTodayDate ? 'text-primary-700' : 'text-gray-900'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {stats.total > 0 && (
                        <div className={`w-3 h-3 rounded-full ${getHeatMapColor(rate)}`} />
                      )}
                    </div>
                    
                    {stats.total > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">{rate}%</div>
                        <div className="flex gap-1">
                          {stats.present > 0 && (
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          )}
                          {stats.absent > 0 && (
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          )}
                          {stats.tardy > 0 && (
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">95%+ attendance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-400 rounded-full" />
                <span className="text-sm text-gray-700">85-94% attendance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                <span className="text-sm text-gray-700">75-84% attendance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-400 rounded-full" />
                <span className="text-sm text-gray-700">65-74% attendance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-400 rounded-full" />
                <span className="text-sm text-gray-700">Below 65%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-100 rounded-full border border-gray-300" />
                <span className="text-sm text-gray-700">No data</span>
              </div>
            </div>
          </div>
          
          {/* Selected Date Details */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              
              {(() => {
                const stats = getDayAttendance(selectedDate)
                if (stats.total === 0) {
                  return (
                    <div className="text-center py-8">
                      <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No attendance data for this date</p>
                    </div>
                  )
                }
                
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{stats.present}</div>
                        <div className="text-sm text-green-600">Present</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
                        <div className="text-sm text-red-600">Absent</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-700">{stats.tardy}</div>
                        <div className="text-sm text-yellow-600">Tardy</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{stats.excused}</div>
                        <div className="text-sm text-blue-600">Excused</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Attendance Rate</span>
                        <span className="text-lg font-bold text-gray-900">
                          {Math.round((stats.present / stats.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarView