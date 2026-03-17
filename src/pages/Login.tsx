import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { KeyRound, Mail, AlertCircle } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();

  const from = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/');

  useEffect(() => {
    // If user is already logged in, redirect them away from the login page
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Determine default route based on role if no specific destination was requested
      if (!location.state?.from?.pathname) {
          // We need to fetch the role first since the AuthContext takes a moment to update
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
          const route = profile?.role === 'admin' ? '/admin' : '/';
          navigate(route, { replace: true });
      } else {
          navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo.jpg" alt="Pertama Property" className="login-logo-image" />
          </div>
          <h1>Welcome Back</h1>
          <p>Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <KeyRound size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
