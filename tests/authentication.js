//    Dependencies
var request = require('supertest');
var should = require('should');

//    Setup
request = request('http://localhost:5100');


//=========================
//    Authentication Tests
//=========================

describe('Authentication middleware', function() {
    describe('GET all of a resource', function() {
        it('should return a 403 error without authentication headers', function(done) {
            request.get('/api/v1/accounts')
                .expect(403)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });
});
