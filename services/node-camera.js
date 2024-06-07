const NodeWebcam = require('node-webcam');
const fs = require('fs').promises;
const { detectObjects } = require('./objectDetection'); // Adjust the path as necessary

// Configure the webcam options
const webcamOptions = {
    width: 1280,
    height: 720,
    quality: 100,
    frames: 30,
    delay: 0,
    saveShots: false,
    output: 'jpeg',
    device: false,
    callbackReturn: 'buffer',
    verbose: false
};

// Create the webcam instance
const webcam = NodeWebcam.create(webcamOptions);

// Function to capture and process a frame
const captureFrame = async () => {
    try {
        webcam.capture('frame', async (err, imageBuffer) => {
            if (err) {
                console.error('Error capturing image:', err);
                return;
            }

            // Pass the image buffer to the object detection service
            const predictions = await detectObjects(imageBuffer);
            console.log(predictions);

            // Continue capturing the next frame
            setTimeout(captureFrame, 100); // Adjust the delay as needed
        });
    } catch (error) {
        console.error('Error in captureFrame:', error);
    }
};

// Start capturing frames
captureFrame();
