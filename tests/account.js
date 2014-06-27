//    Dependencies
var request = require('supertest');

//    Constants
var userHeaders = {
    'X-Authentication-Email': 'valid@test.com',
    'X-Authentication-Token': 'b17ded7d1b0427ed04f5399b1d93e74e'
};
var adminHeaders = {
    'X-Authentication-Email': 'admin@test.com',
    'X-Authentication-Token': 'fbaf1bc20dfe9a747b5da7daafd1b0c6'
};

//    Setup
request = request('http://localhost:5100');


//==================
//    Account tests
//==================

describe('Account', function() {
    describe('GET all', function() {
        it('should get a 403 error when unauthenticated', function(done) {
            request.get('/api/v1/accounts')
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get a 403 error when authenticated as a non-admin user', function(done) {
            request.get('/api/v1/accounts')
                   .set(userHeaders)
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 200 success when authenticated as an admin user', function(done) {
            request.get('/api/v1/accounts')
                   .set(adminHeaders)
                   .expect(200)
                   .expect(function(res) {
                       if (res.body.length !== 3) throw new Error('Missing/wrong data');
                   })
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });
    });
});
