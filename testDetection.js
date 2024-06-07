const fs = require('fs');
const { detectObjects } = require('./services/objectDetection');

const testImage = fs.readFileSync('test.jpg');

detectObjects(testImage)
    .then(predictions => {
        console.log('Detection Results:', predictions);
    })
    .catch(error => {
        console.error('Detection Failed:', error);
    });