import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    // Middleware will auth the request before the action occurs (e.g. liking post)
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if(token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    // Launch action after authentication
    next();
  } catch (error) {
    console.log(error);
  }
}

export default auth;