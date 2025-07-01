import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import { attendanceService } from '@/services/api/attendanceService'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('month')
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await attendanceService.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError('Failed to load analytics data. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [timeRange])
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (!analytics) return <Error message="No analytics data available" />
  
  const chartColors = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6']
  
  const attendanceDistributionOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: ['Present', 'Absent', 'Tardy', 'Excused'],
    colors: chartColors,
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }
  
  const trendOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#2563eb'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: analytics.trends.labels
    },
    yaxis: {
      title: {
        text: 'Attendance Rate (%)'
      },
      min: 0,
      max: 100
    },
    grid: {
      borderColor: '#f1f5f9'
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Insights into attendance patterns and trends</p>
        </div>
        
        <div className="flex gap-2">
          {['week', 'month', 'term'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Attendance"
          value={`${analytics.overview.averageAttendance}%`}
          icon="TrendingUp"
          color="primary"
          trend="up"
          trendValue="2.3% from last period"
        />
        <StatCard
          title="At-Risk Students"
          value={analytics.overview.atRiskStudents}
          icon="AlertTriangle"
          color="danger"
          trend="down"
          trendValue="3 fewer than last period"
        />
        <StatCard
          title="Perfect Attendance"
          value={analytics.overview.perfectAttendance}
          icon="Award"
          color="success"
          trend="up"
          trendValue="2 more than last period"
        />
        <StatCard
          title="Chronic Absence"
          value={analytics.overview.chronicAbsence}
          icon="UserX"
          color="warning"
          trend="stable"
          trendValue="Same as last period"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Distribution</h3>
          <Chart
            options={attendanceDistributionOptions}
            series={analytics.distribution.values}
            type="donut"
            height={350}
          />
        </motion.div>
        
        {/* Attendance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h3>
          <Chart
            options={trendOptions}
            series={[{ name: 'Attendance Rate', data: analytics.trends.values }]}
            type="line"
            height={350}
          />
        </motion.div>
      </div>
      
      {/* Student Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Student Performance</h3>
          <p className="text-sm text-gray-600 mt-1">Students requiring attention</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.studentPerformance.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16 mr-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            student.attendanceRate >= 90 ? 'bg-green-500' :
                            student.attendanceRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {student.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.presentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.absentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      student.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      student.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics