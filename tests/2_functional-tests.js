const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('tests for route api/issues/{project}', function(){

    const check = {issue_title: "test", issue_text:"testing", created_by:"Muneeb", assigned_to:"someone", open:true, status_text:"looks good!"}
    
    test("Create an issue with every field:", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/issues/{project}")
            .send(check)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, check.issue_title);
              assert.equal(res.body.issue_text, check.issue_text);
              assert.equal(res.body.created_by, check.created_by);
              assert.equal(res.body.assigned_to, check.assigned_to);
              assert.equal(res.body.open, check.open);
              assert.equal(res.body.status_text, check.status_text);
              done();
            });
        });
    test("Create an issue with only required fields", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/issues/{project}")
            .send(check)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, check.issue_title);
              assert.equal(res.body.issue_text, check.issue_text);
              assert.equal(res.body.created_by, check.created_by);
              done();
            });
        });
    test("Create an issue with missing required fields:", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/issues/{project}")
            .send(issue_title = "test")
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"required field(s) missing"}');
              done();
            });
        });
    test("View issues on a project", function (done) {
          chai
            .request(server)
            .keepOpen()
            .get("/api/issues/test")
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.typeOf(res.body, 'array');
              done();
            });
        });
    test("View issues on a project with one filter", function (done) {
          chai
            .request(server)
            .keepOpen()
            .get("/api/issues/test?open=true")
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.typeOf(res.body, 'array');
              done();
            });
        });
    test("View issues on a project with multiple filters", function (done) {
          chai
            .request(server)
            .keepOpen()
            .get("/api/issues/test?open=true?issue_text=testing")
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.typeOf(res.body, 'array');
              done();
            });
        });
    test("Update one field on an issue", function (done) {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/{project}")
            .send({_id: "64cd13783a9e5567c847edd5", issue_text: "update test"})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"result":"successfully updated","_id":"64cd13783a9e5567c847edd5"}');
              done();
            });
        });
    test("Update multiple fields on an issue", function (done) {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/{project}")
            .send({_id: "64cd13783a9e5567c847edd3", issue_text: "update test", status_text:"resolved"})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"result":"successfully updated","_id":"64cd13783a9e5567c847edd3"}');
              done();
            });
        });
    test("Update an issue with missing id", function (done) {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/{project}")
            .send({issue_text: "update test", status_text:"resolved"})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"missing _id"}');
              done();
            });
        });
    test("Update an issue with no fields to update", function (done) {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/{project}")
            .send({_id: "64cd12a8fec7c71ac025f31e"})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"no update field(s) sent","_id":"64cd12a8fec7c71ac025f31e"}');
              done();
            });
        });
    test("Update an issue with invalid id", function (done) {
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/{project}")
            .send({_id: "64cd12a8fec7c1ac025f31e"})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"no update field(s) sent","_id":"64cd12a8fec7c1ac025f31e"}');
              done();
            });
        });
    test("Delete an issue", function (done) {
          chai
            .request(server)
            .keepOpen()
            .delete("/api/issues/{project}")
            .send({_id: "64cd13783a9e5567c847edd9"})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"result":"successfully deleted","_id":"64cd13783a9e5567c847edd9"}');
              done();
            });
        });
    test("Delete an issue with invalid ID", function (done) {
          chai
            .request(server)
            .keepOpen()
            .delete("/api/issues/{project}")
            .send({_id: "12cd12a8fec7c71ac025f31e"})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"could not delete","_id":"12cd12a8fec7c71ac025f31e"}');
              done();
            });
        });
    test("Delete an issue with missing ID", function (done) {
          chai
            .request(server)
            .keepOpen()
            .delete("/api/issues/{project}")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"missing _id"}');
              done();
            });
        });
    });
});
