import supertest from "supertest";
import app from "../src/app";
import { teacherDisciplineWrongFactory, testFactory } from "./factories/testFactory";
import userFactory from "./factories/userFactory";

describe('testa o POST da rota /tests', () => {

  it('deve retornar 422 quando o token não é enviado', async () => {
    const registerUser = await userFactory();
    const loginUser = {
      email: registerUser.email,
      password: registerUser.password
    };
    const test = await testFactory();

    const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    const createTestResponse = await supertest(app).post('/tests').send(test);

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);

    expect(createTestResponse.status).toBe(422);
  });

  it('deve retornar 401 quando o token passado for inválido', async () => {
    const registerUser = await userFactory();
    const loginUser = {
      email: registerUser.email,
      password: registerUser.password
    };
    const test = await testFactory();

    const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    const createTestResponse = await supertest(app).post('/tests').set('Authorization', `Bearer ${'a wrong token'}`).send(test);

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);

    expect(createTestResponse.status).toBe(401);
  });

  it('deve retornar 422 quando enviado um body vazio', async () => {
    const registerUser = await userFactory();
    const loginUser = {
      email: registerUser.email,
      password: registerUser.password
    };
    const test = {};

    const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    const testRegisterResponse = await supertest(app).post('/tests').set('Authorization', `Bearer ${loginResponse.body.token}`).send(test);

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);
    expect(testRegisterResponse.status).toBe(422);
  });

  it('deve retornar 404 quando a categoria passada não está no banco de dados',
    async () => {
      const registerUser = await userFactory();
      const loginUser = {
        email: registerUser.email,
        password: registerUser.password
      };
      const test = await testFactory();
      const testWrongCategory = { ...test, category: 'a wrong category'};

      const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
      const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

      const createTestResponse = await supertest(app).post('/tests').set('Authorization', `Bearer ${loginResponse.body.token}`).send(testWrongCategory);
      
      expect(registerResponse.status).toBe(201);
      expect(loginResponse.status).toBe(200);

      expect(createTestResponse.status).toBe(404);
    }
  );

  it('deve retornar 404 quando a disciplina passada não está no banco de dados',
    async () => {
      const registerUser = await userFactory();
      const loginUser = {
        email: registerUser.email,
        password: registerUser.password
      };

      const test = await testFactory();
      const testWrongDiscipline = { ...test, discipline: 'a wrong discipline' };

      const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
      const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

      const createTestResponse = await supertest(app).post('/tests').set('Authorization', `Bearer ${loginResponse.body.token}`).send(testWrongDiscipline);

      expect(registerResponse.status).toBe(201);
      expect(loginResponse.status).toBe(200);

      expect(createTestResponse.status).toBe(404);
    }
  );

  it('deve retornar 404 quando o professor passado não está no banco de dados',
    async () => {
      const registeruser = await userFactory();
      const loginUser = {
        email: registeruser.email,
        password: registeruser.password
      };

      const test = await testFactory();
      const testWrongTeacher = { ...test, teacher: 'a wrong teacher' };

      const registerResponse = await supertest(app).post('/sign-up').send(registeruser);
      const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

      const createTestResponse = await supertest(app).post('/tests').set('Authorization', `Bearer ${loginResponse.body.token}`).send(testWrongTeacher);

      expect(registerResponse.status).toBe(201);
      expect(loginResponse.status).toBe(200);

      expect(createTestResponse.status).toBe(404);
    }
  );

  it('deve retornar 404 quando a disciplina não está relacionada ao professor',
    async () => {
      const registerUser = await userFactory();
      const loginUser = {
        email: registerUser.email,
        password: registerUser.password
      };

      const { teacher: notRelatedTeacher, discipline: notRelatedDiscipline } = await teacherDisciplineWrongFactory();

      const test = await testFactory();
      const testNotRelated = {
        ...test,
        teacher: notRelatedTeacher,
        discipline: notRelatedDiscipline
      };

      const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
      const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

      const createTestResponse = await supertest(app).post('/tests').set('Authorization', `Bearer ${loginResponse.body.token}`).send(testNotRelated);

      expect(registerResponse.status).toBe(201);
      expect(loginResponse.status).toBe(200);

      expect(createTestResponse.status).toBe(404);
    }
  );

  it('deve retornar 201 e a prova criada', async () => {
    const registerUser = await userFactory();
    const loginUser = {
      email: registerUser.email,
      password: registerUser.password
    };

    const test = await testFactory();

    const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    const createTestResponse = await supertest(app).post('/tests').set('Authorization', `Bearer ${ loginResponse.body.token }`).send(test);

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);

    expect(createTestResponse.status).toBe(201);
    expect(createTestResponse.body).not.toBeNull();
  });
});

describe('testa o GET da rota /tests-discipline', () => {
  it('deve retornar 401 quando o token passado for inválido', async () => {
    const registerUser = await userFactory();
    const loginUser = {
      email: registerUser.email,
      password: registerUser.password
    };

    const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    const testesDisciplineResponse = await supertest(app).get('/tests-discipline').set('Authorization', 'Bearer a-wrong-token');

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);
    expect(testesDisciplineResponse.status).toBe(401);
  });

  it('deve retornar 200 e um objeto com pelo menos um array de categorias',
    async () => {
      const registerUser = await userFactory();
      const loginUser = {
        email: registerUser.email,
        password: registerUser.password
      };

      const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
      const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

      const testesDisciplineResponse = await supertest(app).get('/tests-discipline').set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(registerResponse.status).toBe(201);
      expect(loginResponse.status).toBe(200);

      expect(testesDisciplineResponse.status).toBe(200);
      expect(testesDisciplineResponse.body[0].Discipline[0].categories).toBeInstanceOf(Array);
    }
  );
});

describe('testa o GET da rota /tests-teacher', () => {
  it('deve retornar 401 quando o token enviado é inválido', async () => {
    const registerUser = await userFactory();
    const loginUser = {
      email: registerUser.email,
      password: registerUser.password
    };

    const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    const testsTeacher = await supertest(app).get('/tests-teacher').set('Authorization', 'Bearer a-wrong-token');

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);

    expect(testsTeacher.status).toBe(401);
  });

  it('deve retornar 200 e uma lista com objetos no formato certo', async () => {
    const registerUser = await userFactory();
    const loginUser = {
      email: registerUser.email,
      password: registerUser.password
    };

    const registerResponse = await supertest(app).post('/sign-up').send(registerUser);
    const loginResponse = await supertest(app).post('/sign-in').send(loginUser);

    const testsTeacher = await supertest(app).get('/tests-teacher').set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(registerResponse.status).toBe(201);
    expect(loginResponse.status).toBe(200);

    expect(testsTeacher.status).toBe(200);
    expect(testsTeacher.body[0].categories).toBeInstanceOf(Array);
  });
});