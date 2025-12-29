package application.usecase.interfaces

import application.input.UserInput
import domain.model.User

interface UserUseCase {
    fun getAllUsers(limit: Int, offset: Int): List<User>
    fun getTotalUsersCount(): Int
    fun getUserById(id: String): User?
    fun createUser(dto: UserInput): User
    fun login(username: String, password: String): User?
}