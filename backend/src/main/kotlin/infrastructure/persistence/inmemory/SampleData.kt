package infrastructure.persistence.inmemory

import application.common.UserJwt
import application.usecase.interfaces.*
import domain.model.ProjectStatus
import domain.model.UserRole
import infrastructure.graphql.dto.input.*

fun initializeSampleData(
    userUseCase: UserUseCase,
    organizationUseCase: OrganizationUseCase,
    projectUseCase: ProjectUseCase,
    deliverableUseCase: DeliverableUseCase,
    workPackageUseCase: WorkPackageUseCase
) {
    // Create admin user for operations
    val adminUser = UserJwt(
        id = "admin1",
        username = "admin",
        role = UserRole.ADMIN
    )
    
    // Create organizations using use case
    val org1 = organizationUseCase.createOrganization(OrganizationInput(
        name = "University of Technology",
        picCode = 123456,
        country = "Germany"
    ))
    
    val org2 = organizationUseCase.createOrganization(OrganizationInput(
        name = "Research Institute",
        picCode = 789012,
        country = "France"
    ))
    
    val org3 = organizationUseCase.createOrganization(OrganizationInput(
        name = "Innovation Labs",
        picCode = 345678,
        country = "Spain"
    ))
    
    val org4 = organizationUseCase.createOrganization(OrganizationInput(
        name = "Tech Solutions",
        picCode = 901234,
        country = "Italy"
    ))
    
    // Create users using use case
    val admin = userUseCase.createUser(UserInput(
        username = "admin",
        email = "admin@example.com",
        password = "admin123",
        role = UserRole.ADMIN
    ))
    val manager1 = userUseCase.createUser(UserInput(
        username = "manager1",
        email = "manager1@example.com",
        password = "manager123",
        role = UserRole.MANAGER,
        organizationId = org1.id
    ))
    val manager2 = userUseCase.createUser(UserInput(
        username = "manager2",
        email = "manager2@example.com",
        password = "manager123",
        role = UserRole.MANAGER,
        organizationId = org2.id
    ))
    val partner1 = userUseCase.createUser(UserInput(
        username = "partner1",
        email = "partner1@example.com",
        password = "partner123",
        role = UserRole.PARTNER,
        organizationId = org1.id
    ))
    val partner2 = userUseCase.createUser(UserInput(
        username = "partner2",
        email = "partner2@example.com",
        password = "partner123",
        role = UserRole.PARTNER,
        organizationId = org2.id
    ))
    val partner3 = userUseCase.createUser(UserInput(
        username = "partner3",
        email = "partner3@example.com",
        password = "partner123",
        role = UserRole.PARTNER,
        organizationId = org3.id
    ))
    val partner4 = userUseCase.createUser(UserInput(
        username = "partner4",
        email = "partner4@example.com",
        password = "partner123",
        role = UserRole.PARTNER,
        organizationId = org4.id
    ))
    
    // Create projects using use case
    val project1 = projectUseCase.createProject(ProjectInput(
        title = "European AI Research",
        acronym = "EAIR",
        status = ProjectStatus.ACTIVE
    ), adminUser)
    
    val project2 = projectUseCase.createProject(ProjectInput(
        title = "Digital Innovation Platform",
        acronym = "DIP",
        status = ProjectStatus.DRAFT
    ), adminUser)
    
    val project3 = projectUseCase.createProject(ProjectInput(
        title = "Sustainable Technology Solutions",
        acronym = "STS",
        status = ProjectStatus.COMPLETED
    ), adminUser)
    
    // Add managers and partners to projects
    projectUseCase.addManagerToProject(project1.id, manager1.id, adminUser)
    projectUseCase.addManagerToProject(project2.id, manager2.id, adminUser)
    projectUseCase.addManagerToProject(project3.id, manager1.id, adminUser)
    projectUseCase.addManagerToProject(project3.id, manager2.id, adminUser)
    
    projectUseCase.addPartnerToProject(project1.id, partner1.id, adminUser)
    projectUseCase.addPartnerToProject(project1.id, partner2.id, adminUser)
    projectUseCase.addPartnerToProject(project2.id, partner2.id, adminUser)
    projectUseCase.addPartnerToProject(project2.id, partner3.id, adminUser)
    projectUseCase.addPartnerToProject(project2.id, partner4.id, adminUser)
    projectUseCase.addPartnerToProject(project3.id, partner1.id, adminUser)
    projectUseCase.addPartnerToProject(project3.id, partner3.id, adminUser)
    
    // Create work packages using use case
    val wp1 = workPackageUseCase.createWorkPackage(WorkPackageInput(
        projectId = project1.id,
        wpNumber = 1,
        title = "Research Phase",
        leadPartnerId = partner1.id
    ), adminUser)
    
    val wp2 = workPackageUseCase.createWorkPackage(WorkPackageInput(
        projectId = project1.id,
        wpNumber = 2,
        title = "Development Phase",
        leadPartnerId = partner2.id
    ), adminUser)
    
    val wp3 = workPackageUseCase.createWorkPackage(WorkPackageInput(
        projectId = project2.id,
        wpNumber = 1,
        title = "Platform Design",
        leadPartnerId = partner3.id
    ), adminUser)
    
    val wp4 = workPackageUseCase.createWorkPackage(WorkPackageInput(
        projectId = project2.id,
        wpNumber = 2,
        title = "Implementation",
        leadPartnerId = partner4.id
    ), adminUser)
    
    val wp5 = workPackageUseCase.createWorkPackage(WorkPackageInput(
        projectId = project3.id,
        wpNumber = 1,
        title = "Final Report",
        leadPartnerId = partner1.id
    ), adminUser)
    
    // Create deliverables using use case
    deliverableUseCase.createDeliverable(wp1.id, DeliverableInput(
        description = "Research report",
        dueDate = "2024-12-31",
        assignedTo = partner1.id
    ))
    
    deliverableUseCase.createDeliverable(wp1.id, DeliverableInput(
        description = "Literature review",
        dueDate = "2024-11-30",
        assignedTo = partner1.id
    ))
    
    deliverableUseCase.createDeliverable(wp2.id, DeliverableInput(
        description = "Prototype development",
        dueDate = "2025-03-31",
        assignedTo = partner2.id
    ))
    
    deliverableUseCase.createDeliverable(wp3.id, DeliverableInput(
        description = "System architecture",
        dueDate = "2024-10-15",
        assignedTo = partner3.id
    ))
    
    deliverableUseCase.createDeliverable(wp4.id, DeliverableInput(
        description = "Beta version",
        dueDate = "2025-01-15",
        assignedTo = partner4.id
    ))
    
    deliverableUseCase.createDeliverable(wp5.id, DeliverableInput(
        description = "Final project report",
        dueDate = "2024-09-30",
        assignedTo = partner1.id
    ))
}