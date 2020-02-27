class UsersController {
  constructor(User, AuthService) {
    this.User = User;
    this.AuthService = AuthService;
  }

  async get(req, res) {
    try {
      const users = await this.User.find({});
      res.send(users);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async getById(req, res) {
    try {
      const user = await this.User.find({ _id: req.params.id });
      res.send(user);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async create(req, res) {
    try {
      const user = new this.User(req.body);

      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(422).send(error.message);
    }
  }

  async update(req, res) {
    const { body } = req;
    try {
      const user = await this.User.findById(req.params.id);

      user.name = body.name;
      user.email = body.email;
      user.role = body.role;
      if (body.password) {
        user.password = body.password;
      }
      await user.save();

      res.sendStatus(200);
    } catch (err) {
      res.status(422).send(err.message);
    }
  }

  async remove(req, res) {
    try {
      await this.User.deleteOne({ _id: req.params.id });
      res.sendStatus(204);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async authenticate(req, res) {
    const authService = new this.AuthService(this.User);
    const user = await authService.authenticate(req.body);

    if (!user) {
      return res.sendStatus(401);
    }

    const token = this.AuthService.generateToken({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });

    return res.send({ token });
  }
}

export default UsersController;
