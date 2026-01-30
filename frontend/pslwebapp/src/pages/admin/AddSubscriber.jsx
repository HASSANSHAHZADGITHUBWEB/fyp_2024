import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react"; 
import api from "../../api/axios";

// Standard Material-like styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#333",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  backButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
  },
  card: {
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
    padding: "40px",
    borderTop: "4px solid #3699ff", 
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
    marginTop: 0,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#3699ff",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "20px",
    marginTop: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box", 
  },
  // New Style for Error Input
  inputError: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    border: "1px solid #f64e60", // Red border
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box", 
    background: "#fff5f8"
  },
  errorText: {
    color: "#f64e60",
    fontSize: "12px",
    marginTop: "5px",
    display: "block"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  btnCancel: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    background: "white",
    color: "#555",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  btnSave: {
    padding: "10px 24px",
    borderRadius: "4px",
    border: "none",
    background: "#3699ff",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(54, 153, 255, 0.3)",
  }
};

const AddSubscriber = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  // 1. FORM DATA STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bform: "",
    address: "",
    password: ""
  });

  // 2. ERROR STATE (For Validation)
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 3. FETCH DATA (Edit Mode)
  useEffect(() => {
    if (editId) {
      setLoading(true);
      api.get(`subscribers/${editId}/`).then((res) => {
        setFormData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone ? String(res.data.phone) : "", // Ensure string for validation
          bform: res.data.bform ? String(res.data.bform) : "", // Ensure string
          address: res.data.address,
          password: "", 
        });
        setLoading(false);
      });
    }
  }, [editId]);

  // 4. VALIDATION LOGIC
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Phone: Must be 11 Digits
    // Regex: ^ (start), \d (digit), {11} (exact count), $ (end)
    if (!formData.phone || !/^\d{11}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be exactly 11 digits (e.g., 03001234567)";
        isValid = false;
    }

    // CNIC: Must be 13 Digits
    if (!formData.bform || !/^\d{13}$/.test(formData.bform)) {
        newErrors.bform = "CNIC must be exactly 13 digits (no dashes)";
        isValid = false;
    }

    // Password Validation
    if (editId) {
        // Edit Mode: Only check if user Typed something
        if (formData.password && formData.password.length < 8) {
            newErrors.password = "New password must be at least 8 characters";
            isValid = false;
        }
    } else {
        // Create Mode: Password is mandatory and must be 8 chars
        if (!formData.password || formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  // 5. HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run Validation before sending
    if (!validateForm()) {
        alert("Please fix the errors in the form.");
        return;
    }

    try {
      if (editId) {
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password; 
        await api.put(`subscribers/${editId}/`, dataToSend);
        alert("Updated Successfully");
      } else {
        await api.post("subscribers/", formData);
        alert("Created Successfully");
      }
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Error saving data. Please check connection.");
    }
  };

  const handleChange = (e) => {
    // Clear error when user types
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: null });
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate("/admin/users")} style={styles.backButton}>
          <ArrowLeft size={20} /> Back to Subscribers
        </button>
      </div>

      <div style={styles.card}>
        {loading ? (
          <p style={{textAlign: 'center', color: '#666'}}>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            
            <h1 style={styles.title}>{editId ? "Edit Subscriber" : "New Subscriber"}</h1>
            <p style={styles.subtitle}>Enter the details below to create a new subscriber account.</p>

            {/* SECTION 1: BASIC DETAILS */}
            <div style={styles.sectionTitle}>Basic Details</div>
            
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* SECTION 2: CONTACT INFORMATION */}
            <div style={styles.sectionTitle}>Contact Information</div>

            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                {/* Changed to type="text" to preserve leading 0s and strictly check length */}
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  style={errors.phone ? styles.inputError : styles.input}
                  required
                />
                {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>CNIC / B-Form *</label>
                <input 
                  type="text" 
                  name="bform"
                  value={formData.bform}
                  onChange={handleChange}
                  placeholder="3740511122233"
                  style={errors.bform ? styles.inputError : styles.input}
                  required
                />
                {errors.bform && <span style={styles.errorText}>{errors.bform}</span>}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Residential Address *</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full street address, City"
                style={styles.input}
                required
              />
            </div>

            {/* SECTION 3: SECURITY */}
            <div style={styles.sectionTitle}>Account Security</div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {editId ? "Set New Password (Optional)" : "Password *"}
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={editId ? "Leave blank to keep current password" : "Min. 8 characters"}
                style={errors.password ? styles.inputError : styles.input}
                required={!editId}
              />
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            {/* ACTION BUTTONS */}
            <div style={styles.buttonGroup}>
              <button type="button" onClick={() => navigate("/admin/users")} style={styles.btnCancel}>
                <X size={16} /> Cancel
              </button>
              <button type="submit" style={styles.btnSave}>
                <Save size={16} /> {editId ? "Save Changes" : "Create Subscriber"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default AddSubscriber;