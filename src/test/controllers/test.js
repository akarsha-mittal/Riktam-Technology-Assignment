const request = require('supertest');
const apiUrl  = 'http://127.0.0.1:8000';
describe('Create User', () => {
  it('checks validation that password is equal to confirm password or not.', async () => {
    const response = await request(apiUrl)
      .post('/user/add')
      .send({
        first_name :"Akarsha",
        last_name:"Mittal",
        user_type:"user",
        email: 'test@gmail.com',
        password: '1',
        confirm_password:"2",
        test_case : 1
      });
      expect(response.status).toBe(302); // Expecting a redirect status
      expect(response.header.location).toBe('/user/add');
  },60000);
  it('successfully creates new user.', async () => {
    await request(apiUrl)
      .post('/user/add')
      .send({
        first_name :"Admin",
        last_name:"User",
        user_type:"admin",
        email: 'admin@gmail.com',
        password: 'admin@123',
        confirm_password:'admin@123',
        test_case : 1
      }).expect(302);
      const response = await request(apiUrl)
      .post('/user/add')
      .send({
        first_name :"Normal",
        last_name:"User",
        user_type:"user",
        email: 'user@gmail.com',
        password: 'user@123',
        confirm_password:'user@123',
        test_case : 1
      }).expect(302);
  },60000);
});
describe('Update User', () => {
  it('checks validation that password is equal to confirm password or not.', async () => {
    const response = await request(apiUrl)
      .put('/user/edit/65ddf4d694af9fdac540bef6')
      .send({
        first_name :"Akarsha",
        last_name:"Mittal",
        user_type:"user",
        password: '1',
        confirm_password:"2",
        test_case : 1
      });
      expect(response.status).toBe(302); // Expecting a redirect status
      expect(response.header.location).toBe('/user/edit/65ddf4d694af9fdac540bef6');
  },60000);
  it('successfully update existing user.', async () => {
    const response = await request(apiUrl)
      .put('/user/edit/65ddf4d694af9fdac540bef6')
      .send({
        first_name :"Akarsha",
        last_name:"Mittal",
        user_type:"user",
        password: '1',
        confirm_password:'1',
        test_case : 1
      });
      expect(response.status).toBe(302); // Expecting a redirect status
      expect(response.header.location).toBe('/user');
  },60000);
});
const { logout } = require('../../controllers/auth_controller');// Adjust the path as needed
const sinon = require('sinon');

describe('Logout API Test Case', () => {
  it('should successfully logout a user and redirect', () => {
    const req = { session: { destroy: sinon.stub() } };
    const res = { redirect: sinon.spy() };
    logout(req, res);
    expect(req.session.destroy.calledOnce).toBe(true);
  });
});
describe('Login API Test Cases', () => {
  it('should return a valid header location on successful login', async () => {
    const response = await request(apiUrl)
      .post('/signin')
      .send({
        email: 'user@gmail.com',
        password: 'user@123'
      }).expect(302);
    expect(response.header.location).toBe('/user');
  },60000);

  it('should handle invalid credentials', async () => {
    const response = await request(apiUrl)
      .post('/signin')
      .send({
        email: 'test@gmail.com',
        password: '1234567uihgfdsa',
      }).expect(302);
    expect(response.header.location).toBe('/');
  },60000);
});
describe('Create Group', () => {
  it('successfully creates new group.', async () => {
    const user = await request(apiUrl)
    .post('/user/get')
    .send({
      email :"user@gmail.com",
      test_case : 1
    });
    const user_id = await user._body.id;
    const response = await request(apiUrl)
      .post('/group/add')
      .send({
        name :"Test",
        members:[],
        user_id,
        test_case : 1
      }).expect(302);
      expect(response.header.location).toBe('/group');
  },60000);
});
describe('Update Group', () => {
  it('successfully update existing group.', async () => {
    const response = await request(apiUrl)
      .put('/group/edit/65ddf4d694af9fdac540bef6')
      .send({
        name :"Test Group",
        test_case : 1
      }).expect(302);
    expect(response.header.location).toBe('/group');
  },60000);
});
describe('Delete Group', () => {
  it('successfully delete group.', async () => {
    const response = await request(apiUrl)
          .delete('/group/delete/65ddf4d694af9fdac540bef6')
          .send({ test_case : 1 }).expect(302);
    expect(response.header.location).toBe('/group');
  },60000);
});
describe('Add Members in Group', () => {
  it('successfully add members in group.', async () => {
    const response = await request(apiUrl)
        .post('/group/add_members/65ddf4d694af9fdac540bef6')
        .send({ test_case : 1, members: ["65ddf4d694af9fdac540bef8"] }).expect(302);
    expect(response.header.location).toBe('/group/view_members/65ddf4d694af9fdac540bef6');
  },60000);
});
describe('Delete Members From Group', () => {
  it('successfully delete members from group.', async () => {
    const response = await request(apiUrl)
        .delete('/group/delete_member/65ddf4d694af9fdac540bef8/65ddf4d694af9fdac540bef6')
        .send({ test_case : 1 }).expect(302);
    expect(response.header.location).toBe('/group/view_members/65ddf4d694af9fdac540bef6');
  },60000);
});