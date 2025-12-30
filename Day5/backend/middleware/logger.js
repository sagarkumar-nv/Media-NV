const loggerMiddleware = (req, res, next) => {
  const time = new Date().toLocaleTimeString();

  console.log(`${req.method} ${req.url} - ${time}`);
  next();
};

export default loggerMiddleware;
