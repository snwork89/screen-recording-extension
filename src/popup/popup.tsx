import React, { useState } from "react";

const Popup: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "recording" | "stopped">("idle");

  const sendMessageToContent = async (type: "START_RECORDING" | "STOP_RECORDING") => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { type });
      setStatus(type === "START_RECORDING" ? "recording" : "stopped");
    }
  };

  return (
    <div className="w-64 p-4 bg-white text-gray-800 font-sans rounded-lg shadow-md">


      <div className="flex flex-col gap-2">
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
          onClick={() => sendMessageToContent("START_RECORDING")}
        >
          Start Recording
        </button>

        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
          onClick={() => sendMessageToContent("STOP_RECORDING")}
        >
          Stop Recording
        </button>
      </div>

      <div className="mt-4 text-sm text-center">
        {status === "recording" && <span className="text-green-600">Recording in progress...</span>}
        {status === "stopped" && <span className="text-red-500">Recording stopped.</span>}
        {status === "idle" && <span className="text-gray-400">Not recording</span>}
      </div>
    </div>
  );
};

export default Popup;
