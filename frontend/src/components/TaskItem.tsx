import { Check, Trash2Icon } from 'lucide-react'
import React from 'react'
import type { TaskItemProps } from '../lib/types'

const TaskItem: React.FC<TaskItemProps> = ({ title, description, createAt, completed }) => {
  return (
    <div className="flex flex-col gap-2 w-108 bg-gray-800 rounded-lg border-2 shadow border-slate-700">
      <div className="flex justify-between items-center p-2 border-b border-slate-700">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button className="rounded-lg p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-md hover:bg-slate-800">
            <Check size={16} color={completed ? 'green' : 'gray'} />
          </button>
          <button className="rounded-lg p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-md hover:bg-slate-800 hover:text-red-600">
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
      <div className="p-2 flex flex-col gap-2">
        <p className="text-gray-300">{description}</p>
        <span className="text-xs text-gray-500">
          Created at: {new Date(createAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

export default TaskItem
