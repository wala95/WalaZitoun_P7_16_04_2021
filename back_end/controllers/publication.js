const models = require('../models');
const Publication = models.Publication;
const fs = require('fs');
let { getLinkPreview, _ } = require('link-preview-js');


exports.creatPublication = (req, res) => {// création des nouvelles publications

  let content = req.body.content;
  let img = null;
  if (req.file) {
    img = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  Publication.create({
    utilisateur_id: res.locals.userId,
    content: content,
    image: img
  }).then(() => res.status(201).json({ message: 'Publication added!' }))
    .catch(error => {
      console.log("eroor", error)
      return res.status(400).json({ error: 'cannot add publication' })
    });
}

exports.getPublication = (req, res, next) => {
  Publication.findAll({
    include: [{
      model: models.User,
    }, {
      model: models.Commentaire,
      include: [{
        model: models.User,
      }]
    }],
    order: [
      ['createdAt', 'DESC']
    ]
  })
    .then(
      (publications) => {
        for (pub of publications) {
          pub.Commentaires.sort((a, b) => a.createdAt - b.createdAt);
        }
        res.status(200).json(publications);
      }
    ).catch(
      (error) => {
        console.log("error", error)
        res.status(400).json({
          'error': error
        });
      }
    );
};
exports.deletePublication = (req, res) => {
  let findPromise = null;

  if (res.locals.isAdmin) {
    findPromise = Publication.findOne({
      where: {
        id: req.params.id
      }
    });
  } else {
    findPromise = Publication.findOne({
      where: {
        id: req.params.id,
        utilisateur_id: res.locals.userId
      }
    });
  }
  //is admin
  findPromise.then(publication => {
    if (!publication) { // si publication non trouvé
      return res.status(401).json({ error: 'Publication non trouvé pour cet utilisateur!' });
    }
    let image = publication.image;
    Publication.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => {
      if (image) {
        const filename = image.split('/images/')[1];
        //supprime l'image depuis le disk dure apres avoir supprimé le post depuis la BDD
        fs.unlink(`images/${filename}`, err => {
          if (err) {
            res.status(500).json({ "error": "Publication supprimé mais impossible de supprimer son image" });
          } else {
            res.status(200).json({ message: 'Publication supprimé!' });
          }
        });
      } else {
        res.status(200).json({ message: 'Publication supprimé!' });
      }
    }).catch(error => {
      console.log('erreur', error);
      res.status(400).json({ "error": error });
    });
  })
    .catch(error => {
      console.log('erreur', error)
      res.status(500).json({ "error": error });
    });
};

exports.updatePublication = (req, res) => {// modifier la publication

  let content = req.body.content;


  Publication.update( 
    {content : content}, {
    where: {
      id: req.params.id,
      utilisateur_id: res.locals.userId
    }})
    .then(() => {

      res.status(200).json({ message: 'Publication modifier!' })
    })
    .catch(error => {
      console.log("eroor", error)
      return res.status(400).json({ error: 'cannot update publication' })
    });
}
