import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/views/Dashboard'
import Pipeline from './components/views/Pipeline'
import Create from './components/views/Create'
import Assets from './components/views/Assets'
import Settings from './components/views/Settings'
import ToastContainer from './components/ui/ToastContainer'
import ErrorBoundary from './components/ErrorBoundary'
import NewJobModal from './components/modals/NewJobModal'
import { useProjectStore } from './stores/projectStore'

export type ViewType = 'dashboard' | 'pipeline' | 'create' | 'assets' | 'settings'

function App() {
  const [activeView, setActiveView] = useState<ViewType>('create')
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false)
  const addProject = useProjectStore((state) => state.addProject)

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'pipeline':
        return <Pipeline />
      case 'create':
        return <Create />
      case 'assets':
        return <Assets />
      case 'settings':
        return <Settings />
      default:
        return <Create />
    }
  }

  const handleNewJob = (data: {
    name: string
    client: string
    productType: string
    package: string
    notes: string
  }) => {
    addProject({
      name: data.name,
      client: data.client,
      productType: data.productType,
      packageType: data.package,
      notes: data.notes,
      stage: 'inbox',
    })
    setIsNewJobModalOpen(false)
  }

  return (
    <ErrorBoundary>
      <div className="h-full w-full flex flex-col bg-bg-dark">
        <Header
          activeView={activeView}
          onViewChange={setActiveView}
          onNewBrief={() => setIsNewJobModalOpen(true)}
        />
        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>
        <ToastContainer />
        <NewJobModal
          isOpen={isNewJobModalOpen}
          onClose={() => setIsNewJobModalOpen(false)}
          onSubmit={handleNewJob}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
