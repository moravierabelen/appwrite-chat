# Chat App made with VITE + React JS and Appwrite

After cloning the repo:

Create a `.env` file based on the .env.example existing file.

```
$ npm install
$ npm run dev
```

## Set Up an Appwrite Account

Go to [Appwrite](https://cloud.appwrite.io/register) and create an account.

In your appwrite console create a project and database.

1. Create a collection called "messages" and add the following attributes:

```
KEY       TYPE
user_id   string 50
username  string 50
body      string 250

```

2. In your `messages` collection, go to "settings" -> "Update Permissions" -> "+ Add Role" and select "Any". Give this user type "Create", "Read", "Update" and "Delete" permissions.

Once you've set up your project you should be able to update all necessary env variables.
Run your development server to view the output.
