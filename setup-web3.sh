#!/bin/bash

echo "Setting up Zerify Web3 features..."
echo

echo "Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "Error installing dependencies. Trying with --force..."
    npm install --force
fi

echo
echo "Creating .env file from template..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "Please edit .env file and add your Web3.Storage token"
else
    echo ".env file already exists"
fi

echo
echo "Setup complete! Next steps:"
echo "1. Edit .env file with your Web3.Storage token"
echo "2. Run: npm run node (in one terminal)"
echo "3. Run: npm run deploy (in another terminal)"
echo "4. Run: npm run dev"
echo
