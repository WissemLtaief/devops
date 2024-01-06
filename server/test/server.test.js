const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Adjust the path to your server file

chai.use(chaiHttp);
chai.should();

describe("Server", () => {
    // Example test for a simple GET route
    describe("GET /", () => {
        it("should get the home page", (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
