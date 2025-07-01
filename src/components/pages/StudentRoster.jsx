import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/atoms/StatusPill";
import SearchInput from "@/components/atoms/SearchInput";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const StudentRoster = () => {
  const [students, setStudents] = useState([])
  const [attendanceStats, setAttendanceStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [studentsData, statsData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAttendanceStats()
      ])
      
      setStudents(studentsData)
      setAttendanceStats(statsData)
    } catch (err) {
      setError('Failed to load student data. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to remove this student?')) return
    
    try {
      await studentService.delete(studentId)
      setStudents(students.filter(s => s.Id !== studentId))
      toast.success('Student removed successfully')
    } catch (err) {
      toast.error('Failed to remove student')
      console.error('Error deleting student:', err)
    }
  }
  
const filteredStudents = students.filter(student =>
    student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const getStudentStatus = (studentId) => {
    const stats = attendanceStats[studentId]
    if (!stats) return 'unknown'
    
    const percentage = (stats.present / stats.total) * 100
    if (percentage >= 90) return 'excellent'
    if (percentage >= 80) return 'good'
    if (percentage >= 70) return 'warning'
    return 'at-risk'
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-blue-600 bg-blue-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'at-risk': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }
  
  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (students.length === 0) {
    return (
      <Empty
        title="No students in roster"
        description="Start building your class by adding students"
        actionLabel="Add Student"
        icon="UserPlus"
      />
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Roster</h1>
          <p className="text-gray-600 mt-1">Manage your class of {students.length} students</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary" icon="Upload" size="sm">
            Import CSV
          </Button>
          <Button icon="UserPlus" size="sm">
            Add Student
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, ID, or email..."
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon="Filter">
            Filter
          </Button>
          <Button variant="ghost" size="sm" icon="Download">
            Export
          </Button>
        </div>
      </div>
      
      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => {
                const stats = attendanceStats[student.Id] || { present: 0, total: 0 }
                const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
                const status = getStudentStatus(student.Id)
                
                return (
                  <motion.tr
                    key={student.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
<span className="text-sm font-semibold text-primary-700">
                            {student?.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                          </span>
                        </div>
<div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">
                            Enrolled {student?.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student?.studentId || 'N/A'}</div>
                    </td>
<td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{student?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          className="text-primary-600 hover:text-primary-700"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
icon="Trash2"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteStudent(student?.Id)}
                        />
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
{filteredStudents.length === 0 && (
          <div className="p-12">
            <Empty
              title="No students match your search"
              description="Try adjusting your search terms or filters"
              icon="Search"
            />
          </div>
        )}
      </div>
      
      {/* Student Detail Modal - Commented out until component is created */}
      {/* {showDetailModal && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedStudent(null)
          }}
        />
      )} */}
    </div>
  )
}

export default StudentRoster