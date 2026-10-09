export const TASK_STATUSES = [
    { value : "todo", label : "To Do" },
    { value : "in-progress", label : "In Progress" },
    { value : "completed", label : "Completed" },
]

export const TASK_PRIORITIES = [
    { value : "low", label : "Low" },
    { value : "medium", label : "Medium" },
    { value : "high", label : "High" },
]

export const PASSWORD_HINT = "Min 8 characters with uppercase, lowercase, number and symbol"

export const getErrorMessage = (error, fallback = "Something went wrong") => {
    return error?.response?.data?.message || fallback
}

export const formatDate = (value) => {
    if(!value) return "—"

    return new Date(value).toLocaleDateString("en-IN", {
        day : "numeric",
        month : "short",
        year : "numeric"
    })
}

// yyyy-mm-dd for <input type="date">
export const toDateInput = (value) => {
    if(!value) return ""
    return new Date(value).toISOString().slice(0, 10)
}

export const isOverdue = (task) => {
    return task.dueDate && task.status != "completed" && new Date(task.dueDate) < new Date(new Date().toDateString())
}

export const initials = (name = "") => {
    return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("")
}