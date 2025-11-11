echo "Generate .env file"
touch .env
cat > .env  <<EOT
MONGODB_URI=mongodb://admin:admin123@localhost:27017/project-tracker
NODE_ENV=development
TOKEN_SECRET=qwesdfgwahg 
EOT