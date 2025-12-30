package infrastructure.graphql.query

import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.UserUseCase
import domain.model.UserRole
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.dto.page.PaginatedUsers
import infrastructure.graphql.dto.response.UserResponse

class UserQuery : Query {

    private val userUseCase = GlobalContext.get().get<UserUseCase>()

    fun users(
        dataFetchingEnvironment: DataFetchingEnvironment,
        limit: Int = 10,
        offset: Int = 0
    ): PaginatedUsers = dataFetchingEnvironment.graphQlContext.validateRoles(listOf(UserRole.ADMIN)) {
        val page = userUseCase.getAllUsers(limit, offset)
        PaginatedUsers(
            items = page.items.map { UserResponse(it) },
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
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