import User from "../models/users";

class UsersController {

    constructor(User) {
        this.User = User;
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
        try {
            await this.User.updateOne({ _id: req.params.id }, req.body);
            res.sendStatus(200);
        } catch (error) {
            res.status(422).send(error.message);
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
}

export default UsersController;