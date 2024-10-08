// client/src/plugins/authentication.js
// This plugin will handle the actual API calls related to authentication (login, register, logout). It interacts with the MongoDB Data API for user authentication. The plugin will be used in the auth store to perform these actions.

import * as Realm from 'realm-web';

// Create a new Realm app instance

const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
console.log("Realm App ID:", import.meta.env.VITE_REALM_APP_ID);

const authentication = {
  install(app)  {
    
    // Register method
    app.config.globalProperties.$register = async (email, password) => {
      try {
        await app.emailPasswordAuth.registerUser(email, password); // Register the user in MongoDB Realm
        console.log("User registered successfully");
        return response.data; // MongoDB Realm returns the user object
      } catch (error){
        console.error("Error registering user: " + error);
        throw error;
      }
    };

    // Login method
    app.config.globalProperties.$login = async (email, password) => {
      try {
        const credentials = Realm.Credentials.emailPassword(email, password);
        const user = await app.logIn(credentials); // Log the user in
        return user; // MongoDB Realm returns the user object
      } catch (error){
        console.error("Error logging in: " + error);
        throw error;
      }
    };

    // Logout method
    app.config.globalProperties.$logout = async () => {
      try {
        const user = app.currentUser;
        if (user) {
          await user.logOut(); // Log out the current user
        }
      } catch (error) {
        console.error('Error logging out: ', error);
        throw error;
      }
    };
  }
};

export default authentication;