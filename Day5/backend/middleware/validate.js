const validateTask = (req, res, next) => {
    const { title }= req.body;

    if(!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
            message: 'Invalid task title'
        });
        console.log('Validation failed: Invalid task title');
    }
    next();

}

export default validateTask;