import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, Edit3 } from 'lucide-react';

interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        fullName: 'Super Admin',
        email: 'superadmin@example.com',
        phone: '+1234567890',
        password: '••••••••••••',
        role: 'Administrator'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [editForm, setEditForm] = useState<UserProfile>(profile);

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        setProfile(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(profile);
        setIsEditing(false);
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Dashboard
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border">
                    {/* Profile Header */}
                    <div className="px-6 py-8 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-semibold text-green-700">
                                        {getInitials(profile.fullName)}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{profile.fullName}</h2>
                                    <p className="text-gray-600 text-lg">{profile.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="px-6 py-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <User className="w-4 h-4 mr-2" />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                        {profile.fullName}
                                    </div>
                                )}
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                        {profile.email}
                                    </div>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editForm.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                        {profile.phone}
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Password
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={editForm.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                            {profile.password}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;