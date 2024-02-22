export const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.json({ status: "error", message: "Necesitas estar autenticado" });
        }
        if (!roles.includes(req.user.role)) {
            return res.json({ status: "error", message: "No estás autorizado" });
        }
        next();
    };
};