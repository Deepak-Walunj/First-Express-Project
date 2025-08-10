module.exports = {
    AUTH_USERS: 'authenticated_users',
    USERS : 'users',
    ADMINS : 'admins',

    getAll() {
        return Object.values(this).filter(v => typeof v === 'string')
    },

    getByEntityType(entityType) {
        if (entityType === 'user') return this.USERS
        if (entityType === 'admin') return this.ADMIN
        throw new Error(`Unknown entity type: ${entityType}`);
    }
}