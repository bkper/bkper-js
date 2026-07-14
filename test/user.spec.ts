import {expect} from 'chai';
import {User} from '../src/model/User.js';

describe('User', () => {
  describe('#getPlanCycle()', () => {
    it('returns the billing cycle from the user payload', () => {
      const user = new User({planCycle: 'YEARLY'});

      expect(user.getPlanCycle()).to.equal('YEARLY');
    });
  });
});
