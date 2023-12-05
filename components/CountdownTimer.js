import React, { useEffect, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { Store } from '../utils/Store';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const { state, dispatch } = useContext(Store);
  const { countdownStart } = state;

  useEffect(() => {
    let startTime;

    if (!countdownStart) {
      // Check if there is a countdown start time stored in cookies
      startTime = Cookies.get('countdownStart');

      if (!startTime) {
        // If not, set the current time as the start time and store it in cookies
        startTime = new Date();
        Cookies.set('countdownStart', startTime.toISOString(), {
          expires: 0.21,
        }); // 5 hours expiration
        dispatch({
          type: 'SET_COUNTDOWN_START',
          payload: startTime.toISOString(),
        });
      } else {
        // Parse the stored time
        startTime = new Date(startTime);
      }
    } else {
      // Use the start time from the store
      startTime = new Date(countdownStart);
    }

    // Function to update the time left
    const updateTimer = () => {
      const currentTime = new Date();
      const endTime = new Date(startTime.getTime() + 5 * 60 * 60 * 1000); // 5 hours from start time
      const timeLeft = endTime - currentTime;

      if (timeLeft > 0) {
        setTimeLeft(timeLeft);
      } else {
        setTimeLeft(0);
        Cookies.remove('countdownStart');
      }
    };

    // Update timer every second
    const intervalId = setInterval(updateTimer, 1000);
    updateTimer(); // Initial update

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [countdownStart, dispatch]);

  // Format time left as hh:mm:ss
  const formatTimeLeft = () => {
    if (timeLeft === null || timeLeft === 0) {
      return null;
    }

    let seconds = Math.floor((timeLeft / 1000) % 60);
    let minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    let hours = Math.floor(timeLeft / 1000 / 60 / 60);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-gray-200 to-red-400 text-gray-600 p-4 rounded-md shadow-lg flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">¡No pierdas esta oportudidad!</h2>
        <p className="text-sm">Compra ahora y disfruta de esta oferta.</p>
      </div>
      <div className="bg-white text-gray-800 rounded px-4 py-2 ml-4">
        <p className="font-semibold">Tiempo restante:</p>
        <p className="text-lg font-bold">{formatTimeLeft()} horas</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
