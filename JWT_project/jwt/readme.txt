react+express+mongodb

JWT = JSON Web Token 
It’s a compact, URL-safe way to securely transmit information between two parties (client ↔ server) as a JSON object. Typically used for authentication & authorization in web apps.

create a folder and open terminal(ctrl+shift+~)
(create backend express project)
mkdir JWT
cd JWT
npm init -y
npm install express jsonwettoken cors mongoose bcryptjs
create server.js file and .env file
create models folder and create User.js

in .env for getting JWT_SECRET -> go to cmd and type:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" 

npm install -D nodemon    Install nodemon (for auto-restart during dev)
npm start           For normal run
npm run dev         For development (auto reload)

frontend:
create react project folder (jwt_frontend)
