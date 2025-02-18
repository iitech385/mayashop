#!/bin/bash

# Create necessary files
echo "Creating deployment files..."

# Make backend/build.sh executable
chmod +x backend/build.sh

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore..."
  echo "node_modules/
dist/
.env
.env.local
__pycache__/
*.pyc
db.sqlite3
staticfiles/" > .gitignore
fi

# Create netlify.toml
echo "Creating netlify.toml..."
echo "[build]
  command = \"npm run build\"
  publish = \"dist\"

[[redirects]]
  from = \"/*\"
  to = \"/index.html\"
  status = 200" > netlify.toml

echo "Deployment files created successfully!" 