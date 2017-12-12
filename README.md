# Fitness Guru

*Brought to you by the team of Sherwin Shann and Tahl Milburn.*

Fitness Guru is a straightforward app for giving basic fitness recommendations based on a user's profile.  

Before the user creates a profile or logs-in, Fitness Guru shows the user a basic infographic of the entire Fitness Guru user community in a scatterchart.  The chart shows all users by age vs. weight and their gender.

When a new user wants to use the system, a new profile is created.  From that, a BMI and an assessment will be calculated based on the user's height and weight.  The website will also calculate fitness recommendations are based on whether the user would like to build strength, build muscle or simply be in great condition.  Those recommendations include resistance training, cardio and nutrition.  Added that, and based on the user's BMI, the recommendations might also include a recommendation to gain or lose weight.  The recommendations also include links to third-party sources.

Once a profile has been established, the user can periodically update his or her weight and it will recalculate the BMI and change the recommendations as appropriate.  A weight history graph is also shown to the user.

You can use this application at [Sherwin Shann](https://agile-dawn-93693.herokuapp.com/ "Sherwin's Heroku") or at [Tahl Milburn](https://quiet-harbor-68780.herokuapp.com/ "Tahl's Heroku").


## Technologies Used

Fitness Guru uses the following technologies:

* Javascript with Ajax, Bootstrap, JQuery
* Google Charts (API)
* Google Fonts
* Node.js and Express
* BCrypt
* MongoDB and Mongoose


## Existing Features

Fitness Guru has several features:
* Nice charting to communicate to the user
* Dynamic updates of all features (single-page app)
* Cookies to remember a user's login (30 day expiration)
* Password encryption (no storage of passwords in the clear!)
* Basic dashboard -- only available to app creators
* Cool font!


## Planned Features

We've thought about some possible future features:
* Calculate BMR (Basil Metabolic Rate) and gather activity info to calulated calorie consumption
* Enhanced dashboard
