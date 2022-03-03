@echo off

if exist node_modules (
    npx babel-node index.js
    pause
) else (
    npm install
    cls
    npx babel-node index.js
    pause
)