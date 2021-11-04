# turbo-doodle

## Assignment: PWA Budget Tracker

<a href="https://choosealicense.com/licenses/mit" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>

<hr/>

## Description

Turbo Doodle is a full-stack budget tracker that was developed as a progressive web app (PWA).

Per MDN, a PWA app is when the app:

> "meets certain requirements, or implements a set of given features: works offline, is installable, is easy to synchronize, can send push notifications."

If you're interested in the full article, click on the following link - [What is a Progressive Web App?](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Introduction)

Given the above definition, the main feature of this app is to provide the user the ability to add expenses and deposits if their internet connection is lost. See section [Offline Functionality](#offline-functionality) for more information on how this is done.

To view the final app deployed on Heroku, please click on the following [link](https://secret-sierra-86296.herokuapp.com/).

<hr/>

## Table of Contents:

1. [Description](#description)
1. [Technologies](#technologies)
1. [Offline Functionality](#offline-functionality)
1. [Installation](#installation)
1. [Usage](#usage)
1. [Video](#video)
1. [License](#license)
1. [Questions](#questions)

<hr/>

## Offline Functionality

The offline functionality is implemented through the use of IndexedDB.

Per MDN,

> "IndexedDB is a way for you to persistently store data inside a user's browser. Because it lets you create web applications with rich query abilities regardless of network availability, your applications can work both online and offline."

What's important to note is that not all browsers support this functionality. Per the below image from "Can I Use" website, it looks like Internet Explorer "IE" partially supports this functionality.

Link to: [Can I Use: IndexedDB](https://caniuse.com/?search=indexed)

![alt text](./public/assets/images/caniuse_indexedDB.png)

### IndexedDB Basic Pattern

The below list provided by MDN summarizes the basic pattern thats encouraged inorder to successfully implement the use of IndexedDB.

1. Open a database
2. Create an object store in the database.
3. Start a transaction and make a request to do some database operation, like adding or retrieving data.
4. Wait for the operation to complete by listening to the right kind of DOM event.
5. Do something with the results (which can be found on the request object).

<hr/>

## Installation

- Before cloning the repository, please ensure you have node.js installed as this app requires the installing of npm packages. You will also need to ensure you have both MongoDB installed on your computer and MongoDB Atlas setup.

### Node.js Installation

1.  [Node.js Download Page](https://nodejs.org/en/download/)

2.  After install, check with command line to ensure setup is correct.

        a. Open your terminal

        b. Type the below command. If you see a version it means you have installed node.js correctly.

        ```bash
        node -v
        ```

### MongoDB Installation

1.  [MongoDB Community Server Installation Page](https://www.mongodb.com/try/download/community)

2.  After install, check with the command line to ensure setup is correct. If running the below commands does not output any errors, then you've correctly installed mongoDB.

        ```bash
        mongo --version
        ```

        ```bash
        mongod --version
        ```

### MongoDB Atlas Setup

1.  [MongoDB Atlas Getting Started Page](https://docs.atlas.mongodb.com/getting-started/)

2.  After creating an Atlas account, you will need to build a "Project / Cluster". Come up with a name for your project and click on the next button.

    ![alt text](./public/assets/images/mongodbAtlas_createproject_1.png)

3.  You will be redirected to the next page which will ask you to "Add Members and Set Permissions". Ensure the project owner is set to your email.

    ![alt text](./public/assets/images/mongodbAtlas_createproject_2.png)

4.  For the next screen, just click on "Build a Database". Once clicked, you will be asked for a "deployment option". For our case, choose "Free & Hobby" and then click on "Create".

    ![alt text](./public/assets/images/mongodbAtlas_createproject_3.png)

5.  The next screen will ask you to choose a "Cloud Provider & Region". Once you've chosen you're region, click on "Create Cluster".

    - Please note, the creation of the cluster will take a few minutes. takes a little bit of time some. Wait until the process is fully done.

    ![alt text](./public/assets/images/mongodbAtlas_createproject_4.png)

6.  Once you've built your cluster, you need to do the following:

    a. Click on the "Connect" & choose the "Allow Access from Anywhere".

    - Click on the "Add IP Address".

    - Click on "Create a Database User" after choosing a username and password. For security purposes, I typically use the "Autogenerate Secure Password".

    - Please ensure you save this password somewhere as we will need to use it later when we fill in the "config.env" file.

    ![alt text](./public/assets/images/mongodbAtlas_cluster_1.png)

    c. Click on the "Create Database User" and then lastly, click on the "Choose a connection method" on the bottom right corner.

    ![alt text](./public/assets/images/mongodbAtlas_cluster_2.png)

    d. Choose the middle option "Connect your application" and copy the connection string shown.

    ![alt text](./public/assets/images/mongodbAtlas_connect_1.png)

    e. This step is crucial. What you want to do is copy the connection string and place it in the config.env.EXAMPLE.

    - Once pasted, you want to replace the "myFirstDatabase" in the string with a name you want to use for your database and make the `<password>` to upper case `<PASSWORD>`.

    - For the "DATABASE_PASSWORD" field, paste in the one you saved from earlier.

    ```bash
    DATABASE=mongodb+srv://mehdi:<PASSWORD>@cluster0.wchzp.mongodb.net/turbo-doodle-tutorial?retryWrites=true&w=majority
    ```

    ![alt text](./public/assets/images/mongodbAtlas_connect_2.png)

    f. The final step is to remove the `.EXAMPLE` from the `config.env`.

<hr/>

## Usage

- Once you've completed the installation section guidelines, all that is left is to install the npm packages and then start the app.

- To install the app dependencies and to run the app:

  1.  Open Terminal in VS Code

      a. Shortcut = CTRL + `

  2.  Ensure you are in the main directory

  3.  To install the app dependencies:

      ```bash
      npm install
      ```

  4.  To run the app:

      ```bash
      npm start
      ```

  ![alt text](./public/assets/images/readme_usage_command_1.png)

<hr/>

## Video

![alt text](./public/assets/gif/turbo-doodle.gif)

<hr/>

## License

<a href="https://choosealicense.com/licenses/mit" target="_blank">MIT License</a>

<hr/>

## Questions

Github Portfolio Link: [Mehdi Mehrabani](https://github.com/mmehr1988)<br>
