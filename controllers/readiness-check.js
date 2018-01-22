const db = require('../db');

module.exports = (req, res) => {
  let errors = {};
  if (Object.keys(db.error).length > 0) {
    errors = Object.assign(
      Object.keys(db.error).reduce((prev, current, index) => {
        return (db.error[current] !== null) ? Object.assign(prev, {
          [current]: db.error[current],
        }) : prev;
      }, {})
    );
  }
  if (Object.keys(errors).length > 0) {
    res.status(500).json(errors);
  } else {
    res.status(200).json('ok');
  }
};
