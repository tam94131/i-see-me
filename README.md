# I See Me

*Brought to you by Tahl Milburn.*

*I See Me* automatically curates those pictures that represent your most important moments.

It does this by analyzing your pictures and selecting those with the highest experiential value.

Cognitive science tells us that experiential value is highest when something is beyond the routine.  In particular, in the presense of novelty and emotion.
                    
*I See Me* is powered by the Google Vision image AI engine to discover:

* Landmarks - Personal photographs of landmarks are often both novel and emotional.

* Microexpressions - Four of the basic emotions can be detected.

* Entity features - Although these don't have much experiential value, features provide context.

Best of all, this discovery is automatic.  You just provide the photographs!

You can use this application at [Tahl Milburn](https://tbd.herokuapp.com/ "Tahl's Heroku").


## Technologies Used

Fitness Guru uses the following technologies:

* Javascript with Ajax, Bootstrap, JQuery
* Google Vision (API): Face, Landmark, Labels modules
* Google Cloud (API)
* Google Fonts
* Node.js and Express
* BCrypt
* MongoDB and Mongoose


## Existing Features

*I See Me* has several features:

* Can recognize up to 4 microexpressions in faces
* Can recognize landmarks from a knowledgebase of over 8000 images
* Can identify thousands of features within images
* Can calculate rough experiential value based on entity identification
* Curates pictures with the highest experiential value


## Planned Features

* Allow delete of pics is Reflections view
* Allow update/delete of entire profile
* Get filter & preferences working on Profile
* Speed up refresh
* Show location (map) for Landmarks
* Do Safe Search as one of things searched in (depending on user preference)
* Allow user to assign valence to any pic; store in database; use in scoring
* Somehow sharing user's curated pictures with others
* Find most common features, look-up context-free valence, add to score
* Find & do something with underExposed and blurry pics
