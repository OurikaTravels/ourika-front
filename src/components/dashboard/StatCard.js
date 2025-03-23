import React from "react"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import PropTypes from "prop-types"

const StatCard = ({ title, value, icon, trend = 0, bgClass = "bg-[#232630]" }) => {
  return (
    <div
      className={`${bgClass} rounded-lg shadow-md p-6 border border-gray-800 transition-transform hover:scale-[1.02] duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-lg bg-[#191b20] flex items-center justify-center text-gray-400">
          {icon}
        </div>
        {trend !== 0 && (
          <div className={`flex items-center ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
            {trend > 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white">
        {value === "..." ? (
          <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
        ) : (
          value
        )}
      </div>
    </div>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element.isRequired,
  trend: PropTypes.number,
  bgClass: PropTypes.string,
}

export default StatCard

