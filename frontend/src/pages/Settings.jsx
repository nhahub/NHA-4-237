import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // يمكنك استخدام react-toastify كبديل

function Settings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiModel, setAiModel] = useState("Mistral");

  // متغيرات حالة كلمة المرور
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // حالات التحميل (Loading States)
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // إظهار وإخفاء الباسورد
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      }

      const settingsResponse = await fetch("http://127.0.0.1:8000/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const settingsData = await settingsResponse.json();

      if (settingsData.success) {
        setDarkMode(settingsData.settings.dark_mode);
        setNotifications(settingsData.settings.notifications);
        setAiModel(settingsData.settings.ai_model);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async () => {
    // 4) Name Validation
    if (!user.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    // 3) Email Validation
    if (!user.email.includes("@")) {
      toast.error("Invalid email address.");
      return;
    }

    const token = localStorage.getItem("token");
    
    // 5) Loading State
    setSavingProfile(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (data.success) {
        // 1) Toast بدل Alert
        toast.success(data.message);
        localStorage.clear();
        window.location.href = "/";
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Network error");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveSettings = async () => {
    const token = localStorage.getItem("token");

    // 6) Save Preferences Loading State
    setSavingSettings(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dark_mode: darkMode,
          notifications: notifications,
          ai_model: aiModel, // 15) Backend Dashboard Integration جاهز للاستخدام
        }),
      });

      const data = await response.json();
      
      if(data.success) {
         toast.success(data.message);
      } else {
         toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Network error");
    } finally {
      setSavingSettings(false);
    }
  };

  const changePassword = async () => {
    // 2) Password Validation
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");

    // 7) Change Password Loading
    setSavingPassword(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 14) Success Message ✅
        toast.success("Password Updated Successfully ✅");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Network error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-slate-900">⚙️ Settings</h1>

      {/* Account */}
      {/* 11) Cards Hover Effect */}
      <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition duration-300">
        <h2 className="text-2xl font-bold mb-6">👤 Account</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 mb-1">Name</p>
            {/* 12) Inputs Focus styling */}
            <input
              value={user.name}
              onChange={(e) =>
                setUser({
                  ...user,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <p className="text-gray-500 mb-1">Email</p>
            <input
              value={user.email}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={updateProfile}
            disabled={savingProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {/* 5) Loading Text */}
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition duration-300">
        <h2 className="text-2xl font-bold mb-6">🎨 Preferences</h2>

        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-slate-700">Dark Mode</span>
          {/* 10) Tailwind Switch Toggle بدل من الـ Checkbox العادي */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-slate-700">Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition duration-300">
        <h2 className="text-2xl font-bold mb-6">🤖 AI Settings</h2>

        <select
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Mistral</option>
          <option>Llama 3</option>
          {/* 9) Add New Models */}
          <option>Gemma</option>
          <option>Phi-3</option>
        </select>

        <button
          onClick={saveSettings}
          disabled={savingSettings}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl block disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {/* 6) Loading Text */}
          {savingSettings ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🔐 Security</h2>
          
          {/* 13) Show Password Toggle */}
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium text-slate-700 transition"
          >
            {showPassword ? "Hide 🙈" : "Show Password 👁"}
          </button>
        </div>

        <div className="space-y-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={changePassword}
            disabled={savingPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {/* 7) Loading Text */}
            {savingPassword ? "Saving..." : "Change Password"}
          </button>

          <button
            onClick={() => {
              // 8) Logout Confirmation
              if (window.confirm("Are you sure you want to logout?")) {
                localStorage.clear();
                window.location.href = "/";
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl ml-2 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;