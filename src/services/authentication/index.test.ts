import {expect} from 'chai';
import {AuthenticationService} from './';
  
describe('AuthenticationService', () => {
  let _mockServerService;//: ServerService;
  let _mockCreds;
  let _mockResponse;

  beforeEach(() => {
    _mockCreds = { username:'alice', password:'x'};
    _mockResponse = {
      "data": {},
      "isAuthenticated": true,
      "meta": {
        "token": "abc123",
        "expires": "2100-01-01T01:01:0.0Z"
      },
    };
    _mockServerService = {
      post: (path, data) => {
        return Promise.resolve({ data: _mockResponse });
      }
    };
  });

  it('should load', () => {
    
    expect(_mockServerService).to.not.be.undefined;
    let authService = new AuthenticationService(_mockServerService);
    //let _mockCreds = { username:'alice', password:'x'};

    expect(authService.login(_mockCreds)).to.not.be.undefined;
  });

  it('should receive successful response', (done) => {
    
    expect(_mockServerService).to.not.be.undefined;
    let authService = new AuthenticationService(_mockServerService);
    
    return authService.login(_mockCreds)
      .then(data => {
        console.log('data');
        console.log(data);
        // Assertions thrown here will result to a failed promise downstream.
        expect(data).to.deep.equal(_mockResponse);
        done();
      })
      // Remember to call done(), otherwise the test will time out (and fail).
      .then(null, error => {
        done(error);
      });
  });

  it('should encounter an error', (done) => {
    
    _mockResponse = {
      status: 401,
      statusText: 'unauthorized',
    };
    _mockServerService = {
      post: (path, data) => { 
        return Promise.reject({ data: _mockResponse })
      }
    };

    expect(_mockServerService).to.not.be.undefined;
    let authService = new AuthenticationService(_mockServerService);
    
    return authService.login(_mockCreds)
      .then(data => {
        done({error:"login should fail, but it seems to have succeeded."});
      })
      // Remember to call done(), otherwise the test will time out (and fail).
      .then(null, error => {
        done();
      });
  });
});