import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Lock, Camera, ArrowLeft, Eye, EyeOff, Key, AlertCircle } from 'lucide-react';

interface ProfileProps {
    onBack?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
    const [profile, setProfile] = useState({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        phone: '+1234567890',
        avatar: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');

    useEffect(() => {
        const storedProfile = localStorage.getItem("adminProfile");
        if (storedProfile) {
            const parsed = JSON.parse(storedProfile);
            setProfile({
                name: parsed?.userName || 'Admin',
                email: parsed?.email || '',
                phone: parsed?.phoneNumber || '',
                avatar: parsed?.avatar || ''
            });
        }
    }, []);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle profile update logic here
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        // Handle password reset logic here
        setShowResetModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Password updated successfully!');
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle forgot password logic here
        setShowForgotModal(false);
        setResetEmail('');
        alert('Password reset link sent to your email!');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={onBack}
                                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Dashboard
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    </div>
                </div>
            </div> */}

            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Profile Information Card */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="px-6 py-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            <div className="flex items-center mb-8">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt="Avatar" className="h-24 w-24 object-cover" />
                                        ) : (
                                            <User className="h-12 w-12 text-green-900" />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-green-900 rounded-full p-2 cursor-pointer hover:bg-green-700 transition-colors">
                                            <Camera className="h-4 w-4 text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
                                    <p className="text-gray-600">Administrator</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="inline h-4 w-4 mr-1" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="inline h-4 w-4 mr-1" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="inline h-4 w-4 mr-1" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                                        />
                                    </div>
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Lock className="inline h-4 w-4 mr-1" />
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value="••••••••••••"
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div> */}
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Security Settings Card */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="px-6 py-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowResetModal(true)}
                                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                                >
                                    <div className="flex items-center">
                                        <Key className="h-5 w-5 text-gray-400 group-hover:text-green-600 mr-3" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Reset Password</p>
                                            <p className="text-sm text-gray-500">Change your current password</p>
                                        </div>
                                    </div>
                                    <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-green-600 rotate-180" />
                                </button>

                                <button
                                    onClick={() => setShowForgotModal(true)}
                                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                                >
                                    <div className="flex items-center">
                                        <AlertCircle className="h-5 w-5 text-gray-400 group-hover:text-green-600 mr-3" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Forgot Password</p>
                                            <p className="text-sm text-gray-500">Send password reset link to email</p>
                                        </div>
                                    </div>
                                    <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-green-600 rotate-180" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Forgot Password</h3>
                        <p className="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;