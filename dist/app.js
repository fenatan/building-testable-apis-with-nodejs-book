"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.use(_bodyParser.default.json()); //middleware para tratamento de erros

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Internal Error!');
});
app.get('/', (req, res, next) => res.send('Hello Nodeee!'));
var _default = app;
exports.default = _default;