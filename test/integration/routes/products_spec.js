import Product from "../../../src/models/products";
import AuthService from '../../../src/services/auth';

describe('Routes: Products', () => {
   
    const defaultId = '56cb91bdc3464f14678934ca';

    const defaultProduct = {
        name: 'Default product',
        description: 'product description',
        price: 100
    }

    const expectedProduct = {
        __v: 0,
        _id: defaultId,
        name: 'Default product',
        description: 'product description',
        price: 100
    };

    const expectedUser = {
        _id: defaultId,
        name: 'Felipe Natan',
        email: 'felipe@gmail.com',
        password: '123',
        role: 'admin'
    }

    const authToken = AuthService.generateToken(expectedUser);

    beforeEach(async () => {
        await Product.deleteMany();

        const product = new Product(defaultProduct);
        product._id = '56cb91bdc3464f14678934ca';
        return await product.save();

    });

    afterEach(async () => await Product.deleteMany());

    describe('GET /products', () => {
        it('should return a list of products', done => {
            request
                .get('/products')
                .set({'x-access-token': authToken})
                .end((err, res) => {
                    expect(res.body).to.eql([expectedProduct]);
                    done(err);
                })
        });

        context('When an ID is specified', done => {
            it('should return 200 with one product', done => {
                request.get(`/products/${defaultId}`)
                .set({'x-access-token': authToken})
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body).to.eql([expectedProduct]);
                        done(err);
                    })
            })
        });
    })

    describe('POST /products', () => {
        context('when posting a product', () => {
            it('should return a new product and status code 201', done => {
                const customId = '56cb91bdc3464f14678934ba';
                const newProduct = Object.assign({}, { _id: customId, __v: 0 }, defaultProduct);

                const expectedSavedProduct = {
                    __v: 0,
                    _id: customId,
                    name: 'Default product',
                    description: 'product description',
                    price: 100
                };

                request
                    .post('/products')
                    .set({'x-access-token': authToken})
                    .send(newProduct)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(201);
                        expect(res.body).to.eql(expectedSavedProduct);
                        done(err);
                    })
            });
        })
    })

    describe('PUT /products', () => {
        context('when editing a product', () => {
            it('should update the product and return 200 as status code', done => {
                const customProduct = {
                    name: 'Custom name'
                }

                const updateProduct = Object.assign({}, customProduct, defaultProduct);

                request
                    .put(`/products/${defaultId}`)
                    .set({'x-access-token': authToken})
                    .send(updateProduct)
                    .end((err, res) => {
                        expect(res.status).to.eql(200);
                        done(err);
                    });
            });
        });
    });

    describe('DELETE /products/:id', () => {
        context('when deleting a product', () => {
            it('should delete a product and return 204 as status code', done => {
                request
                    .delete(`/products/${defaultId}`)
                    .set({'x-access-token': authToken})
                    .end((err, res) => {
                        expect(res.status).to.eql(204);
                        done(err);
                    });
            });
        });
    });
});