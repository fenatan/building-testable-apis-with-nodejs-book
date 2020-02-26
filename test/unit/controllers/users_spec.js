import UsersController from '../../../src/controllers/users';
import User from '../../../src/models/users';
import sinon from 'sinon';
import { response } from 'express';

describe('Controllers: Users', () => {
    const defaultUser = [{
        name: 'Felipe Natan',
        email: 'felipe@gmail.com',
        password: '123',
        role: 'admin'
    }];

    const expectedUser = {
        __v: 0,
        _id: '56cb91bdc3464f14678934ca',
        name: 'Felipe Natan',
        email: 'felipe@gmail.com',
        password: '123',
        role: 'admin'
    }

    const defaultRequest = {
        params: {}
    }

    describe('get() users', () => {
        it('should return a list of users', async () => {
            const response = {
                send: sinon.spy()
            };

            User.find = sinon.stub();
            User.find.withArgs({}).resolves(defaultUser);

            const usersController = new UsersController(User);

            await usersController.get(defaultRequest, response);

            sinon.assert.calledWith(response.send, defaultUser);
        });

        it('should return 400 when a error occurs', async () => {
            const request = {};
            const response = {
                send: sinon.spy(),
                status: sinon.stub()
            }

            response.status.withArgs(400).returns(response);
            User.find = sinon.stub();
            User.find.withArgs({}).rejects({ message: 'Error' });

            const usersController = new UsersController(User);
            await usersController.get(request, response);

            sinon.assert.calledWith(response.send, 'Error');
        })
    });

    describe('getById() users', () => {
        it('should return one user', async () => {
            const fakeId = 'fakeId';
            const request = {
                params: {
                    id: fakeId
                }
            }

            const response = {
                send: sinon.spy()
            }

            User.find = sinon.stub();
            User.find.withArgs({ _id: fakeId }).resolves(expectedUser);

            const usersController = new UsersController(User);
            await usersController.getById(request, response);

            sinon.assert.calledWith(response.send, expectedUser);
        });
    })

    describe('create() users', () => {
        it('should save a new user successfully', async () => {
            const requestWithBody = Object.assign({}, { body: defaultUser[0] }, defaultRequest);

            const response = {
                status: sinon.stub(),
                send: sinon.spy()
            }

            class fakeUser {
                save() { }
            }

            response.status.withArgs(201).returns(response);
            sinon.stub(fakeUser.prototype, 'save')
                .withArgs()
                .resolves();

            const usersController = new UsersController(fakeUser);

            await usersController.create(requestWithBody, response);

            sinon.assert.calledWith(response.send);

        });

        context('when an error occurs', () => {
            it('should return 422', async () => {
                const response = {
                    send: sinon.spy(),
                    status: sinon.stub()
                }

                class fakeUser {
                    save() { }
                }

                response.status.withArgs(422).returns(response);
                sinon.stub(fakeUser.prototype, 'save')
                    .withArgs()
                    .rejects({ message: 'Error' });

                const usersController = new UsersController(fakeUser);
                await usersController.create(defaultRequest, response);

                sinon.assert.calledWith(response.status, 422);
            });
        });
    })

    describe('update() user', () => {
        it('should return 200 when one user has been updated', async () => {
            const fakeId = 'fakeID';
            const updatedUser = {
                _id: fakeId,
                name: 'Alterado',
                email: 'alterado@gmail.com',
                password: '123',
                role: 'client'
            }
            const request = {
                params: {
                    id: fakeId
                },
                body: updatedUser
            }

            const response = {
                sendStatus: sinon.spy()
            }

            class fakeUser {
                static updateOne() { }
            }

            const updateOneStub = sinon.stub(fakeUser, 'updateOne');
            updateOneStub
                .withArgs({ _id: fakeId }, updatedUser)
                .resolves(updatedUser);

            const usersController = new UsersController(fakeUser);
            await usersController.update(request, response);

            sinon.assert.calledWith(response.sendStatus, 200);
        });

        context('when an error occurs', () => {
            it('should return 422', async () => {
                const fakeId = 'fakeID';
                const updatedUser = {
                    _id: fakeId,
                    name: 'Alterado',
                    email: 'alterado@gmail.com',
                    password: '123',
                    role: 'client'
                }
                const request = {
                    params: {
                        id: fakeId
                    },
                    body: updatedUser
                }

                const response = {
                    status: sinon.stub(),
                    send: sinon.spy()
                }

                class fakeUser {
                    static updateOne() { }
                }

                const updateOneStub = sinon.stub(fakeUser, 'updateOne');
                updateOneStub
                    .withArgs({ _id: fakeId }, updatedUser)
                    .rejects({ message: 'Error' });

                response.status.withArgs(422).returns(response);

                const usersController = new UsersController(fakeUser);
                await usersController.update(request, response);

                sinon.assert.calledWith(response.send, 'Error');
            });
        })
    });

    describe('remove() user', () => {
        it('should return status code 204 when remove a user', async () => {
            const fakeID = 'a-fake-id';
            const request = {
                params: {
                    id: fakeID
                }
            }
            const response = {
                sendStatus: sinon.spy()
            }

            class fakeUser {
                static deleteOne() { }
            }

            const deleteOneStub = sinon.stub(fakeUser, 'deleteOne');

            deleteOneStub.withArgs({ _id: fakeID }).resolves();

            const usersController = new UsersController(fakeUser);

            await usersController.remove(request, response);
            sinon.assert.calledWith(response.sendStatus, 204);
        });

        context('when an error occurs', () => {
            it('should return 400', async () => {
                const fakeID = 'a-fake-id';
                const request = {
                    params: {
                        id: fakeID
                    }
                }
                const response = {
                    send: sinon.spy(),
                    status: sinon.stub()
                }

                class fakeUser {
                    static deleteOne() { }
                }

                const deleteOneStub = sinon.stub(fakeUser, 'deleteOne');

                deleteOneStub.withArgs({ _id: fakeID }).rejects({ message: 'Error' });

                response.status.withArgs(400).returns(response);

                const usersController = new UsersController(fakeUser);

                await usersController.remove(request, response);
                sinon.assert.calledWith(response.send, 'Error');
            });
        });
    })
});