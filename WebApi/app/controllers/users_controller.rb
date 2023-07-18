class UsersController < ApplicationController
  # before_action :set_user, only: %i[ show edit update destroy ]

  # GET /users or /users.json
  # def index
  #   @users = User.all
  # end

  # # GET /users/1 or /users/1.json
  # def show
  #   render json: @user, status: :ok
  # end

  # # GET /users/new
  # def new
  #   @user = User.new
  # end

  # # GET /users/1/edit
  # def edit
  # end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        session[:user_id] = @user.id
        # format.html { redirect_to user_url(@user), notice: "User was successfully created." }
        format.json { render json: {id: @user.id, email: @user.email, first_name: @user.first_name}, status: :created }
      else
        # format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def get_current_user
    render json: current_user
  end

  # PATCH/PUT /users/1 or /users/1.json
  # def update
  #   respond_to do |format|
  #     if @user.update(user_params)
  #       # format.html { redirect_to user_url(@user), notice: "User was successfully updated." }
  #       format.json { render :show, status: :ok, location: @user }
  #     else
  #       # format.html { render :edit, status: :unprocessable_entity }
  #       format.json { render json: @user.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # DELETE /users/1 or /users/1.json
  # def destroy
  #   @user.destroy

  #   respond_to do |format|
  #     format.html { redirect_to users_url, notice: "User was successfully destroyed." }
  #     format.json { head :no_content }
  #   end
  # end

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

  private
    # Use callbacks to share common setup or constraints between actions.
    # def set_user
    #   @user = User.find(params[:id])
    # end

    def user_params
      params.require(:user).permit(
        :first_name,
        :last_name,
        :email,
        :password,
        :password_confirmation
      )
    end
end
