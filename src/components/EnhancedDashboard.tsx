import React, { useState, useEffect } from 'react';
import { 
  MapPin, AlertTriangle, ThumbsUp, MessageCircle, TrendingUp, 
  Shield, Users, Activity, Plus, Filter, Search, Bell, 
  Settings, User, Calendar, Clock, Star, Eye, ChevronDown, 
  Send, X, Menu, LogOut, Zap, Target, Award, Heart, ArrowRight
} from 'lucide-react';

interface EnhancedDashboardProps {
  stats: {
    activeAlerts: number;
    communityMembers: number;
    issuesResolved: number;
    safetyScore: number;
  };
  reports: any[];
  onVote: (reportId: number) => void;
  onSelectReport: (report: any) => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ 
  stats, reports, onVote, onSelectReport 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your safety dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Welcome to SafeStreets
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                Together, we're making our roads safer for everyone
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Community Safety</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Active Members</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-8 w-3 h-3 bg-green-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-4 w-2 h-2 bg-red-400 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Active Alerts</h3>
            <p className="text-3xl font-bold mt-1 text-gray-800">{stats.activeAlerts}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">+2 today</p>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Community Members</h3>
            <p className="text-3xl font-bold mt-1 text-gray-800">{stats.communityMembers.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">+126 this week</p>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Issues Resolved</h3>
            <p className="text-3xl font-bold mt-1 text-gray-800">{stats.issuesResolved}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">+18 this month</p>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Safety Score</h3>
            <p className="text-3xl font-bold mt-1 text-gray-800">{Math.round(stats.safetyScore)}%</p>
            <p className="text-sm text-green-600 mt-2 font-medium">+2.4% increase</p>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Plus className="w-8 h-8" />
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold mb-2">Report New Issue</h3>
              <p className="text-blue-100">Submit a new safety concern</p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-8 h-8" />
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold mb-2">View Hotspots</h3>
              <p className="text-red-100">Check dangerous areas</p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold mb-2">Join Discussion</h3>
              <p className="text-green-100">Engage with community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Reports */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span>Recent Safety Reports</span>
          </h2>
          <div className="flex items-center space-x-2">
            <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {reports.slice(0, 5).map((report, index) => (
            <div 
              key={report.id} 
              className="group bg-gray-50 hover:bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:scale-[1.02]"
              onClick={() => onSelectReport(report)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                    {report.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{report.location}</span>
                  </div>
                  {report.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{report.description}</p>
                  )}
                  {report.author && (
                    <p className="text-xs text-gray-500 mt-1">Reported by {report.author}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.severity === 'High' ? 'bg-red-100 text-red-700' :
                  report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {report.severity}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVote(report.id);
                    }}
                    disabled={report.hasVoted}
                    className={`flex items-center space-x-1 transition-colors ${
                      report.hasVoted 
                        ? 'text-blue-600 cursor-not-allowed' 
                        : 'hover:text-blue-600 cursor-pointer'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${report.hasVoted ? 'fill-current' : ''}`} />
                    <span>{report.votes}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{report.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{report.time}</span>
                  </div>
                </div>
                
                {report.status && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Safety Map */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <span>Safety Hotspots Map</span>
        </h2>
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 h-96 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10"></div>
          <div className="text-center z-10">
            <MapPin className="w-20 h-20 text-blue-500 mx-auto mb-6 animate-pulse" />
            <p className="text-gray-700 text-xl font-medium mb-2">Interactive Safety Map</p>
            <p className="text-gray-500">Real-time incident tracking and hotspot visualization</p>
          </div>
          {/* Enhanced map markers */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute top-32 right-24 w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-1000 shadow-lg"></div>
          <div className="absolute bottom-24 left-32 w-4 h-4 bg-red-500 rounded-full animate-pulse delay-500 shadow-lg"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-500 rounded-full animate-pulse delay-1500 shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard; 