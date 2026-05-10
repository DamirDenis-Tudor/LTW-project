package application.usecase.interfaces

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import domain.model.UserRole

@GraphQLIgnore
interface AuthProvider {
    fun authenticate(username: String, password: String): String?
    fun createUser(username: String, email: String, password: String, role: UserRole)
    fun deleteUser(username: String)
}
