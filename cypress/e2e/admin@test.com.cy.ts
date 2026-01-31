describe('Desafio Cypress Heroes - Treinee QA', () => {


 // 1. Constantes de Caminhos (Routes)
/**
 * CONFIGURAÇÕES E CONSTANTES
 * Centralizamos tudo aqui para facilitar a manutenção.
 */

// 1. Caminhos (Routes)
const PATHS = {
  HOME: 'http://localhost:3000/',
  HEROES: '/heroes',
  NEW_HERO: '/heroes/new',
};

// 2. Dicionário de Seletores (UI Elements)
const SELECTORS = {
  LOGIN: {
    BTN_ACESSAR: 'li > .undefined', // Botão inicial de acesso
    INPUT_EMAIL: '[data-cy="email"]',
    INPUT_PASSWORD: ':nth-child(2) > .mb-2',
    BTN_SUBMIT: '.modal button',
    ERROR_MSG: '.text-red-500'
  },
  NAV: {
    MENU: 'nav',
    BTN_NEW_HERO: `[href='${PATHS.NEW_HERO}']`,
  },
  HEROES_LIST: {
    CARD: "[data-cy='hero-card']",
    BTN_EDIT: '[data-cy="pencil"]',
    BTN_DELETE: '[data-cy="trash"]'
  },
  FORM: {
    INPUT_NAME: "[name='name']",
    INPUT_PRICE: "[name='price']",
    INPUT_FANS: "[name='fans']",
    INPUT_SAVES: "[name='saves']",
    SELECT_POWER: 'select',
    BTN_SAVE: 'button',
    EDIT_PRICE: '[data-cy="priceInput"]',
    EDIT_FANS: '[data-cy="fansInput"]',
    EDIT_SAVES: '[data-cy="savesInput"]'
  },
  MODAL: {
    CONTAINER: '.modal-content',
    BTN_CONFIRM: '.gap-2 > .text-white' // Botão de confirmação de exclusão
  }
};

// 3. Massa de Dados (Test Data)
const adminUser = { 
  email: 'admin@test.com', 
  password: 'test123' 
};

const testData = {
  heroDelete: 'Mr Angular',
  heroEdit: { 
    name: 'Collect Call Paul', 
    newPrice: '90', 
    fans: '5000', 
    saves: '300' 
  },
  newHero: {
    name: 'Capitã QA',
    price: '12',
    fans: '3000',
    saves: '150',
    powerIndex: 1
  },
  messages: {
    invalidLogin: 'Invalid email or password' // Centralizamos a mensagem aqui
  }
};



/**
 * COMANDOS CUSTOMIZADOS
 */
Cypress.Commands.add('login', (email, password) => {
  cy.get(SELECTORS.LOGIN.BTN_ACESSAR).click(); 
  cy.get(SELECTORS.LOGIN.INPUT_EMAIL).type(email);
  cy.get(SELECTORS.LOGIN.INPUT_PASSWORD).type(password);
  cy.get(SELECTORS.LOGIN.BTN_SUBMIT).click(); 
});

/**
 * SUÍTE DE TESTES
 */
describe('Desafio Cypress Heroes - Automação Profissional', () => {

  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.visit(PATHS.HOME);
  });

  describe('🔐 Módulo de Autenticação', () => {
    
    // ... (teste de login válido)

    it('2️⃣ Login com credenciais inválidas', () => {
      cy.login('errado@teste.com', 'senha123');
      
      // ALTERAÇÃO AQUI: Procuramos o texto específico na tela
      // O Cypress vai esperar até que a mensagem apareça (respeitando o timeout)
      cy.contains(testData.messages.invalidLogin).should('be.visible');

      // Opcional: Validar que a URL continua sendo a de login/home
    });
  });
  describe('🦸 Módulo de Gestão de Heróis (ADM)', () => {
    
    // Logar automaticamente antes de cada operação de herói
    beforeEach(() => {
      cy.login(adminUser.email, adminUser.password);
    });

    it('3️⃣ Validar listagem inicial de heróis', () => {
      cy.get(SELECTORS.HEROES_LIST.CARD).should('have.length.at.least', 1);
    });

    it('4️⃣ Criar um novo herói com sucesso', () => {
      cy.get(SELECTORS.NAV.BTN_NEW_HERO).click();
      
      // Preenchimento usando as constantes de massa de dados
      cy.get(SELECTORS.FORM.INPUT_NAME).type(testData.newHero.name);
      cy.get(SELECTORS.FORM.INPUT_PRICE).type(testData.newHero.price);
      cy.get(SELECTORS.FORM.INPUT_FANS).type(testData.newHero.fans);
      cy.get(SELECTORS.FORM.INPUT_SAVES).type(testData.newHero.saves);
      
      cy.get(SELECTORS.FORM.SELECT_POWER).select(testData.newHero.powerIndex);
      cy.get(SELECTORS.FORM.SELECT_POWER).should('not.have.value', ''); 
      
      // Clique no botão de salvar (terceiro botão do form)
      cy.get(SELECTORS.FORM.BTN_SAVE).eq(2).click(); 
      
      // Validação final
      cy.contains(testData.newHero.name).should('be.visible');
    });

    it('5️⃣ Editar atributos de um herói', () => {
      cy.contains(testData.heroEdit.name)
        .closest('div')
        .find(SELECTORS.HEROES_LIST.BTN_EDIT)
        .click();

      cy.get(SELECTORS.FORM.EDIT_PRICE).clear().type(testData.heroEdit.newPrice);
      cy.get(SELECTORS.FORM.EDIT_FANS).clear().type(testData.heroEdit.fans);
      cy.get(SELECTORS.FORM.EDIT_SAVES).clear().type(testData.heroEdit.saves);
      
      cy.get(SELECTORS.FORM.BTN_SAVE).eq(3).click();
      cy.contains('Capitã QA', { matchCase: false }).should('be.visible');
    });
    it('6️⃣ Excluir herói e validar remoção', () => {
      cy.contains(testData.heroDelete)
        .closest('div')
        .find(SELECTORS.HEROES_LIST.BTN_DELETE)
        .click();

      // Interação segura com o Modal (sem usar force:true)
      cy.get(SELECTORS.MODAL.CONTAINER).should('be.visible');
      cy.get(SELECTORS.MODAL.BTN_CONFIRM).click();
      
      cy.contains(testData.heroDelete).should('not.exist');
    });
  });
});
});
 