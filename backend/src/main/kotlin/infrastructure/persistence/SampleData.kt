package infrastructure.persistence

import domain.model.*
import domain.repository.*
import java.security.MessageDigest

fun initializeSampleData(
    userRepo: UserRepository,
    organizationRepo: OrganizationRepository,
    projectRepo: ProjectRepository,
    deliverableRepo: DeliverableRepository,
    workPackageRepo: WorkPackageRepository
) {
    // Sample organizations
    val org1 = Organization("org1", "University of Technology", 123456, "Germany")
    val org2 = Organization("org2", "Research Institute", 789012, "France")
    organizationRepo.save(org1)
    organizationRepo.save(org2)
    
    // Sample users with hashed passwords
    val admin = User("admin1", "admin", "admin@example.com", hashPassword("admin123"), UserRole.ADMIN)
    val manager = User("mgr1", "manager", "manager@example.com", hashPassword("manager123"), UserRole.MANAGER)
    val partner = User("partner1", "partner", "partner@example.com", hashPassword("partner123"), UserRole.PARTNER, "org1")

    println(admin)

    userRepo.save(admin)
    userRepo.save(manager)
    userRepo.save(partner)
    
    // Sample project
    val project = Project(
        "proj1", 
        "European AI Research", 
        "EAIR", 
        ProjectStatus.ACTIVE,
        listOf("org1", "org2"),
        listOf("wp1"),
        listOf("mgr1")
    )
    projectRepo.save(project)
    
    // Sample work package
    val workPackage = WorkPackage("wp1", "proj1", 1, "Research Phase", "org1")
    workPackageRepo.save(workPackage)
    
    // Sample deliverable
    val deliverable = Deliverable("del1", "wp1", "Research report", "2024-12-31", false, "partner1")
    deliverableRepo.save(deliverable)
}

private fun hashPassword(password: String): String =
    MessageDigest.getInstance("SHA-256")
        .digest(password.toByteArray())
        .joinToString("") { "%02x".format(it) }