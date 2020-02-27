import User from "../../../src/models/users";
import AuthService from '../../../src/services/auth';

describe('Routes: Users', () => {
    let request, app;

    before(async () => {
        app = await setupApp();
        request = supertest(app);
    });

    after(async () => await app.database.connection.close());

    const defaultId = '56cb91bdc3464f14678934ca';

    const defaultUser = {
        name: 'Felipe Natan',
        email: 'felipe@gmail.com',
        password: '123',
        role: 'admin'
    }

    const expectedUser = {
        _id: '56cb91bdc3464f14678934ca',
        name: 'Felipe Natan',
        email: 'felipe@gmail.com',
        role: 'admin'
    }

    const authToken = AuthService.generateToken(expectedUser);

    beforeEach(async () => {
        await User.deleteMany();

        const user = new User(defaultUser);
        user._id = '56cb91bdc3464f14678934ca';
        return await user.save();
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    describe('GET /users', () => {
        it('should return a list of users', done => {
            request
                .get('/users')
                .set({'x-access-token': authToken})
                .end((err, res) => {
                    expect(res.body).to.eql([expectedUser]);
                    done(err);
                });
        });
        context('When an ID is specified', done => {
            it('should return 200 with one product', done => {
                request
                    .get(`/users/${defaultId}`)
                    .set({'x-access-token': authToken})
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body).to.eql([expectedUser]);
                        done(err);
                    });
            });
        });
    });

    describe('POST /users', () => {
        context('when posting a user', () => {
            it('should return a new user with status code 201', done => {
                const customId = '56cb91bdc3464f14678934ba';
                const newUser = Object.assign({}, { _id: customId, __v: 0 }, defaultUser);

                const expectedSavedUser = {
                    _id: customId,
                    name: 'Felipe Natan',
                    email: 'felipe@gmail.com',
                    role: 'admin'
                }

                request
                    .post('/users')
                    .set({'x-access-token': authToken})
                    .send(newUser)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(201);
                        expect(res.body).to.eql(expectedSavedUser);
                        done(err);
                    })
            });
        });
    });

    describe('PUT /users', () => {
        context('when editing a user', () => {
            it('should the user and return 200 as status code', done => {
                const customUser = {
                    name: 'Felipe Alterado'
                }

                const updatedUser = Object.assign({}, customUser, defaultUser);

                request
                    .put(`/users/${defaultId}`)
                    .set({'x-access-token': authToken})
                    .send(updatedUser)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        done(err);
                    })
            });
        });
    });

    describe('DELETE /users', () => {
        context('when remove a user', () => {
            it('should return status 204 when remove a user', done => {
                request
                    .delete(`/users/${defaultId}`)
                    .set({'x-access-token': authToken})
                    .end((err, res) => {
                        expect(res.status).to.eql(204);
                        done(err);
                    });
            });
        });
    });

    describe('POST /users/authenticate', () => {
        context('when authenticating an user', () => {
            it('should generate a valid token', done => {
                request
                    .post('/users/authenticate')
                    .set({'x-access-token': authToken})
                    .send({
                        email: 'felipe@gmail.com',
                        password: '123'
                    })
                    .end((err, res) => {
                        expect(res.body).to.have.key('token');
                        expect(res.status).to.eql(200);
                        done(err);
                    })
            });

            it('should return unauthorized when the pass does not match', done => {
                request
                    .post('/users/authenticate')
                    .set({'x-access-token': authToken})
                    .send({
                        email: 'felipe@gmail.com',
                        password: 'senhaerrada'
                    })
                    .end((err, res) => {
                        expect(res.status).to.eql(401);
                        done(err);
                    })
            });
        });
    });
});

