INSTRUÇÕES PARA INSTALAÇÃO DO PROJETO:

1 - clonar o repositório com o git clone.

2 - Instalar as bibliotecas usadas: npm i

3 - configurar as variáveis de ambiente, deixei um arquivo .env.example para faciliar
obs: o serviço de email do nodemailer precisa configurar o seu email para aceitar envios de terceiros

4 - instalar as imagens docker: docker-compose up -d

5 - criar o banco de dados com o comando: db:create

6 - rodar as migrations com o comando: npm migration:run

7 - rodar as seeds com o comando: npm run seed:run

8 - rodar o projeto com o npm start

Usuário adm:
email: adm@gmail.com
senha: Senai@ABC1
