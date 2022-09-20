## Rotas de Autenticação

#### POST **/sign-up**
- formato do body da request

```
{
	email: "cleiton@email.com",
	password: "minha-senha",
	confirmPassword: "minha-senha"
}
```

#### POST **/sign-in**
- formato do body

```
{
	email: "cleiton@email.com",
	password: "minha-senha"
}
```

- a API retornará um objeto no seguinte formato:

```
{
	token: "meu-token-de-acesso"
}
```

## Rotas de Tests

#### POST **/tests**

- **PONTO DE ATENÇÃO**: Se é enviado um token que não está no formato *Bearer* a API responderá com status **422**, o mesmo status é mandado quando algo no body da request está errado, então se certifique de ler a mensagem que acompanha o código de erro
- o header deve incluir um token no padrão *Bearer* que é gerado no login
- formato do body da requisição deve ser:

```
{
	name: "um projeto do professor Cleiton",
	pdfUrl: "https://url-pdf.com",
	category: "Projeto",
	discipline: "React",
	teacher: "Cleiton"
}
```

- **category**, **discipline** e **teacher** devem já constar no banco de dados, e além disso o professor informado deve lecionar a disciplina informada.

#### GET **/tests-discipline**
- o header deve incluir um token no padrão *Bearer* que é gerado no login
- a API retornará um array de objetos, os objetos apresentarão o seguinte formato:

```
{
	number: 3,
    Discipline: [
      {
        name: "React",
        categories: [
          {
            name: "Prática",
            tests: [
              {
                name: "prática de react do Diego",
                pdfUrl: "https://cdn.pixabay.com/photo/2022/
	                09/13/13/47/animal-7451969_960_720.jpg",
                teacher: "Diego Pinho"
              },
            ]
          },
        ]
      }
    ]
}
```

- Sendo na ordem de aparição **number** o número do período, **Discipline => name** o nome da disciplina, **categories => name** o nome da categoria e **tests** será o array de objetos que representam os tests, que terão as informações do nome, url do PDF e nome do prefessor referente ao teste;
- Em caso de **não** existirem disciplinas cadastradas para aquele período em específico, a resposta da API será um array de objetos como o acima com o array de **Discipline** vazio, o que também ocorre caso não haja testes registrados para nenhuma categoria, retornarndo um array de **categories** vazio, o mesmo vale caso exista provas cadastradas para um período sim e pra outro não, sendo que o objeto que representa o período com provas cadastradas apresentará o formato acima, e o objeto que representa o período sem provas cadastradas o formato descrito no início desse tópico.

#### GET **/tests-teacher**
- o header deve incluir um token no padrão *Bearer* que é gerado no login
- a API retornará um array de objetos, os objetos apresentarão o seguinte formato:

```
{
    name: "Diego Pinho",
    categories: [
      {
        name: "Prática",
        tests: [
          {
            name: "prática de react do Diego",
            pdfUrl: "https://cdn.pixabay.com/photo/
	            2022/09/13/13/47/animal-7451969_960_720.jpg",
            discipline: "React"
          }
        ]
      },
    ]
}
```

- Sendo na ordem de aparição **name** o nome do professor, **categories => name** o nome da categoria e **tests** será o array de objetos que representam os tests, que terão as informações do nome, url do PDF e o nome da disciplina referente ao teste;
- Em caso de **não** existirem testes cadastrados para aquele professor em específico, a resposta da API será um array de objetos como o acima com o array de **categories** vazio, o mesmo vale caso exista provas cadastradas para um professor sim e pra outro não, sendo que o objeto que representa o professor com provas cadastradas apresentará o formato acima, e o objeto que representa o professor sem provas cadastradas o formato descrito no início desse tópico.
