const errMiddleware = (err, req, res, next) => {
    console.error('Error encountered:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
}

export default errMiddleware;