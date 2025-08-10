import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      country: ''
    },
    notifications: {
      lowStock: true,
      newOrders: true,
      emailReports: false,
      smsAlerts: false
    },
    system: {
      currency: 'USD',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      language: 'English'
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System', icon: Database },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleProfileChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
  };

  const handleSystemChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      system: { ...prev.system, [field]: value }
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          value={settings.profile.address}
                          onChange={(e) => handleProfileChange('address', e.target.value)}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={settings.profile.city}
                        onChange={(e) => handleProfileChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={settings.profile.country}
                        onChange={(e) => handleProfileChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'lowStock' && 'Get notified when products are running low'}
                          {key === 'newOrders' && 'Receive alerts for new customer orders'}
                          {key === 'emailReports' && 'Receive daily/weekly reports via email'}
                          {key === 'smsAlerts' && 'Get SMS notifications for urgent alerts'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNotificationChange(key, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            value ? 'transform translate-x-5' : ''
                          }`} />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={settings.system.currency}
                      onChange={(e) => handleSystemChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      value={settings.system.timezone}
                      onChange={(e) => handleSystemChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST - Eastern Standard Time</option>
                      <option value="PST">PST - Pacific Standard Time</option>
                      <option value="GMT">GMT - Greenwich Mean Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                    <select
                      value={settings.system.dateFormat}
                      onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={settings.system.language}
                      onChange={(e) => handleSystemChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-900">Change Password</h3>
                    <p className="text-sm text-blue-700 mt-1">Update your account password to keep your account secure</p>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Change Password
                    </button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium text-green-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-green-700 mt-1">Add an extra layer of security to your account</p>
                    <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="text-sm font-medium text-yellow-900">Session Management</h3>
                    <p className="text-sm text-yellow-700 mt-1">View and manage your active sessions</p>
                    <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}