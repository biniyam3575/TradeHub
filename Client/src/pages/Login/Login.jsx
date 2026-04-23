import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import styles from './Login.module.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      if (response.data.token) {
        login(response.data.user, response.data.token);
        // Industrial Practice: Store the token in LocalStorage
        localStorage.setItem('tradehub_token', response.data.token);
        localStorage.setItem('tradehub_user', JSON.stringify(response.data.user));
        
        // Redirect to Home
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.formHeader}>
          <LogIn size={40} color="var(--primary)" />
          <h2>Welcome Back</h2>
          <p>Login to your TradeHub account</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.inputField}>
          <span className={styles.icon}><Mail size={18} /></span>
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

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

        <button type="submit" className={styles.submitBtn}>Login</button>
        
        <p className={styles.authFooter}>
          New to TradeHub? <span onClick={() => navigate('/register')}>Create an account</span>
        </p>
      </form>
    </div>
  );
};

export default Login;