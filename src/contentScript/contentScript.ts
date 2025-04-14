let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === "START_RECORDING") {
    startRecording();
  } else if (message.type === "STOP_RECORDING") {
    stopRecording();
  }
});

async function startRecording() {
  const stream = await requestScreenStream();
  if (!stream) return;

  recordedChunks = [];

  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "screen-recording.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  mediaRecorder.start();
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

async function requestScreenStream(): Promise<MediaStream | null> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "START_CAPTURE" }, async (response) => {
      if (!response || !response.streamId) {
        console.error("Failed to get streamId", response?.error);
        return reject("Permission denied");
      }

      try {
        const stream = await (navigator.mediaDevices as any).getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: response.streamId
            }
          },
          audio: false
        });
        resolve(stream);
      } catch (err) {
        reject(err);
      }
    });
  });
}
