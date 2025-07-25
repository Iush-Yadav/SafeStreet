import React, { useState } from 'react';
import { User, Mail, Calendar, Award, Users, FileText, Edit3, Save, X, Star, Trophy, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (!user) return null;

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 100) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (reputation >= 50) return { level: 'Advanced', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (reputation >= 20) return { level: 'Intermediate', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Beginner', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const reputationLevel = getReputationLevel(user.reputation);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <div className={`absolute -bottom-2 -right-2 px-2 py-1 ${reputationLevel.bg} ${reputationLevel.color} rounded-lg text-xs font-medium`}>
              {reputationLevel.level}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Reputation Score */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{user.reputation}</p>
            <p className="text-sm text-gray-600">Reputation</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{user.reportsCount}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Reports Submitted</h3>
          <p className="text-sm text-gray-600">Safety issues reported</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{user.communitiesJoined.length}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Communities</h3>
          <p className="text-sm text-gray-600">Active memberships</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{user.achievements.length}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Achievements</h3>
          <p className="text-sm text-gray-600">Badges earned</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Achievements</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{achievement}</h3>
                <p className="text-sm text-gray-600">Earned recently</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communities */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <span>My Communities</span>
        </h2>
        {user.communitiesJoined.length > 0 ? (
          <div className="space-y-3">
            {user.communitiesJoined.map((communityId, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {communityId === 'downtown-safety' ? 'Downtown Safety Coalition' : 'School Zone Watchers'}
                    </h3>
                    <p className="text-sm text-gray-600">Active member</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">You haven't joined any communities yet</p>
            <p className="text-sm text-gray-500">Join communities to connect with local safety advocates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;