import { faker } from '@faker-js/faker';

export default async function userFactory() {
  const password: string = faker.internet.password();

  return {
    email: faker.internet.email(),
    password: password,
    confirmPassword: password
  };
}