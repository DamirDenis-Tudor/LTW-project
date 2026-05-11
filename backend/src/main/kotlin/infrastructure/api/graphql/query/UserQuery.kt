package infrastructure.api.graphql.query

import com.expediagroup.graphql.server.operations.Query
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.UserUseCase
import domain.model.UserRole
import infrastructure.api.graphql.context.validateRoles
import infrastructure.api.graphql.dto.page.PaginatedUsers
import infrastructure.api.graphql.dto.response.UserResponse

class UserQuery : Query {

    private val userUseCase = GlobalContext.get().get<UserUseCase>()

    @GraphQLDescription("Get paginated list of all users (Admin only)")
    fun users(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of users to return") limit: Int = 10,
        @GraphQLDescription("Number of users to skip for pagination") offset: Int = 0
    ): PaginatedUsers = dataFetchingEnvironment.graphQlContext.validateRoles(listOf(UserRole.ADMIN, UserRole.MANAGER)) {
        val page = userUseCase.getAllUsers(limit, offset)
        PaginatedUsers(
            items = page.items.map { UserResponse(it) },
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }

    @GraphQLDescription("Get a specific user by ID (Admin only)")
    fun user(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Unique identifier of the user") id: String
    ): UserResponse? = dataFetchingEnvironment.graphQlContext.validateRoles(listOf(UserRole.ADMIN)) {
        userUseCase.getUserById(id)?.let {
            UserResponse(it)
        }
    }
}