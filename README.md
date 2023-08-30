# st-wiki

ST Wiki é um aplicativo voltado para atender às necessidades dos profissionais de Segurança do trabalho. O aplicativo tem intenção de auxiliar, principalmente, as pessoas que entraram no mercado de trabalho e precisam encontrar informações sobre lojas e normas regulamentadoras.

O aplicativo foi desenvolvido utilizando framework ionic com angular, com os dados sendo armazenados utilizando o serviço firebase.


## Funcionalidades do aplicativo

### Cadastro de usuário
Os clientes podem fazer cadastro simples no aplicativo.

### Cadastro de lojas
Os vendedores podem fazer o cadastro de suas lojas. Elas aparecerão na listagem aleatoriamente para os usuários. 

### Listagem de lojas
As lojas aparecem em ordem aleatória para os usuários em suas consultas.

### Mapeamento de lojas por meio do Google Maps
Os usuários podem procurar lojas nos bairros de sua preferência.

### Fornecimento de contato e endereço das lojas
Os clientes, ao acessar o perfil da loja, conseguem ver todas as informações sobre ela.


## Instrução de uso.

Faça um fork do projeto ou o obtenha com git. 

Antes de iniciar o projeto você precisará seguir alguns passos:

Gere uma key de acesso a api do google maps. Pode ser obtida pelo site oficial: https://developers.google.com/maps/apis-by-platform?hl=pt-br.

Crie um novo projeto no firebase: https://firebase.google.com/?hl=pt. Em visão geral do projeto, selecione configurações do projeto, role a página para baixo e obtenha as credenciais da constante 'firebaseConfig'.

Acesse o caminho do projeto src/environments. Escolha entre environments.ts para desenvolvimento ou environments.prod.ts para produção. Cole os dados onde solicitar.

Certifique-se de ter o nodejs instalado em uma versão recente. Abra o diretório do projeto com o terminal do node e instale o angular cli e o ionic cli na pasta.

Instale as dependências com o comando npm install e execute o projeto com o comando ionic server.







