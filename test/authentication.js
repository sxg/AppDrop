//    Dependencies
var request = require('supertest');

//    Setup
request = request('http://localhost:5100');


//=========================
//    Authentication Tests
//=========================

describe('Authentication middleware', function() {
    it('should return a 403 error for missing authentication headers', function(done) {
        request.get('/api/v1/accounts/32')
               .expect(403)
               .end(function(err, res) {
                   if (err) throw err;
                   done();
               });
    });

    it('should return a 401 error for incorrect authentication headers', function(done) {
        request.get('/api/v1/accounts/32')
               .set('X-Authentication-Email', '123@abc.com')
               .set('X-Authentication-Token', 'p4ssword')
               .expect(401)
               .end(function(err, res) {
                   if (err) throw err;
                   done();
               });
    });

    it('should return 200 success for correct authentication headers', function(done) {
        request.get('/api/v1/accounts/32')
               .set('X-Authentication-Email', 'valid@test.com')
               .set('X-Authentication-Token', 'b17ded7d1b0427ed04f5399b1d93e74e')
               .expect(200)
               .end(function(err, res) {
                   if (err) throw err;
                   done(err);
               });
    });
});


//================
//    Login Tests
//================

describe('Login', function() {
    it('should return a 401 error for incorrect email and password', function(done) {
        request.post('/login')
               .send({
                   email: '123@abc.com',
                   password: 'idkman'
               })
               .expect(401)
               .end(function(err, res) {
                   if (err) throw err;
                   done(err);
               });
    });

    it('should return 200 success for correct email and password', function(done) {
        request.post('/login')
               .send({
                   email: 'valid@test.com',
                   password: 'p4ssword'
               })
               .expect(200)
               .expect(function(res) {
                   if (res.body.token !== 'b17ded7d1b0427ed04f5399b1d93e74e') {
                       throw new Error('Missing/wrong token');
                   } else if (res.body.token_expires_at !== '2024-06-27T18:24:06.120Z') {
                       throw new Error('Missing/wrong token expiration date');
                   }
               })
               .end(function(err, res) {
                   if (err) throw err;
                   done(err);
               });
    });
});
