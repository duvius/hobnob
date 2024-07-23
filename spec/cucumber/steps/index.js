import { When, Then } from '@cucumber/cucumber';
import superagent from 'superagent';
import assert from 'assert';

When(/^the client creates a POST request to \/users$/, function () {
  this.request = superagent('POST', `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users
`);
});

When(/^attaches a generic empty payload$/, function () {
  return undefined;
});

When(/^attaches a generic non-JSON payload$/, function () {
  this.request.send('<?xml version="1.0" encoding="UTF-8" ?><email>mrsnobot@gmail.com</email>');
  this.request.set('Content-Type', 'text/xml');
});

When(/^attaches a generic malformed payload$/, function () {
  this.request.send('{"email": "mrsnobot@gmail.com", name: }');
  this.request.set('Content-Type', 'application/json');
});

When(/^sends the request$/, function (callback) {
  this.request
    .then((response) => {
      this.response = response.res;
      callback();
    })
    .catch((errResponse) => {
      this.response = errResponse.response;
      callback();
    });
});

Then(/^our API should respond with a 400 HTTP status code$/, function () {
  assert.equal(this.response.status, 400);
});

Then(/^our API should respond with a 415 HTTP status code$/, function () {
  assert.equal(this.response.statusCode, 415);
});

Then(/^the payload of the response should be a JSON object$/, function () {
  // Check Content-Type header
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of Content-Type application/json');
  }
  // Check if it is a valid JSON
  try {
    this.response = JSON.parse(this.response.text);
  } catch (e) {
    throw new Error('Response not a valid JSON object');
  }
});

Then(/^contains a message property which says "Payload should not be empty"$/, function () {
  assert.equal(this.response.message, 'Payload should not be empty');
});

Then(/^contains a message property which says 'The "Content-Type" header must always be "application\/json"'$/, function () {
  assert.equal(this.response.message, 'The "Content-Type" header must always be "application/json"');
});

Then(/^contains a message property which says "Payload should be in JSON format"$/, function () {
  assert.equal(this.response.message, 'Payload should be in JSON format');
});
