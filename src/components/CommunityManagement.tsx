import React, { useState } from 'react';
import { Users, Plus, Search, MapPin, Calendar, Star, UserPlus, Settings, Crown, Shield, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Community {
  id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  category: string;
  isJoined: boolean;
  isOwner: boolean;
  createdDate: string;
  rating: number;
  recentActivity: string;
}

const CommunityManagement: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'create' | 'manage'>('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    location: '',
    category: 'Safety'
  });

  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 'downtown-safety',
      name: 'Downtown Safety Coalition',
      description: 'Working together to improve safety in the downtown area through community engagement and advocacy.',
      location: 'Downtown District',
      memberCount: 247,
      category: 'Safety',
      isJoined: user?.communitiesJoined.includes('downtown-safety') || false,
      isOwner: false,
      createdDate: '2024-01-15',
      rating: 4.8,
      recentActivity: '2 hours ago'
    },
    {
      id: 'school-zone-watchers',
      name: 'School Zone Watchers',
      description: 'Parents and residents ensuring safe passage for children in school zones.',
      location: 'School District Area',
      memberCount: 156,
      category: 'Education',
      isJoined: user?.communitiesJoined.includes('school-zone-watchers') || false,
      isOwner: false,
      createdDate: '2024-02-01',
      rating: 4.9,
      recentActivity: '1 hour ago'
    },
    {
      id: 'highway-patrol-volunteers',
      name: 'Highway Patrol Volunteers',
      description: 'Volunteer group supporting highway safety initiatives and emergency response.',
      location: 'Highway Corridor',
      memberCount: 89,
      category: 'Emergency',
      isJoined: false,
      isOwner: false,
      createdDate: '2024-01-20',
      rating: 4.6,
      recentActivity: '3 hours ago'
    },
    {
      id: 'bike-safety-advocates',
      name: 'Bike Safety Advocates',
      description: 'Promoting bicycle safety through infrastructure improvements and awareness campaigns.',
      location: 'City-wide',
      memberCount: 203,
      category: 'Transportation',
      isJoined: false,
      isOwner: false,
      createdDate: '2024-01-10',
      rating: 4.7,
      recentActivity: '30 minutes ago'
    }
  ]);

  const categories = ['all', 'Safety', 'Education', 'Emergency', 'Transportation'];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(prev => prev.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: true, memberCount: community.memberCount + 1 }
        : community
    ));

    if (user) {
      const updatedCommunities = [...user.communitiesJoined, communityId];
      updateProfile({ communitiesJoined: updatedCommunities });
    }
  };

  const handleLeaveCommunity = (communityId: string) => {
    setCommunities(prev => prev.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: false, memberCount: Math.max(0, community.memberCount - 1) }
        : community
    ));

    if (user) {
      const updatedCommunities = user.communitiesJoined.filter(id => id !== communityId);
      updateProfile({ communitiesJoined: updatedCommunities });
    }
  };

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    const community: Community = {
      id: `community-${Date.now()}`,
      ...newCommunity,
      memberCount: 1,
      isJoined: true,
      isOwner: true,
      createdDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      recentActivity: 'Just created'
    };

    setCommunities(prev => [community, ...prev]);
    
    if (user) {
      const updatedCommunities = [...user.communitiesJoined, community.id];
      updateProfile({ communitiesJoined: updatedCommunities });
    }

    setNewCommunity({ name: '', description: '', location: '', category: 'Safety' });
    setShowCreateForm(false);
    setActiveTab('discover');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Community Hub</h1>
            <p className="text-gray-600">Connect with local safety advocates and create positive change</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create Community</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'discover', label: 'Discover Communities', icon: Search },
            { id: 'create', label: 'Create Community', icon: Plus },
            { id: 'manage', label: 'My Communities', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                activeTab === id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'discover' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search communities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Communities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    onJoin={handleJoinCommunity}
                    onLeave={handleLeaveCommunity}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <CreateCommunityForm
              newCommunity={newCommunity}
              setNewCommunity={setNewCommunity}
              onSubmit={handleCreateCommunity}
              categories={categories.filter(c => c !== 'all')}
            />
          )}

          {activeTab === 'manage' && (
            <MyCommunities
              communities={communities.filter(c => c.isJoined)}
              onLeave={handleLeaveCommunity}
            />
          )}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Community</h2>
            <CreateCommunityForm
              newCommunity={newCommunity}
              setNewCommunity={setNewCommunity}
              onSubmit={(e) => {
                handleCreateCommunity(e);
                setShowCreateForm(false);
              }}
              categories={categories.filter(c => c !== 'all')}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface CommunityCardProps {
  community: Community;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onJoin, onLeave }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{community.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{community.location}</span>
            </div>
          </div>
        </div>
        {community.isOwner && (
          <Crown className="w-5 h-5 text-yellow-500" />
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{community.memberCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{community.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{community.recentActivity}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {community.category}
        </span>
        
        {community.isJoined ? (
          <button
            onClick={() => onLeave(community.id)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Leave
          </button>
        ) : (
          <button
            onClick={() => onJoin(community.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join</span>
          </button>
        )}
      </div>
    </div>
  );
};

interface CreateCommunityFormProps {
  newCommunity: any;
  setNewCommunity: (community: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  categories: string[];
  onCancel?: () => void;
}

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({
  newCommunity,
  setNewCommunity,
  onSubmit,
  categories,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Community Name</label>
        <input
          type="text"
          required
          value={newCommunity.name}
          onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter community name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          type="text"
          required
          value={newCommunity.location}
          onChange={(e) => setNewCommunity(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Community location or area"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={newCommunity.category}
          onChange={(e) => setNewCommunity(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          required
          rows={4}
          value={newCommunity.description}
          onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your community's mission and goals..."
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Create Community
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

interface MyCommunitiesProps {
  communities: Community[];
  onLeave: (id: string) => void;
}

const MyCommunities: React.FC<MyCommunitiesProps> = ({ communities, onLeave }) => {
  if (communities.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Communities Yet</h3>
        <p className="text-gray-600 mb-6">You haven't joined any communities yet. Discover and join communities to get started!</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Discover Communities
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {communities.map((community) => (
        <div key={community.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-800">{community.name}</h3>
                  {community.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{community.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{community.memberCount} members</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {community.isOwner ? 'Owner' : 'Member'}
              </span>
              {!community.isOwner && (
                <button
                  onClick={() => onLeave(community.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Leave
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityManagement;