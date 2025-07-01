import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import SearchInput from '@/components/atoms/SearchInput'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { attendanceService } from '@/services/api/attendanceService'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportSettings, setExportSettings] = useState({
    format: 'pdf',
    dateRange: 'month',
    startDate: '',
    endDate: '',
    includeStudents: true,
    includeSummary: true
  })
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await attendanceService.getReports()
      setReports(data)
    } catch (err) {
      setError('Failed to load reports. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleExport = async () => {
    try {
      toast.info('Generating report...')
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Report generated successfully!')
      setShowExportModal(false)
    } catch (err) {
      toast.error('Failed to generate report')
      console.error('Export error:', err)
    }
  }
  
  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const reportTypes = [
    {
      name: 'Daily Attendance Summary',
      description: 'Quick overview of today\'s attendance',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      name: 'Weekly Attendance Report',
      description: 'Detailed weekly breakdown by student',
      icon: 'CalendarDays',
      color: 'success'
    },
    {
      name: 'Monthly Analysis',
      description: 'Comprehensive monthly attendance patterns',
      icon: 'BarChart3',
      color: 'info'
    },
    {
      name: 'Student Performance Report',
      description: 'Individual student attendance records',
      icon: 'User',
      color: 'warning'
    },
    {
      name: 'At-Risk Students Alert',
      description: 'Students with concerning attendance patterns',
      icon: 'AlertTriangle',
      color: 'danger'
    }
  ]
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Export</h1>
          <p className="text-gray-600 mt-1">Generate and manage attendance reports</p>
        </div>
        
        <Button
          icon="Download"
          onClick={() => setShowExportModal(true)}
        >
          Export Report
        </Button>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {reportTypes.map((type, index) => (
          <motion.div
            key={type.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-lg mb-3 flex items-center justify-center ${
              type.color === 'primary' ? 'bg-primary-100 text-primary-600' :
              type.color === 'success' ? 'bg-green-100 text-green-600' :
              type.color === 'info' ? 'bg-blue-100 text-blue-600' :
              type.color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              <ApperIcon name={type.icon} size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{type.name}</h3>
            <p className="text-xs text-gray-600">{type.description}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Reports History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Report History</h2>
              <p className="text-sm text-gray-600 mt-1">Previously generated reports</p>
            </div>
            
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search reports..."
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredReports.length === 0 ? (
            <Empty
              title="No reports found"
              description="Generate your first report or adjust your search"
              actionLabel="Generate Report"
              icon="FileText"
              onAction={() => setShowExportModal(true)}
            />
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{format(new Date(report.createdAt), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>{report.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon="Download">
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" icon="Eye">
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" icon="Trash2" className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => setShowExportModal(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={exportSettings.format}
                  onChange={(e) => setExportSettings({...exportSettings, format: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="csv">CSV Spreadsheet</option>
                  <option value="xlsx">Excel Workbook</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={exportSettings.dateRange}
                  onChange={(e) => setExportSettings({...exportSettings, dateRange: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="term">This Term</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeStudents}
                    onChange={(e) => setExportSettings({...exportSettings, includeStudents: e.target.checked})}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include student details</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeSummary}
                    onChange={(e) => setExportSettings({...exportSettings, includeSummary: e.target.checked})}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include summary statistics</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleExport}
                icon="Download"
              >
                Export
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Reports