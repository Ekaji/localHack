/*
  Not Found Error Handler
*/

exports.notFound = (req, res, next) => {
    const err = new Error('Route Not Found');
    err.status = 404;
    res.render('error');
  };

/*
  Development Error Handler
*/
exports.developmentErrors = (err, req, res, next) => {
    err.stack = err.stack || '';
    const errorDetails = {
      message: err.message,
      status: err.status,
      stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
    };
    res.status(err.status || 500);
    res.format({
      // Based on the `Accept` http header
      'text/html': () => {
        res.send(errorDetails);
      }, // Form Submit, Reload the page
      'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
    });
  };

  /*
    Production Error Handler
  */
  exports.productionErrors = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({'error': {
      'message': err.message,
      error: {}
    }});
  };