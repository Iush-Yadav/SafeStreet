import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import CommunityManagement from './components/CommunityManagement';
import NotificationSystem, { NotificationProvider } from './components/NotificationSystem';
import DarkVeil from './components/DarkVeil';
import InteractiveMap from './components/interactiveMap';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main Dashboard Component
interface DashboardProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
const Dashboard: React.FC<DashboardProps> = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  // Incident state for dashboard and modals
  const [incidents, setIncidents] = useState<any[]>([]);
  // Modal state
  const [showAlerts, setShowAlerts] = useState(false);
  const [showStats, setShowStats] = useState(false);
  // Ref to trigger report modal in map
  const mapRef = useRef<any>(null);

  const handleLogout = () => {
    logout();
  };

  // Handler to trigger map's report modal
  const handleReportIncident = () => {
    if (mapRef.current && mapRef.current.openReportModal) {
      mapRef.current.openReportModal();
    }
  };

  // Handler to receive incidents from map
  const handleIncidentsChange = (newIncidents: any[]) => {
    setIncidents(newIncidents);
  };

  // Calculate stats
  const activeIncidents = incidents.filter(i => i.type.toLowerCase().includes('accident') || i.type.toLowerCase().includes('incident')).length;
  const constructionZones = incidents.filter(i => i.type.toLowerCase().includes('construction')).length;
  const safetyScore = Math.max(100 - incidents.length * 5, 60);

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen backdrop-blur-sm transition-colors duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-black dark:border-gray-800 dark:shadow-lg transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SafeStreet</h1>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">Community Safety</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-200">Welcome, {user?.email}</span>
                <button
                  onClick={toggleTheme}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg transition-colors duration-200"
                  title={`Switch to ${theme === 'light' ? 'Night' : 'Day'} Mode`}
                >
                  {theme === 'light' ? '🌙 Night' : '☀️ Day'}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Map */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 dark:shadow-lg rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Safety Map</h2>
                <InteractiveMap ref={mapRef} onIncidentsChange={handleIncidentsChange} />
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 dark:shadow-lg rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={handleReportIncident} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors duration-200">
                    Report Incident
                  </button>
                  <button onClick={() => setShowAlerts(true)} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200">
                    View Alerts
                  </button>
                  <button onClick={() => setShowStats(true)} className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors duration-200">
                    Community Stats
                  </button>
                </div>
              </div>
              {/* Recent Activity */}
              <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 dark:shadow-lg rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {incidents.slice(-3).reverse().map((incident, idx) => (
                    <div key={incident.id} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${incident.type.toLowerCase().includes('accident') ? 'bg-red-500' : incident.type.toLowerCase().includes('construction') ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                      <span className="text-sm text-gray-600">{incident.type}: {incident.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Alerts Modal */}
          {showAlerts && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 dark:shadow-lg rounded-lg p-6 shadow-lg w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4">All Incidents & Alerts</h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {incidents.length === 0 ? <p className="text-gray-500">No incidents reported yet.</p> : incidents.slice().reverse().map(incident => (
                    <div key={incident.id} className="border-b pb-2 mb-2">
                      <div className="font-semibold">{incident.type}</div>
                      <div className="text-gray-700 text-sm">{incident.description}</div>
                      <div className="text-xs text-gray-400">{new Date(incident.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowAlerts(false)} className="mt-4 w-full bg-gray-300 py-2 rounded">Close</button>
              </div>
            </div>
          )}
          {/* Stats Modal */}
          {showStats && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white dark:bg-neutral-900 dark:text-gray-100 dark:shadow-lg rounded-lg p-6 shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
                <ul className="space-y-2">
                  <li>Active Incidents: <span className="font-bold">{activeIncidents}</span></li>
                  <li>Construction Zones: <span className="font-bold">{constructionZones}</span></li>
                  <li>Total Reports: <span className="font-bold">{incidents.length}</span></li>
                  <li>Safety Score: <span className="font-bold">{safetyScore}%</span></li>
                </ul>
                <button onClick={() => setShowStats(false)} className="mt-4 w-full bg-gray-300 py-2 rounded">Close</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// App Component
const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
          {/* Global DarkVeil Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <DarkVeil 
              hueShift={theme === 'dark' ? 200 : 0}
              noiseIntensity={theme === 'dark' ? 0.08 : 0.03}
              scanlineIntensity={theme === 'dark' ? 0.12 : 0.06}
              speed={0.5}
              scanlineFrequency={theme === 'dark' ? 2.5 : 1.5}
              warpAmount={theme === 'dark' ? 0.12 : 0.06}
              resolutionScale={1}
            />
          </div>
          {/* App Content Overlay */}
          <div className="relative z-10 min-h-screen">
            <Router>
              <NotificationSystem />
              <Routes>
                <Route path="/login" element={<LoginPage theme={theme} toggleTheme={toggleTheme} />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard theme={theme} toggleTheme={toggleTheme} />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/community" element={
                  <ProtectedRoute>
                    <CommunityManagement />
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </div>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;