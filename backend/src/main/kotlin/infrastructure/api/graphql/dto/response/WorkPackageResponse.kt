package infrastructure.api.graphql.dto.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.WorkPackageContract
import application.usecase.interfaces.DeliverableUseCase
import application.usecase.interfaces.WorkPackageUseCase
import infrastructure.api.graphql.dto.page.PaginatedDeliverables
import graphql.schema.DataFetchingEnvironment
import infrastructure.api.graphql.context.requireUser
import infrastructure.api.graphql.context.validateRoles
import domain.model.UserRole

@GraphQLDescription("Work package response with additional GraphQL fields")
class WorkPackageResponse(
    private val workPackage: WorkPackageContract
) : WorkPackageContract by workPackage {

    private val deliverableUseCase = GlobalContext.get().get<DeliverableUseCase>()
    private val workPackageUseCase = GlobalContext.get().get<WorkPackageUseCase>()

    @GraphQLDescription("Unique identifier for the work package")
    override val id: String get() = workPackage.id

    @GraphQLDescription("Work package number")
    override val wpNumber: Int get() = workPackage.wpNumber

    @GraphQLDescription("Title of the work package")
    override val title: String get() = workPackage.title

    @GraphQLDescription("Get paginated deliverables for this work package (Authenticated users only)")
    fun deliverables(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0,
        @GraphQLDescription("Filter by submission status") isSubmitted: Boolean? = null
    ): PaginatedDeliverables = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER, UserRole.PARTNER)
    ) { user ->
        val page = deliverableUseCase.getDeliverablesByWorkPackageId(workPackage.id, limit, offset, isSubmitted)
        val deliverables = page.items.map { DeliverableResponse(it) }
        PaginatedDeliverables(
            items = deliverables,
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }

    @GraphQLDescription("Get the project this work package belongs to")
    fun project(dataFetchingEnvironment: DataFetchingEnvironment): ProjectResponse? =
        dataFetchingEnvironment.graphQlContext.requireUser { user ->
            workPackageUseCase.getWorkPackageProject(workPackage.id)
                ?.let { ProjectResponse(it) }
        }

    @GraphQLDescription("Get the lead partner user for this work package")
    fun leadPartner(dataFetchingEnvironment: DataFetchingEnvironment): UserResponse? =
        dataFetchingEnvironment.graphQlContext.requireUser { user ->
            workPackageUseCase.getWorkPackageLeadPartner(workPackage.id)
                ?.let { UserResponse(it) }
        }
}