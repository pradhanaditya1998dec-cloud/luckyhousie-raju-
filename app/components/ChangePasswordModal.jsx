"use client";
import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function ChangePasswordModal({ open, onCancel, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated admin user found. Please log in again.");
      }

      await updatePassword(user, newPassword);
      
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      if (onSuccess) {
        onSuccess("Admin password updated successfully!");
      }
      handleClose();
    } catch (err) {
      setLoading(false);
      console.error("Error updating admin password:", err);
      if (err.code === "auth/requires-recent-login") {
        setError("For security reasons, changing your password requires recent login. Please sign out and sign in again before updating.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else {
        setError(err.message || "Failed to update password. Please try again.");
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-box ngm-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
        <div className="ngm-header">
          <div className="ngm-header-icon" style={{ fontSize: "1.5rem" }}>🔑</div>
          <div>
            <h2 className="ngm-title">Change Admin Password</h2>
            <p className="ngm-subtitle">Set a new login password for the Admin account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "0 24px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted, #94a3b8)" }}>
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="admin-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "6px", color: "var(--text-muted, #94a3b8)" }}>
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="admin-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }} onClick={() => setShowPassword(!showPassword)}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.825rem", color: "var(--text-muted, #94a3b8)" }}>Show Passwords</span>
            </div>

            {error && (
              <div className="error-msg" style={{ fontSize: "0.85rem", margin: "4px 0 0 0", padding: "8px 12px", borderRadius: "6px", backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          <div className="ngm-actions" style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={handleClose} className="admin-btn outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="admin-btn primary" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
