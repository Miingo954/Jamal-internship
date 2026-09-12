import React, { useEffect, useState } from "react";

const formatTimeLeft = (expiryDate) => {
  const remaining = Math.max(0, Number(expiryDate) - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return days > 0
    ? `${days}d ${hours}h ${minutes}m`
    : `${hours}h ${minutes}m ${seconds}s`;
};

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeLeft(expiryDate));

  useEffect(() => {
    const updateCountdown = () => setTimeLeft(formatTimeLeft(expiryDate));
    const timerId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timerId);
  }, [expiryDate]);

  return <div className="de_countdown">{timeLeft}</div>;
};

export default Countdown;
