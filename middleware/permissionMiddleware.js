const permitPermission = (requiredPermissions = []) => {
    return (req, res, next) => {
        const { user } = req;
        console.log(user)
        if (!user) return res.status(401).json({ message: 'Not Authenticated' })
        console.log(user)
        const userPermissions = user.role.permission;
        console.log(userPermissions)
        const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
        if (!hasPermission) return res.status(403).json({ message: 'Forbidden, No access to this resourse' })
        next()
    }
}
module.exports = permitPermission;