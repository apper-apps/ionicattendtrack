import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const navigation = [
    { name: "Today's Attendance", href: '/', icon: 'Calendar' },
    { name: 'Student Roster', href: '/roster', icon: 'Users' },
    { name: 'Calendar View', href: '/calendar', icon: 'CalendarDays' },
    { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
    { name: 'Reports', href: '/reports', icon: 'FileText' }
  ]
  
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            AttendTrack
          </span>
        </div>
        
        <nav className="mt-8 flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center w-full"
                >
                  <ApperIcon
                    name={item.icon}
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  {item.name}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Ms. Johnson</p>
              <p className="text-xs text-gray-500">Mathematics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar