import TaskItem from '../components/TaskItem'
import type { TaskItemProps } from '../lib/types'

const tasks: TaskItemProps[] = [
  {
    id: '1',
    title: 'First task',
    description: 'This is the first task',
    createAt: 1643723900000
  },
  {
    id: '2',
    title: 'Second task',
    description: 'This is the second task',
    createAt: 1643724000000
  },
  {
    id: '3',
    title: 'Third task',
    description: 'This is the third task',
    createAt: 1643724100000
  },
  {
    id: '4',
    title: 'Fourth task',
    description: 'This is the fourth task',
    createAt: 1643724100000
  }
]

const Tasks: React.FC = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="grid grid-flow-row grid-cols-3 gap-8">
        {tasks.map((task) => (
          <TaskItem key={task.id} {...task} />
        ))}
      </div>
    </div>
  )
}

export default Tasks
