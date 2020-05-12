# shop-fast
 
## Notes
- This is school project for mobile solution course in metropolia school
- Basically a shopping site where you can filter products based on your location
- If you are inside metropolia network. You can view the website at https://10.114.34.48/app/

## Features
- Can be viewed in mobile and desktop
-**Database**
  - This site uses database to store all the login information.
  - Database is also used to store all products that are for sell and also messages between users
-**Express and node.js backend**
 - We are using these technologies as our backend
 - Also using **ejs** as rendering engine
-**Javascript**
 - This site uses native javascript in frontend to handle all logic
 - For live chatting we are using **Socket.io** libary



## How to setup
This project uses node.js to run so there is some files you need before you can run this locally.
- Install [Git](https://git-scm.com/downloads)
- Install [Node.js](https://nodejs.org/en/download/)
- Cd into the folder where you want to install project with console .
- Input command `git clone https://github.com/Jalsson/shop-fast.git` to download the project.
- Cd into **root** of the project where you can see `index.js` file and run the command `npm install` to install dependencies .
- Cd into **/nappulapeli-frontend** folder and run command `npm install` to install dependencies.

## Run the development build
- Cd into **root** of the project where you can see `app.js` file and run command `npm run start` or `nodemon app.js` 
- Create and fill up the .env in to root folder. Note that you also need to host local sql database for it. See example this https://github.com/laravel/laravel/blob/master/.env.example 
- Wait until everything is started and navigate to https://localhost:5000/
