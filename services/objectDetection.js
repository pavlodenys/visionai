const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');

// Load the COCO-SSD model and keep it ready for object detection
let modelPromise;
const loadModel = async () => {
  if (!modelPromise) {
    console.log("Starting to load the COCO-SSD model...");
    modelPromise = cocoSsd.load();
    modelPromise.then(() => console.log("COCO-SSD model loaded successfully.")).catch((error) => {
      console.error("Failed to load the COCO-SSD model:", error.stack);
    });
  }
  return modelPromise;
};

/**
 * Detect objects in an image buffer.
 * @param {Buffer} imageBuffer - The image buffer to perform detection on.
 * @returns {Promise<Array>} A promise that resolves to an array of detected objects.
 */
const detectObjects = async (imageBuffer) => {
  try {
    console.log("Decoding image for object detection...");
    const image = await tf.node.decodeImage(imageBuffer, 3);
    console.log("Image decoded, loading model for detection...");
    const model = await loadModel();
    console.log("Model loaded, performing detection...");
    const predictions = await model.detect(image);
    console.log(`Detected objects: ${predictions.length}`);
    predictions.forEach(prediction => {
      console.log(`Detected object: ${prediction.class} with confidence: ${prediction.score}`);
    });
    image.dispose(); // Dispose the tensor to free memory
    return predictions;
  } catch (error) {
    console.error('Error in object detection:', error.stack);
    throw error;
  }
};

module.exports = {
  detectObjects,
};