class User < ApplicationRecord
    has_secure_password

    validates :email, presence: true, uniqueness: {message: "needs to be unique!", case_sensitive: false}
    validates :first_name, presence: true
end
