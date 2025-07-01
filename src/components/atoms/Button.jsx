import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 ease-out'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-sm hover:shadow-md disabled:opacity-50',
    secondary: 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50 shadow-sm hover:shadow-md disabled:opacity-50',
    success: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-sm hover:shadow-md disabled:opacity-50',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-700 hover:to-yellow-600 shadow-sm hover:shadow-md disabled:opacity-50',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-sm hover:shadow-md disabled:opacity-50',
    ghost: 'text-secondary-700 hover:bg-secondary-100 disabled:opacity-50'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
      {!loading && icon && iconPosition === 'left' && <ApperIcon name={icon} size={16} />}
      {children}
      {!loading && icon && iconPosition === 'right' && <ApperIcon name={icon} size={16} />}
    </motion.button>
  )
}

export default Button