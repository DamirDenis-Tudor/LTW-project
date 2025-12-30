package application.common

open class Page<T>(
    open val items: List<T>,
    open val totalCount: Int,
    open val hasNextPage: Boolean
)