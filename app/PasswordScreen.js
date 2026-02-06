'use client';

import { useState, useEffect } from 'react';
import styles from './PasswordScreen.module.css';
import { DIRT_PASSWORD } from './password-config';

export default function PasswordScreen({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already unlocked in this session
    const unlocked = sessionStorage.getItem('dirt_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === DIRT_PASSWORD) {
      sessionStorage.setItem('dirt_unlocked', 'true');
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  // Show loading briefly while checking session
  if (isChecking) {
    return null;
  }

  // Show password screen
  if (!isUnlocked) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>DiRT Calculator</h1>
          <p className={styles.subtitle}>Dynamic Rider Triangle</p>
          <p className={styles.description}>
            Enter your access code to continue
          </p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access Code"
              className={styles.input}
              autoFocus
            />
            
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
            
            <button type="submit" className={styles.button}>
              Access DiRT
            </button>
          </form>
          
          <p className={styles.note}>
            Members: Find your access code on your membership page
          </p>
        </div>
      </div>
    );
  }

  // Show the actual app
  return children;
}
