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
