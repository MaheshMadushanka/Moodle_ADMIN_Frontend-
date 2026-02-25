import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { getAdminById, updateAdmin, updateAdminImage, sendOTP, validateOTPForFPW } from "../../Api/Api";
import { useTheme } from "../../context/ThemeContext";

function ProfileSettings({ adminId, onClose, onUpdated }) {
  const { isDarkMode } = useTheme();
  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", nic: "", role_id: 2 });
  const [imageFile, setImageFile] = useState(null);

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (!adminId) return;
    const load = async () => {
      try {
        const res = await getAdminById(adminId);
        if (res.data && res.data.status && Array.isArray(res.data.result) && res.data.result.length > 0) {
          const a = res.data.result[0];
          setAdmin(a);
          setForm({
            full_name: a.full_name || "",
            phone: a.phone || "",
            address: a.address || "",
            nic: a.nic || "",
            role_id: 2,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role_id") return;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!admin) return;
    setLoading(true);
    try {
      const res = await updateAdmin(adminId, form);
      if (res.data && res.data.status) {
        // ✅ upload image if exists
        if (imageFile) {
          const imgRes = await updateAdminImage(adminId, imageFile);
          if (!(imgRes.data && imgRes.data.status)) {
            throw new Error(imgRes.data?.message || "Image upload failed");
          }
        }

        // Merge updated fields with existing admin data
        const updatedAdmin = {
          ...admin,
          ...form,
          imageURL: admin.imageURL,
        };

        localStorage.setItem("userDetails", JSON.stringify(updatedAdmin));

        // ⭐ notify whole app
        window.dispatchEvent(new Event("userUpdated"));

        Swal.fire({
          icon: "success",
          title: "Saved",
          text: res.data.message || "Profile updated",
        });

        onUpdated?.();
        onClose();
      } else {
        throw new Error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to update",
      });
    } finally {
      setLoading(false);
    }
  };
const handleSendOTP = async () => {
  setPwdLoading(true);
  try {
    console.log("Sending OTP to email:", admin.email);
    const res = await sendOTP(admin.email);
    console.log("Send OTP response:", res.data);
    if (res.data.response_code == 200) {
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: `OTP has been sent to ${admin.email}`,
      });
      setOtpSent(true);
    } else {
      throw new Error(res.data?.message || "Failed to send OTP");
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || err.message || "Failed to send OTP",
    });
  } finally {
    setPwdLoading(false);
  }
};

const handleChangePassword = async () => {
  // Validation
  if (!otp.trim()) {
    Swal.fire({ icon: "warning", title: "OTP Required", text: "Please enter the OTP" });
    return;
  }
  if (!newPassword || newPassword.length < 6) {
    Swal.fire({ icon: "warning", title: "Password Invalid", text: "Password must be at least 6 characters" });
    return;
  }
  if (newPassword !== confirmPassword) {
    Swal.fire({ icon: "warning", title: "Password Mismatch", text: "New password and confirm password don't match" });
    return;
  }

  setPwdLoading(true);
  try {
    const res = await validateOTPForFPW(admin.email, otp, newPassword);
    if (res.data && res.data.status) {
      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password has been updated successfully",
      });
      // Reset password form
      setShowPasswordChange(false);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      throw new Error(res.data?.message || "Failed to update password");
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || err.message || "Failed to update password",
    });
  } finally {
    setPwdLoading(false);
  }
};
 

  if (!admin) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? "bg-slate-800" : "bg-white"} rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            {admin.imageURL ? (
              <img src={admin.imageURL} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold">{(admin.full_name || "").charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} mb-1`}>Upload new profile image</p>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} className={`w-full px-3 py-2 rounded border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`} />
          </div>
         
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className={`w-full px-3 py-2 rounded border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`} />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className={`w-full px-3 py-2 rounded border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`} />
          </div>
          <div>
            <label className="block text-sm mb-1">NIC</label>
            <input name="nic" value={form.nic} onChange={handleChange} className={`w-full px-3 py-2 rounded border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className={`px-4 py-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? 'Saving...' : 'Save Changes'}</button>
          <button onClick={() => setShowPasswordChange(true)} className="px-4 py-2 rounded bg-green-600 text-white">Change Password</button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
          <div className={`${isDarkMode ? "bg-slate-800" : "bg-white"} rounded-lg w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Change Password</h2>
              <button onClick={() => {
                setShowPasswordChange(false);
                setOtpSent(false);
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {!otpSent ? (
              <div className={`p-4 rounded ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                <p className={`text-sm mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  We'll send an OTP to verify your identity before changing your password.
                </p>
                <button
                  onClick={handleSendOTP}
                  disabled={pwdLoading}
                  className="w-full px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {pwdLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP received on email"
                    className={`w-full px-3 py-2 rounded border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full px-3 py-2 rounded border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`w-full px-3 py-2 rounded border ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className={`flex-1 px-4 py-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={pwdLoading}
                    className="flex-1 px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {pwdLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSettings;
