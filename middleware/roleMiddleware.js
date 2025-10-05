const permit = (...allowedRoles) => {
    return (req, res, next) => {
        const { user } = req;
        console.log(user)
        if (!user) return res.status(401).json({ message: 'Not Authenticated' })
        const userRole = user.role.role;
        if (!allowedRoles.includes(userRole)) return res.status(403).json({ message: 'Forbidden, No access to this resourse' })
        next()
    }
}
module.exports = permit;