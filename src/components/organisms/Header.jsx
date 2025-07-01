import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import AddStudentModal from '@/components/molecules/AddStudentModal'
const Header = () => {
  const [selectedClass, setSelectedClass] = useState('Math 101 - Period 3')
  const [showAddModal, setShowAddModal] = useState(false)
  
  const classes = [
    'Math 101 - Period 1',
    'Math 101 - Period 2', 
    'Math 101 - Period 3',
    'Algebra II - Period 4',
    'Algebra II - Period 5'
  ]
  
  const handleAddStudent = (newStudent) => {
    toast.success('Student added successfully to the roster')
    setShowAddModal(false)
    // Note: In a real app, you might want to refresh data or update global state
  }
  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" icon="Menu" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back! Ready to take attendance?
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
<Button 
            icon="Plus" 
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            Add Student
          </Button>
        </div>
</div>
      
      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStudent}
      />
    </div>
  )
}

export default Header