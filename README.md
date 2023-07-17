## Frontend
### ES6 Module Application
## Backend
### Rails API
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
### Google API (External API)
