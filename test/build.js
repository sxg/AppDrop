//    Dependencies
var request = require('supertest');
var db = require('../config/db');

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


//================
//    Build Tests
//================

var body = {
    build_number: '3AC',
    version: '1.0.3',
    bundle_id: 'io.Satyam.Overlayer'
};
var buildID;

describe('Build', function() {
    describe('Get all', function() {
        it('should get a 403 error when unauthenticated', function(done) {
            request.get('/api/v1/builds')
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get a 403 error when authenticated as a non-admin user', function(done) {
            request.get('/api/v1/builds')
                   .set(userHeaders)
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 200 success when authenticated as an admin user', function(done) {
            request.get('/api/v1/builds')
                   .set(adminHeaders)
                   .expect(200)
                   .expect(function(res) {
                       if (res.body.length !== 2) throw new Error('Missing/wrong data');
                   })
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });
    });

    describe('Get one', function() {
        it('should get a 403 error when unauthenticated', function(done) {
            request.get('/api/v1/builds/53')
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get a 404 error when accessing an unowned build', function(done) {
            request.get('/api/v1/builds/52')
                   .set(userHeaders)
                   .expect(404)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 200 success when accessing your own build', function(done) {
            request.get('/api/v1/builds/53')
                   .set(userHeaders)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 200 success when accessing a build as admin', function(done) {
            request.get('/api/v1/builds/53')
                   .set(adminHeaders)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });
    });

    describe('Create one', function() {

        afterEach(function(done) {
            if (buildID) {
                request.delete('/api/v1/builds/' + buildID)
                       .set(adminHeaders)
                       .expect(200)
                       .end(function(err, res) {
                           if (err) throw err;
                           done(err);
                       });
            } else {
                done();
            }
        });

        it('should get a 403 error when unauthenticated', function(done) {
            request.post('/api/v1/builds')
                   .send(body)
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 200 success when authenticated with proper body', function(done) {
            request.post('/api/v1/builds')
                   .set(userHeaders)
                   .send(body)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       buildID = res.body.build_id;
                       done(err);
                   });
        });

        it('should get a 409 error when creating a build with an existing build number', function(done) {
            request.post('/api/v1/builds')
                   .set(userHeaders)
                   .send(body)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       buildID = res.body.build_id;
                       request.post('/api/v1/builds')
                              .set(userHeaders)
                              .send(body)
                              .expect(409)
                              .end(function(err, res) {
                                  if (err) throw err;
                                  done(err);
                              });
                   });
        });
    });

    describe('Update one', function() {
        beforeEach(function(done) {
            request.post('/api/v1/builds')
                   .set(userHeaders)
                   .send(body)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       buildID = res.body.build_id;
                       done();
                   });
        });

        afterEach(function(done) {
            request.delete('/api/v1/builds/' + buildID)
                   .set(adminHeaders)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 403 error if unauthenticated', function(done) {
            request.put('/api/v1/builds/' + buildID)
                   .send({download_count: 1})
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get a 404 error if you do not own the build', function(done) {
            request.put('/api/v1/builds/' + buildID)
                   .set(userHeaders)
                   .send({download_count: 1})
                   .expect(404)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get a 403 error if you try to update an invalid field', function(done) {
            request.put('/api/v1/builds/' + buildID)
                   .set(adminHeaders)
                   .send({build_id: 5})
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 200 success and change a field if you are an admin', function(done) {
            request.put('/api/v1/builds/' + buildID)
                   .set(adminHeaders)
                   .send({download_count: 1})
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       request.get('/api/v1/builds/' + buildID)
                              .set(adminHeaders)
                              .expect(200)
                              .expect(function(res) {
                                  if (res.body.download_count !== 1) {
                                      throw new Error('Failed to update data');
                                  }
                              })
                              .end(function(err, res) {
                                  if (err) throw err;
                                  done(err);
                              });
                   });
        });
    });

    describe('Delete one', function() {
        beforeEach(function(done) {
            request.post('/api/v1/builds')
                   .set(userHeaders)
                   .send(body)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       buildID = res.body.build_id;
                       done();
                   });
        });

        afterEach(function(done) {
            if (buildID) {
                request.delete('/api/v1/builds/' + buildID)
                       .set(adminHeaders)
                       .expect(200)
                       .end(function(err, res) {
                           if (err) throw err;
                           done(err);
                       });
            } else {
                done();
            }
        });

        it('should get a 403 error if unauthenticated', function(done) {
            request.delete('/api/v1/builds/' + buildID)
                   .expect(403)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get a 404 error if you do not own the build', function(done) {
            request.delete('/api/v1/builds/' + buildID)
                   .set(userHeaders)
                   .expect(404)
                   .end(function(err, res) {
                       if (err) throw err;
                       done(err);
                   });
        });

        it('should get 200 success if you are an admin user', function(done) {
            request.delete('/api/v1/builds/' + buildID)
                   .set(adminHeaders)
                   .expect(200)
                   .end(function(err, res) {
                       if (err) throw err;
                       buildID = null;
                       done(err);
                   });
        });
    });
});
