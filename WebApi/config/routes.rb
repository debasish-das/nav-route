Rails.application.routes.draw do
  resources :users, defaults: {format: :json} do
    get :get_current_user, on: :collection
    post :signin, on: :collection
    post :signout, on: :collection
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
