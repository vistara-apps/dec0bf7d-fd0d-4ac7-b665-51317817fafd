'use client';

import { useState, useEffect } from 'react';
import { User, Settings, CreditCard, Bell, Shield, LogOut } from 'lucide-react';
import { User as UserType } from '@/lib/types';

interface UserProfileProps {
  user: UserType;
  onUpdate?: (updates: Partial<UserType>) => void;
  onLogout?: () => void;
}

export function UserProfile({ user, onUpdate, onLogout }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'notifications' | 'security'>('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData);
    }
    setEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Account Settings</h1>
          <p className="text-text-secondary">Manage your account and preferences</p>
        </div>
        <button
          onClick={onLogout}
          className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-fg'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="glass-card rounded-xl p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-fg">Profile Information</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary px-4 py-2 rounded-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setFormData({ name: user.name, email: user.email });
                      setEditing(false);
                    }}
                    className="btn-secondary px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary px-4 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-fg focus:outline-none focus:border-accent"
                  />
                ) : (
                  <p className="text-fg py-2">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">Email Address</label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-fg focus:outline-none focus:border-accent"
                  />
                ) : (
                  <p className="text-fg py-2">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">Role</label>
                <p className="text-fg py-2 capitalize">{user.role}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg mb-2">Subscription Tier</label>
                <p className="text-fg py-2 capitalize">{user.subscriptionTier}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-fg">Subscription Management</h2>

            <div className="glass-card rounded-lg p-4 border border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-fg capitalize">{user.subscriptionTier} Plan</h3>
                  <p className="text-text-secondary text-sm">
                    {user.subscriptionTier === 'pro'
                      ? '$50/mo - Advanced AI features and fleet management'
                      : '$20/mo - Basic diagnostic features'
                    }
                  </p>
                </div>
                <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">AI Fault Detection</span>
                  <span className="text-success">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Predictive Maintenance</span>
                  <span className={user.subscriptionTier === 'pro' ? 'text-success' : 'text-text-secondary'}>
                    {user.subscriptionTier === 'pro' ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Automated Reports</span>
                  <span className="text-success">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Fleet Management</span>
                  <span className={user.subscriptionTier === 'pro' ? 'text-success' : 'text-text-secondary'}>
                    {user.subscriptionTier === 'pro' ? '✓' : '✗'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <button className="btn-primary w-full">
                  {user.subscriptionTier === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-fg">Notification Preferences</h2>

            <div className="space-y-4">
              {[
                { label: 'New diagnostic reports ready', defaultChecked: true },
                { label: 'Maintenance reminders', defaultChecked: true },
                { label: 'Customer shared reports', defaultChecked: true },
                { label: 'Fleet updates', defaultChecked: user.subscriptionTier === 'pro' },
                { label: 'Marketing updates', defaultChecked: false }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 glass-card rounded-lg">
                  <span className="text-fg">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={item.defaultChecked}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-fg">Security Settings</h2>

            <div className="space-y-4">
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-medium text-fg mb-2">Change Password</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Update your password to keep your account secure.
                </p>
                <button className="btn-secondary px-4 py-2 rounded-lg">
                  Change Password
                </button>
              </div>

              <div className="glass-card rounded-lg p-4">
                <h3 className="font-medium text-fg mb-2">Two-Factor Authentication</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Add an extra layer of security to your account.
                </p>
                <button className="btn-secondary px-4 py-2 rounded-lg">
                  Enable 2FA
                </button>
              </div>

              <div className="glass-card rounded-lg p-4 border border-error/20">
                <h3 className="font-medium text-error mb-2">Danger Zone</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <button className="bg-error text-white px-4 py-2 rounded-lg hover:bg-error/90">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

