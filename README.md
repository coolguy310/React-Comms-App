# Comms

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and is written in React, Typescript, Firebase, and Stitches.js for styling.

### To get the project running in development mode

- Install dependencies - `yarn install`.
- Create a `.env` file and paste the firebase SDK keys into it.
- Start the development server by running `yarn start`. This runs the app in the development mode.
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

In the project directory, you can run:

#### `yarn test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### Setting up firebase

The firebase app is initialized in `src/firebase.ts`
Import `db` from the `firebase.ts` file when making database manipulations.

You can access the firebase console at https://console.firebase.google.com/project/comms-5c68c
