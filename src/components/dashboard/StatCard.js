import { ArrowUp, ArrowDown } from "lucide-react"

export default function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-[#232630] rounded-lg shadow-md p-5 border border-gray-800 hover:border-[#fe5532]/30 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className="p-3 rounded-lg bg-[#fe5532]/10 text-[#fe5532] group-hover:bg-[#fe5532]/20 transition-colors">
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`flex items-center text-sm ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
            {trend > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  )
}

