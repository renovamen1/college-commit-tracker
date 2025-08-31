import { Code, GitPullRequest, GitMerge, GitCommit, Users } from 'lucide-react'

interface TimelineEvent {
  id: string
  type: 'code' | 'pull-request' | 'merge' | 'commit' | 'join'
  title: string
  description: string
  timeAgo: string
}

const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'code',
    title: 'Pushed code to \'feature/new-login\'',
    description: '2 days ago',
    timeAgo: '2 days ago'
  },
  {
    id: '2',
    type: 'pull-request',
    title: 'Opened pull request #42',
    description: '1 week ago',
    timeAgo: '1 week ago'
  },
  {
    id: '3',
    type: 'merge',
    title: 'Merged pull request #42',
    description: '1 week ago',
    timeAgo: '1 week ago'
  },
  {
    id: '4',
    type: 'commit',
    title: 'Created repository \'project-x\'',
    description: '2 weeks ago',
    timeAgo: '2 weeks ago'
  },
  {
    id: '5',
    type: 'join',
    title: 'Joined the Computer Science department',
    description: '1 month ago',
    timeAgo: '1 month ago'
  }
]

const eventIcons = {
  code: Code,
  'pull-request': GitPullRequest,
  merge: GitMerge,
  commit: GitCommit,
  join: Users
}

export function ActivityTimeline() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
        Activity History
      </h2>
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        {sampleEvents.map((event, index) => {
          const Icon = eventIcons[event.type]
          return (
            <div key={event.id} className="contents">
              {/* Timeline Line */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-gray-800 text-gray-400">
                  <Icon size={24} />
                </div>
                {index < sampleEvents.length - 1 && (
                  <div className="w-px grow bg-gray-700"></div>
                )}
              </div>

              {/* Event Content */}
              <div className="flex flex-1 flex-col py-3">
                <p className="text-white text-base font-medium leading-normal">
                  {event.title}
                </p>
                <p className="text-gray-400 text-sm font-normal leading-normal">
                  {event.timeAgo}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
