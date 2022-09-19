import app from '../src/app';
import supertest from 'supertest';
import userFactory from './factories/userFactory';

describe('testa a rota /sign-up', () => {
  it('testa se o body for vazio deve retornar 422', async () => {
    const body = {};

    const response = await supertest(app).post('/sign-up').send(body);

    expect(response.status).toBe(422);
  });

  it('criar um usuário com sucesso deve retornar 201',
    async () => {
      const newUser = await userFactory();

      const response = await supertest(app).post('/sign-up').send(newUser);

      expect(response.status).toBe(201);
    }
  );

  it('deve retornar 409 quando é passado um email já cadastrado no banco de dados', 
    async () => {
      const newUser = await userFactory();

      const registerResponse = await supertest(app).post('/sign-up').send(newUser);
      const repeatedEmailResponse = await supertest(app).post('/sign-up').send(newUser);

      expect(registerResponse.status).toBe(201);
      expect(repeatedEmailResponse.status).toBe(409);
    }
  );
});

describe('testa a rota /sign-in', () => {
  it('deve retornar 422 quando o corpo não está no formato certo', async () => {
    const newUser = await userFactory();
    const loginUser = {};

    const registerResponse = await supertest(app).post('/sign-up').send(newUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(422);
  });

  it('deve retornar status 401 quando email não corresponderem ao do banco de dados', 
    async () => {
      const newUser = await userFactory();

      const notRegisteredEmailLogin = {
        email: "notregistered@email.com",
        password: "pasword"
      };

      const registerResponse = await supertest(app).post('/sign-up').send(newUser);
      const loginEmailResponse = await supertest(app).post('/sign-in').send(notRegisteredEmailLogin);

      expect(registerResponse.status).toBe(201);
      expect(loginEmailResponse.status).toBe(401);
    }
  );

  it('deve retornar 401 quando a senha passada não corresponde a do banco de dados',
    async () => {
      const newUser = await userFactory();

      const wrongPasswordLogin = {
        email: newUser.email,
        password: 'a wrong password'
      };

      const registerResponse = await supertest(app).post('/sign-up').send(newUser);
      const loginPasswordResponse = await supertest(app).post('/sign-in').send(wrongPasswordLogin);

      expect(registerResponse.status).toBe(201);
      expect(loginPasswordResponse.status).toBe(401);
    }
  );

  it('deve retornar status 200 e um token de autenticação', async () => {
    const newUser = await userFactory();
    const userLogin = {
      email: newUser.email,
      password: newUser.password
    };

    const registerResponse = await supertest(app).post('/sign-up').send(newUser);
    const loginResponse = await supertest(app).post('/sign-in').send(userLogin);

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).not.toBeUndefined(); 
  });
});