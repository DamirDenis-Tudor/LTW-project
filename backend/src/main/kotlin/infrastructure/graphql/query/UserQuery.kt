package infrastructure.graphql.query

import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.UserUseCase
import domain.model.UserRole
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.response.page.PaginatedUsers
import infrastructure.graphql.response.UserResponse

class UserQuery : Query {

    private val userUseCase = GlobalContext.get().get<UserUseCase>()

    fun users(
        dataFetchingEnvironment: DataFetchingEnvironment,
        limit: Int = 10,
        offset: Int = 0
    ): PaginatedUsers = dataFetchingEnvironment.graphQlContext.validateRoles(listOf(UserRole.ADMIN)) {
        val users = userUseCase.getAllUsers(limit, offset).map { UserResponse(it) }
        val totalCount = userUseCase.getTotalUsersCount()
        PaginatedUsers(
            items = users,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    fun user(
        dataFetchingEnvironment: DataFetchingEnvironment,
        id: String
    ): UserResponse? = dataFetchingEnvironment.graphQlContext.validateRoles(listOf(UserRole.ADMIN)) {
        userUseCase.getUserById(id)?.let {
            UserResponse(it)
        }
    }
}