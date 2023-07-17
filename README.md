## Frontend
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

## Backend
### Rails API 
Path: ./WebApp

Recources: https://guides.rubyonrails.org/, https://guides.rubyonrails.org/api_app.html

#### Steps:
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
### Google API (External API)
