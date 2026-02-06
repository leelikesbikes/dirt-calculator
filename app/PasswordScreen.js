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
    
    // Track if being accessed directly vs in iframe
    const isInIframe = window.self !== window.top;
    const referrer = document.referrer;
    
    // Log access method (visible in Vercel logs)
    console.log('[DiRT Access]', {
      inIframe: isInIframe,
      referrer: referrer || 'direct',
      timestamp: new Date().toISOString()
    });
    
    // Send to Vercel Analytics if available
    if (window.va) {
      window.va('track', 'Page View', {
        inIframe: isInIframe,
        referrer: referrer || 'direct'
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === DIRT_PASSWORD) {
      sessionStorage.setItem('dirt_unlocked', 'true');
      setIsUnlocked(true);
      setError('');
      
      // Track successful password entry
      const isInIframe = window.self !== window.top;
      console.log('[DiRT Password Success]', {
        inIframe: isInIframe,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString()
      });
      
      // Send to Vercel Analytics if available
      if (window.va) {
        window.va('track', 'Password Success', {
          inIframe: isInIframe,
          referrer: document.referrer || 'direct'
        });
      }
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
      
      // Track failed attempts (helps spot brute force)
      console.log('[DiRT Password Failed]', {
        timestamp: new Date().toISOString()
      });
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
          <h1 className={styles.title}>DiRT</h1>
          <p className={styles.description}>
            Enter access code to continue
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
              Use DiRT
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show the actual app
  return children;
}
