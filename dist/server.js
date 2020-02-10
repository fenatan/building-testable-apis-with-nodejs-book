"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.use(_bodyParser.default.json());
app.get('/', (req, res, next) => next(new Error('Rota home quebrou'))); //middleware para tratamento de erros

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Internal Error!');
});
app.listen(3000, () => {
  console.log('Server running on port 3000!');
});