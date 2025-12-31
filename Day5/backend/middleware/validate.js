const validateUser = (req, res, next) => {
    const { username, password }= req.body;
    try {
        if (!username || typeof username !== 'string' || username.length < 3) {
            return res.status(400).json({
                 message: "Invalid username" 
                });
        }   
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ 
                message: "Invalid password" 
            });
        }
        next();
    } catch (err) {
        console.error("Validation Error", err);
        res.status(500).json({ 
            message: "Internal Server Error"
         });
    }
};
export default validateUser;