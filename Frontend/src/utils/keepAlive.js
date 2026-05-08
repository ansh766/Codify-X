// src/utils/keepAlive.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const startKeepAlive = () => {
  // Ping function
  const ping = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/ping`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Backend is awake');
      } else {
        console.log('⚠️ Backend ping returned:', response.status);
      }
    } catch (error) {
      // Silent fail - backend might be waking up
      console.log('⏳ Backend waking up...');
    }
  };
  
  // First ping immediately
  ping();
  
  // Then ping every 4 minutes (Render sleeps after 15 min)
  const interval = setInterval(ping, 4 * 60 * 1000); // 4 minutes
  
  // Return cleanup function
  return () => clearInterval(interval);
};