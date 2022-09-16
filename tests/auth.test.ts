import app from '../src/app';
import supertest from 'supertest';
import userFactory from './factories/userFactory';
import prisma from '../src/databases/postgres';

beforeEach(() => {
  prisma.$executeRaw`TRUNCATE TABLE users;`;
});

describe('testa a rota /sign-up', () => {
  it('testa se o body for vazio deve retornar 422', async () => {
    const body = {};

    const response = await supertest(app).post('/sign-up').send(body);

    expect(response.status).toBe(422);
  });

  it('criar um usuário com sucesso deve retornar 201 e o objeto criado',
    async () => {
      const newUser = await userFactory();

      const response = await supertest(app).post('/sign-up').send(newUser);
      /*
        create a new object (userToCompare) using email and password to
        compare with the db created object
       */
      const userToCompare = { email: newUser.email, password: newUser.password };

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(userToCompare);
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

afterAll(() => {
  prisma.$disconnect();
});