import { faker } from '@faker-js/faker';

async function userFactory()
: Promise<{
  email: string,
  password: string,
  confirmPassword: string}> 
{
  const password: string = faker.internet.password();

  return {
    email: faker.internet.email(),
    password: password,
    confirmPassword: password
  };
}

export default userFactory;