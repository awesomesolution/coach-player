### Basic Requierments
Before application start you need to install following to run this project

- Node.js
- NPM
- MongoDB

### How to Setup Back end Project

Go to back-end directory and run the 'npm install' command to install the npm packages.

1.1 `cd back-end`
1.2 `npm install`

To Run the backend please run the following command Or simply use nodemon 
1.3. `node server.js`

This will run the backend on port number 3000

### Exmplaination of API's
### To test the API please import the Coache-Players.postman_collection.json in the POSTMAN or any other API tools
1. Login
    - /login => this will allow you to login if you alrady have registered with

2. Register Admin user
    - /register-admin => this will allow you to register admin user
    - Admin user default credentials 
        username: admin
        password: admin

3. Register normal user like coache
    - /register => this will allow you to register normal user (coache)

4. Add player details
    - /players/add => this will allow you to add player details like:
        - player name
        - matches played 
        - how much they have won 
        - how much they have lost

5. Admin can also find the players across all the teams
    - /players => this will allow to search for players by their name

6. Find the players which they coached by
    - /players => this will allow to search for players who are coached by the logged in coache only 