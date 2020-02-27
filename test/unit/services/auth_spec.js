import AuthService from '../../../src/services/auth';
import bcrypt from 'bcrypt';
import Util from 'util';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import config from 'config';
import UsersController from '../../../src/controllers/users';

const hash = Util.promisify(bcrypt.hash);

describe('Service: Auth', () => {
    context('authenticate', () => {
        it('should authenticate a user', async () => {
            const fakeUserModel = {
            }

            const user = {
                name: 'Felipe Natan',
                email: 'felipe@gmail.com',
                password: '123'
            }

            const userWithEncryptedPassword = {
                ...user,
                password: bcrypt.hashSync(user.password, 10)
            };

            class FakeAuthService {
                authenticate() {
                    return Promise.resolve(userWithEncryptedPassword)
                }
                static generateToken() {
                     return jwtToken;
                     }
            };

            const jwtToken = jwt.sign(
                userWithEncryptedPassword,
                config.get('auth.key'),
                {
                    expiresIn: config.get('auth.tokenExpiresIn')
                }
            );

            const fakeReq = {
                body: user
            };
            const fakeRes = {
                send: sinon.spy()
            };

            const usersController = new UsersController(fakeUserModel, FakeAuthService)
            await usersController.authenticate(fakeReq, fakeRes);

            sinon.assert.calledWith(fakeRes.send, { token: jwtToken });
        });

        it('should return 401 when the user can not be found', async () => {
            const fakeUserModel = {};
            class FakeAuthService {
                authenticate() {
                    return Promise.resolve(false)
                }
            };
            const user = {
                name: 'Jhon Doe',
                email: 'jhondoe@mail.com',
                password: '12345',
                role: 'admin'
            };
            const fakeReq = {
                body: user
            };
            const fakeRes = {
                sendStatus: sinon.spy()
            };
            const usersController = new UsersController(fakeUserModel, FakeAuthService);

            await usersController.authenticate(fakeReq, fakeRes);
            sinon.assert.calledWith(fakeRes.sendStatus, 401);
        });
    });

    context('generateToken', () => {
        it('should generate a JWT from a payload', () => {
            const payload = {
                name: 'Felipe Natan',
                email: 'felipe@gmail.com',
                password: '123'
            }

            const expectedToken = jwt.sign(payload, config.get('auth.key'), { expiresIn: config.get('auth.tokenExpiresIn') });
            const generatedToken = AuthService.generateToken(payload);
            expect(generatedToken).to.eql(expectedToken);
        });
    });
});