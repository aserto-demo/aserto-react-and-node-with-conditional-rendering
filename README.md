# Building a React and Node app with Aserto Authorization - Finished Application

There are two projects in this repo - a React client (in `./src`), and a node.js service (in `./service`).

## Building 

To build both the React client as well as the service, install dependencies with the command:

```
yarn install:all
```

This will run `yarn install` in both the main directory as well as in the `service` directory.

## Running 

### Setting up the environment
You'll need to have an Aserto policy instance running before you can run the application. Refer to the [docs](https://docs.aserto.com/docs/quickstarts/react/create-a-policy) for how to do that.

Once you have the `aserto-react` policy instance running, copy the `.env.example` file to `.env`, and then add the values for the missing environment variables from the Aserto console.

Tip: click the "Download config" button in the top right of the policy details page for the Policy Instance you just created. This will download all of the environment variable values. Just paste them into the `.env` file.

### Run the application
To run the application, we use `npm-run-all` to run the client and service together. The `start:all` script does this automatically:

```
yarn start:all
```
