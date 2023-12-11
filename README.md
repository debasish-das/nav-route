## Frontend Web App

### Introduction

It is an web application that shows the efficient routes to visit multiple destinations/places based on Shortest distance or, Priority or, Number of Left/Right Turns. 
The routes can be sorted and viewed on map. Sign up and Sign is required to use the application.

### ES6 Module Application
Path: ./WebApp

Resources: https://developers.google.com/maps/documentation, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

App initiating JS: `WebApp/scripts/main.js`

External JS Libraries:
* https://maps.googleapis.com/maps/api/js
* bootstrap.js (Version: 5)
* polyfill.min.js

External CSS Libraries:
* bootstrap.min.css (Version: 5)

#### Steps to Run:
* Add google map api `YOUR_APP_KEY` in the `index.html`
```
<script 
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_APP_KEY&libraries=places"
        ></script>
```
* Live server extenstion from VS code can be used to run the frontend in development environment. Then clicking the `Go Live` button at bottom right.
* Or, if we have NodeJs, we can install `http-server` with npm. Then, run the command `http-server ./WebApp -p 8088`
* Or, we can run it any sever that has port 8088 or 5500

## Backend WebAPI
### Rails API 
Path: ./WebAPI

Recources: https://guides.rubyonrails.org/, https://guides.rubyonrails.org/api_app.html

#### Steps to run:
* Install postgresql
* Install ruby on rails
* Go to the `WebApi` directory and run the following commands:
```
bundle
rails db:create
rails db:migrate
rails server
```

#### Steps to Develop the WebAPI:
* Install ruby and rails
* Initialize rails api with the following command
```ruby
rails new --skip-git WebApi
```
* Add the following gems in Gemfile
```ruby
gem 'pry-rails', '~> 0.3.9' # Rails interactive interface
gem 'faker', '~> 3.2' # Fake data for seed
gem 'cancancan', '~> 3.5' # For authorization and authentication
gem 'active_model_serializers', '~> 0.10.2' # For serializaling the data from active model
gem 'rack-cors', '~> 1.1', '>= 1.1.1' # To config and allow cors site api call 
```
* Run command `bundle`
* Install postgresql database
* Add postgresql gem to the gemfile
* Change `config/database.yml` for postgresql and name the database that needs to be created
```ruby
default: &default
  adapter: postgresql
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: nav_route_dev

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: nav_route_test

production:
  <<: *default
  database: nav_route_prod

```
