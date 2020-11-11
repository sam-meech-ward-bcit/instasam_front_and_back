#!/bin/bash

# cd ../react-front-end && yarn build
cd ../express-back-end && npm run buildProd

rm -rf ../web-app/bin
rm -rf ../web-app/dist
rm -rf ../web-app/package.*
rm -rf ../web-app/build

cp -r ../express-back-end/bin ../web-app/
cp -r ../express-back-end/dist ../web-app/
cp ../express-back-end/package.* ../web-app/
cp -r ../react-front-end/build ../web-app/