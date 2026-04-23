import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const submissionData = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      await api.post('/auth/register', submissionData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.formHeader}>
          <UserPlus size={40} color="var(--primary)" />
          <h2>Join TradeHub</h2>
          <p>Create your professional account</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.nameRow}>
          <div className={styles.inputField}>
            <span className={styles.icon}><User size={18} /></span>
            <input 
              type="text" 
              placeholder="First Name" 
              required
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className={styles.inputField}>
            <input 
              type="text" 
              placeholder="Last Name" 
              required
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.inputField}>
          <span className={styles.icon}><Mail size={18} /></span>
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        {/* Password Field */}
        <div className={styles.inputField}>
          <span className={styles.icon}><Lock size={18} /></span>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button 
            type="button" 
            className={styles.toggleEye} 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password Field - Now Added */}
        <div className={styles.inputField}>
          <span className={styles.icon}><Lock size={18} /></span>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Confirm Password" 
            required
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>

        <div className={styles.roleSelection}>
          <label>Account Type</label>
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="customer">Customer (Buyer)</option>
            <option value="seller">Seller (Store Owner)</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>Create Account</button>
        
        <p className={styles.authFooter}>
          Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
        </p>
      </form>
    </div>
  );
};

export default Register;