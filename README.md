# BigStack
This is NodeJS based Back-End Server replicating certain services provided by Stackoverflow . All interactions can be made with the system via using the various RESTfull API end-points created. Thus making this system highly independent. Can be used with any front-end framework be it React, Angular, Vue ,etc.

# Middlewares
The following middlewares were used in this -
1. Express- For Routing
2. Passport- For using its various authenticating strategies
3. jsonwebtoken - For Token based Authentication and carrying usefull info like UserId as payload 
4. mongoose - For interaction with MongoDB which was used as Database for this .
5. bcryptjs - For encryption of confidential data like Password
5. bodyparser - For parsing incoming body requests in req.body

# Setup
1. Clone/Download the repository
2. run the command npm init to allow node to install core node components and the dependencies.
3. Change the connecting string in  "setup/myurl.js" file. Also change the secret if desired.
4. run the server and Wolla !

# API End-Points
Proper comments have been provided for each end-point. Kindly go through the code or wait until the entire system is ready . Will be posting APIs documentation then.
