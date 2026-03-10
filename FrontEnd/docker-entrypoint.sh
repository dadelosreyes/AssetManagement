#!/bin/sh

# Generate runtime environment config for the frontend SPA
# This allows VITE_API_URL to be set at container startup rather than build time
cat <<EOF > /app/env-config.js
window._env_ = {
  VITE_API_URL: "${VITE_API_URL:-/api}"
};
EOF

echo "Generated env-config.js with VITE_API_URL=${VITE_API_URL:-/api}"

# Start the static file server
exec serve -s /app -l 8080
