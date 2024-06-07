// This script is responsible for handling the video stream and object detection UI in the browser.

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Adjust these variables as needed
const videoWidth = 640;
const videoHeight = 480;
const frameRate = 10; // Frames per second

// Set video and canvas size
video.width = videoWidth;
video.height = videoHeight;
canvas.width = videoWidth;
canvas.height = videoHeight;

// Start video stream
navigator.mediaDevices.getUserMedia({ video: { width: videoWidth, height: videoHeight } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.error('Error accessing the webcam', err);
  });

// Draw detection results on the canvas
function drawResults(predictions) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;
    context.strokeStyle = '#00FF00';
    context.lineWidth = 4;
    context.strokeRect(x, y, width, height);

    context.fillStyle = '#FF0000';
    context.font = '18px Arial';
    context.fillText(prediction.class + ': ' + Math.round(prediction.score * 100) + '%', x, y - 10);
  });
}

// Send frame to server for object detection
function sendFrame() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(blob => {
    const formData = new FormData();
    formData.append('frame', blob);

    fetch('/api/detect', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(predictions => {
      drawResults(predictions);
    })
    .catch(err => {
      console.error('Error processing the frame', err);
    });
  }, 'image/jpeg');
}

// Capture and send frames at a set interval
setInterval(sendFrame, 1000 / frameRate);