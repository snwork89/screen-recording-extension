import React from "react";
import "./popup.css";

const Popup = () => {
  const handleGetNotificationData = () => {};

  return (
    <div>
      <h1 className="text-4xl text-green-500">Hello World</h1>

      <button onClick={handleGetNotificationData}>Get Notification Data</button>
    </div>
  );
};

export default Popup;
