import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiSave, FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";
import { authAPI } from "../api";
import { useAuthStore } from "../store/authStore";

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
      if (user.avatar) {
        setAvatarPreview(`http://localhost:5001${user.avatar}`);
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("Please select an image first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await authAPI.uploadAvatar(formData);
      if (response.success) {
        updateUser({ ...user, avatar: response.avatar });
        toast.success("Avatar updated successfully!");
        setAvatarFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.success) {
        updateUser(response.user);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // You'll need to add this endpoint to your backend
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiUser className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiLock className="inline mr-2" />
              Password
            </button>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <button
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      <FiCamera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user?.email}
                    </p>
                    {avatarFile && (
                      <button
                        onClick={handleAvatarUpload}
                        disabled={loading}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {loading ? "Uploading..." : "Upload Avatar"}
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiSave />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </motion.button>
                </form>
              </motion.div>
            )}

            {activeTab === "password" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiLock />
                    <span>{loading ? "Changing..." : "Change Password"}</span>
                  </motion.button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
