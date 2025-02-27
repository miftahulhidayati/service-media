var express = require('express');
var router = express.Router();
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const fs = require('fs');
const { Media } = require('../models');

router.get('/', async function(req, res, next) {
  const media = await Media.findAll({attributes: ['id', 'image']});

  const mappedMedia = media.map(medium => {
    medium.image = `${req.get('host')}/${medium.image}`;
    return medium;
  });

  return res.json({status:'success',data:mappedMedia});
});

router.post('/', function(req, res, next) {
  const image = req.body.image;

  if (!isBase64(image, {mimeRequired: true})) {
    return res.status(400).json({status:'error',message: 'Invalid base64'});
  }
  base64Img.img(image, './public/images', Date.now(), async function(err, filepath) {
    if (err) {
      return res.status(400).json({status:'error',message: err.message});
    }
    const filename = filepath.split('/').pop();

    const media = await Media.create({image: `images/${filename}`});

    return res.json({
      status:'success',
      data: {
        id: media.id,
        image: `${req.get('host')}/${media.image}`,
      }});
  })

});

router.delete('/:id', async function(req, res, next) {
  const id = req.params.id;

  const media = await Media.findByPk(id);
  if (!media) {
    return res.status(404).json({status:'error',message:'Media not found'});
  }
  fs.unlink(`./public/${media.image}`, async function(err) {
    if (err) {
      return res.status(400).json({status:'error',message: err.message});
    }
    await media.destroy();

    return res.json({status:'success',message:'Media deleted'});
  });

});
module.exports = router;
