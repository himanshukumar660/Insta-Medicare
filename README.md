<p align="center">
  <img style="width:0px auto" src="https://github.com/himanshukumar660/Insta-Medicare/blob/master/public/images/logo.png">
</p>

This is a web application that helps you with your concerns regarding the possible medical conditions/diagnosis for symptoms you are facing

# Features
1. User can select from the given list of symptoms to get  list of diagnosis
2. User can use the search query and give inputs like `I am suffering from fever`, which again lists all the diagnosis possible by extracting the key symptoms from the search query
3. For a given diagnosis, the user can get its description and all the information regarding its medications and medical procedures

# Screenshots/GIFs
   ## Overall representation
   ![Overall](https://github.com/himanshukumar660/Insta-Medicare/blob/master/public/GIFS/fullSearch.gif)
   ## Search using the search bar
   ![Result](https://github.com/himanshukumar660/Insta-Medicare/blob/master/public/GIFS/search_query.gif)
   ## Search using the given symptoms
   ![Search Page](https://github.com/himanshukumar660/Insta-Medicare/blob/master/public/GIFS/Search_page.gif)
   
# APIS list

The Following APIs can be called for registrations and login purposes. No Authentication is required to call these APIs.
1. `GET /` - Returns the home page
2. `GET /getSymptomList` - Return a list of symptoms acquired from APIMEDIC APIs in form of JSON
3. `GET /getDiagnosis` - Returns the result page with the diagnosis variables begin set from the results of APIMEDIC APIs.
4. `GET /getDiseaseInfo/:disease` - Returns all the information scraped from the `medicinenet.com` website about the diagnosis `disease` in form of a JSON response.

# Note
If there is any error in processing the user input, instead of the error, the homepage is returned. 

# SetUp

To set up the development environment, you need to follow the following steps
1. Download npm and nodeJs. Installation guide can be found [here](https://www.joyent.com/blog/installing-node-and-npm)
2. Download and install MongoDB on your system.

# Tech Stack and API used
The project has been built on Express Framework and uses MongoDB as its database. `request` module is used for web sraping and for making the API calls. Used APIMEDIC sandbox API to get a dummy list of symptoms and its associated diagnosis. Web Scraping is performed on `medicinenet.com` for fetching all the related information regarding the associated diagnosis.


# Running the Project
To run the project on local server, first navigate to the project directory in your filesystem.
1. Now create a directory `/data/db` in the location where your project folder resides.
2. Now run `mongod --dbpath=./data/db` from the current directory.
3. Now run `cd insta-medicare`, or go inside the project folder.
4. Now run `npm install`
4. Now run `npm start` in the terminal.
5. Open `localhost:3000` from your favourite browser.
