function detectFeature(file) {

    const path = file.path.toLowerCase();


    // Sécurité / authentification
    if (
        path.includes("authentication") ||
        path.includes("auth") ||
        path.includes("login")
    ) {
        return "Authentication";
    }


    // Intelligence artificielle
    if (
        path.includes("llm") ||
        path.includes("prompt") ||
        path.includes("ai")
    ) {
        return "AI Core";
    }


    // Base de données
    if (
        path.includes("database") ||
        path.includes("db") ||
        path.includes("sql")
    ) {
        return "Database";
    }


    // Patients
    if (
        path.includes("patient")
    ) {
        return "Patient Management";
    }


    // Planning / visites
    if (
        path.includes("schedule") ||
        path.includes("visit") ||
        path.includes("grid")
    ) {
        return "Scheduling";
    }


    // Tâches automatiques
    if (
        path.includes("cron") ||
        path.includes("task")
    ) {
        return "Scheduled Tasks";
    }


    // NHS
    if (
        path.includes("nhs")
    ) {
        return "NHS Integration";
    }


    return "Other";

}


module.exports = {
    detectFeature
};