
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//récuprer le token dans le header authaurisation (inspect/network 2eme mot)
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);// décoder le token (le mot clé le meme que celui déclaré au token)  
    const userId = decodedToken.userId; //recuperer le userid
    const isAdmin = decodedToken.isAdmin;
    //propager les deux informations qu'on vient de les decoder du token
    res.locals.userId = userId;
    res.locals.isAdmin = isAdmin;

    next();
  } catch {
    res.status(401).json({
      error: new Error('Utilisateur non autorisé!')
    });
  }
};