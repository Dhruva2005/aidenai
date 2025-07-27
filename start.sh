#!/bin/sh

# Replace PORT placeholder in nginx config
envsubst '${PORT}' < /etc/nginx/nginx.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# Start backend application in background
java -jar app.jar &

# Wait a moment for backend to start
sleep 10

# Start nginx in foreground
nginx -g "daemon off;"
