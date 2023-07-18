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

#### Steps to Run:
* Add google map api `YOUR_APP_KEY` in the `index.html`
```
<script 
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_APP_KEY&libraries=places"
        ></script>
```
* Live server extenstion from VS code can be used to run the frontend in development environment. Then clicking the `Go Live` button at bottom right.
* Or, if we have NodeJs, we can install `http-server` with npm. Then, run the command `http-server ./WebApp -p 8088`

## Backend
### Rails API 
Path: ./WebApp

Recources: https://guides.rubyonrails.org/, https://guides.rubyonrails.org/api_app.html

#### Steps to Setup and Develop the WebAPI:
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
* Add the following in `Gemfile` to encrypt password
```ruby
gem "bcrypt", "~> 3.1.7"
```
* Run the following command to create the model User for signin and signup
```ruby
rails generate model User first_name:string last_name:string email:string password_digest:string
```
* Add `has_secure_password` to `WebApi/app/models/user.rb`
* Modify `application_controller.rb` for user authentication
```ruby
class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token
    
    def authenticate_user!
        render json: {message: "Please Sign in"}, status:401 unless user_signed_in?
    end
    
    def user_signed_in?
        current_user.present?
    end
    
    helper_method :user_signed_in?

    def current_user
        @current_user ||= User.find_by_id session[:user_id]
    end
    
    helper_method :current_user
end
```
* Modify `application.rb` for cors support
```ruby
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '127.0.0.1:5500','127.0.0.1:8088'
        
        resource '/*', 
          headers: :any, 
          methods: :any,
          credentials: true
      end
    end
```
* Scaffold User controller with the following command
```
rails g scaffold_controller User
```
* Add json format as default in `routes.rb`
```ruby
resources :users, defaults: {format: :json}
```
* Remove or comment out the views, spec files, and the codes that won't be necessary for the project
* Add `WebApi/app/serializers/user_serializer.rb` to prevent exposing the hash password
```ruby
class UserSerializer < ActiveModel::Serializer
    attributes :id, :first_name, :last_name
end
```
* Add the following in `WebApi/app/models/user.rb` for unique user email and related validation
```ruby
    validates :email, presence: true, uniqueness: {message: "needs to be unique!", case_sensitive: false}
    validates :first_name, presence: true
```
* Add the following in `WebApi/app/controllers/users_controller.rb` for getting the logged in user, signin and signout
```ruby
  def get_current_user
    render json: current_user
  end

  def signin
    @user = User.find_by_email params[:email]
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      render json: {id: @user.id, first_name: @user.first_name}
    else
      render json: {message: "Invalid credentials", status: 401}, status: 401
    end
  end

  def signout
      session[:user_id] = nil
      render json: { message: "Logged out" }
  end

```
* Add the routes for signin and signout in `WebApi/config/routes.rb`
```ruby
  resources :users, defaults: {format: :json} do
    get :get_current_user, on: :collection
    post :signin, on: :collection
    post :signout, on: :collection
  end
``` 
### Google API (External API)
