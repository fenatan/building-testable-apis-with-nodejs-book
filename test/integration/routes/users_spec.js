import User from "../../../src/models/users";

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
        __v: 0,
        _id: '56cb91bdc3464f14678934ca',
        name: 'Felipe Natan',
        email: 'felipe@gmail.com',
        password: '123',
        role: 'admin'
    }

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
                .end((err, res) => {
                    expect(res.body).to.eql([expectedUser]);
                    done(err);
                });
        });
        context('When an ID is specified', done => {
            it('should return 200 with one product', done => {
                request
                    .get(`/users/${defaultId}`)
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
                    __v: 0,
                    _id: customId,
                    name: 'Felipe Natan',
                    email: 'felipe@gmail.com',
                    password: '123',
                    role: 'admin'
                }

                request
                    .post('/users')
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
                    .send(updatedUser)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        done(err);
                    })
            });
        });
    });

    describe('when remove a user', () => {
        it('should return status 204 when remove a user', done => {
            request
                .delete(`/users/${defaultId}`)
                .end((err, res) => {
                    expect(res.status).to.eql(204);
                    done(err);
                });
        });
    });
});

