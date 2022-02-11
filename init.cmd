@ECHO OFF
ECHO Generate .env file
(
echo MONGODB_URI=mongodb://admin:admin123@localhost:27017/project-tracker
echo NODE_ENV=development
echo TOKEN_SECRET=qwesdfgwahg 
) > .env