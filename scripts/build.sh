#!/bin/bash

cd ../react-front-end && yarn && yarn build
cd ../express-back-end && npm i && npm run buildProd

if [ -d "../web-app" ] 
then
    echo "remove the contents of web-app"
    rm -rf ../web-app/bin
    rm -rf ../web-app/dist
    rm -rf ../web-app/package.*
    rm -rf ../web-app/build
else
    echo "create web app"
    mkdir ../web-app
fi

cp -r ../express-back-end/bin ../web-app/
cp -r ../express-back-end/dist ../web-app/
cp ../express-back-end/package.* ../web-app/
cp -r ../react-front-end/build ../web-app/
