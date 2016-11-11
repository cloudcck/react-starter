import expect from 'expect';
import { hello } from './hello'
describe('hello ', () => {
  it('should return `hello world`', () => {
    expect(hello('world')).toEqual('hello world');
  });
});
