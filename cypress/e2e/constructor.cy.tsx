describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Перехватываем API запросы и подставляем моковые данные
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'Unauthorized' }
    }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Посещаем главную страницу
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // Ждем, чтобы убедиться что все элементы загрузились
    cy.wait(2000);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('должен добавлять ингредиенты в конструктор', () => {
    // Ждем, пока элементы станут видимыми и прокручиваем к ним
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]')
      .scrollIntoView()
      .should('be.visible');

    // Добавляем булку
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]')
      .find('button')
      .click({ force: true });

    // Проверяем, что булка добавилась в конструктор
    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Добавляем основной ингредиент
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .scrollIntoView()
      .should('be.visible');
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click({ force: true });

    // Проверяем, что основной ингредиент добавился
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    // Добавляем соус
    cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]')
      .scrollIntoView()
      .should('be.visible');
    cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]')
      .find('button')
      .click({ force: true });

    // Проверяем, что соус добавился
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Соус Spicy-X'
    );

    // Проверяем, что цена обновилась
    cy.get('[data-cy="constructor-price"]').should('contain', '3024');
  });

  it('должен открывать модальное окно ингредиента', () => {
    // Кликаем на ингредиент (по Link области)
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .find('a')
      .click({ force: true });

    // Проверяем, что модальное окно открылось
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    // Проверяем детали ингредиента
    cy.get('[data-cy="ingredient-calories"]').should('contain', '4242');
    cy.get('[data-cy="ingredient-proteins"]').should('contain', '420');
    cy.get('[data-cy="ingredient-fat"]').should('contain', '142');
    cy.get('[data-cy="ingredient-carbohydrates"]').should('contain', '242');
  });

  it('должен закрывать модальное окно по клику на крестик', () => {
    // Открываем модальное окно
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .find('a')
      .click({ force: true });
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрываем по клику на кнопку
    cy.get('[data-cy="modal-close"]').find('svg').click({ force: true });

    // Проверяем, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('должен закрывать модальное окно по клику на оверлей', () => {
    // Открываем модальное окно
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .find('a')
      .click({ force: true });
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрываем по клику на оверлей
    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    // Проверяем, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('должен создавать заказ', () => {
    // Перехватываем запрос пользователя как успешный для этого теста
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUserSuccess'
    );

    // Устанавливаем токены авторизации
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
      win.localStorage.setItem('accessToken', 'test-access-token');
    });
    cy.setCookie('accessToken', 'test-access-token');

    // Обновляем страницу для применения авторизации
    cy.reload();
    cy.wait('@getIngredients');
    cy.wait(2000);

    // Добавляем булку
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]')
      .find('button')
      .click({ force: true });

    // Добавляем основной ингредиент
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').scrollIntoView();
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click({ force: true });

    // Добавляем соус
    cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]').scrollIntoView();
    cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]')
      .find('button')
      .click({ force: true });

    // Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy="order-button"]').click({ force: true });

    // Ждем создания заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно заказа открылось
    cy.get('[data-cy="order-details"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '12345');

    // Закрываем модальное окно заказа
    cy.get('[data-cy="modal-close"]').find('svg').click({ force: true });

    // Проверяем, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Выберите начинку'
    );
    cy.get('[data-cy="constructor-price"]').should('contain', '0');
  });

  it('должен перенаправлять на страницу входа при попытке заказа без авторизации', () => {
    // Добавляем булку
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]')
      .find('button')
      .click({ force: true });

    // Добавляем основной ингредиент
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click({ force: true });

    // Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy="order-button"]').click({ force: true });

    // Проверяем, что произошло перенаправление на страницу входа
    cy.url().should('include', '/login');
  });
});
