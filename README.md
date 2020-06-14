# url-shortener

## Setup
```
git clone repo

npm i
npm run serve
```

Then visit `localhost:8080` to generate a short URL, then visit localhost:8080/<SHORT_URL> to get redirected. You can also test this application at it's firebase hosted url: https://url-shortener-185fe.firebaseapp.com.

## About
I built this in a couple hours as a quick prototype for a url shortener.

### Architecture
The backend was built with firebase. I chose firebase because it's quick to prototype concepts and allows me to focus on the product experience first. I tried to modularize and create methods for interactions wtih firebase such that if we need to scale beyond or replace firebase, we can easily do so with another Backend. Firebase Firestore allowed me to setup a NoSQL database with a 'urls' collection. Documents in this collection are keyed by shortUrl, and each document contains a longUrl property which stores the long url. Additionally with Firebase Firestore I setup a sub-collection within each shortUrl collection for analytics. The analytics collections store user agent and session data capturing the which browser and os a users is visiting from as well as the timestamp. This could be used for reporting weekly updates to customers on how many people are using their short urls. If I had more time, I would create a Node BE and handle routing differently.

The frontend was built with Vue. I setup 2 router views: Home and LinkPage. The Home page `"/"` allows users to generate (or retrieve) shortUrls, and the LinkPage `/:id` will capture the user analytics and redirect the user to their desire long url. I also added the ability to easily copy to clipboard for enhanced UX.