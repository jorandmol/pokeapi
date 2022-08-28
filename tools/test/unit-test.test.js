const assert = require('chai').assert;

function addValue(a, b) {
    return a + b;
}

describe('Suite de prueba para el curso', () => {
    it('should return 2', (done) => {
        let va = addValue(1, 1);
        assert.equal(va, 2);
        done();
    });
});