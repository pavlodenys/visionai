# Setup

node 18.15.0

# Run vision AI

node services/testDetection.js

If you have ERR_DLOPEN_FAILED error on start, follow this:

1. npm install -g node-gyp
2. npm config set node_gyp "C:\Users\{User}\AppData\Roaming\npm\node_modules\node-gyp\bin\node-gyp.js"
3. .npm i
4. npm rebuild @tensorflow/tfjs-node build-addon-from-source
5. Then run 'node services/testDetection.js'
