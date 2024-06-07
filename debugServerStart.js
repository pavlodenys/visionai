const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');

// Load the COCO-SSD model and keep it ready for object detection
let modelPromise;
const loadModel = async () => {
  if (!modelPromise) {
    modelPromise = cocoSsd.load();
    console.log("COCO-SSD model loaded successfully.");
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
    const image = await tf.node.decodeImage(imageBuffer, 3);
    const model = await loadModel();
    const predictions = await model.detect(image);
    image.dispose(); // Dispose the tensor to free memory
    console.log(`Detected objects: ${predictions.length}`);
    predictions.forEach(prediction => {
      console.log(`Detected object: ${prediction.class} with confidence: ${prediction.score}`);
    });
    return predictions;
  } catch (error) {
    console.error('Error in object detection:', error.stack);
    throw error;
  }
};

module.exports = {
  detectObjects,
};