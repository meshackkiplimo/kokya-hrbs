/// <reference types="cypress" />

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`);
});

// Custom command to mock user authentication
Cypress.Commands.add('mockAuth', (user = {}) => {
    const defaultUser = {
        id: 1,
        user_id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        ...user
    };
    
    cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-jwt-token');
        win.localStorage.setItem('user', JSON.stringify(defaultUser));
    });
});

// Custom command to clear authentication
Cypress.Commands.add('clearAuth', () => {
    cy.window().then((win) => {
        win.localStorage.removeItem('token');
        win.localStorage.removeItem('user');
    });
});

// Custom command to wait for page to be ready
Cypress.Commands.add('waitForPageLoad', () => {
    cy.get('body').should('be.visible');
    cy.get('.loading').should('not.exist');
});

// Custom command to fill booking dates
Cypress.Commands.add('fillBookingDates', (daysFromToday = 1, stayDuration = 1) => {
    const today = new Date();
    const checkInDate = new Date(today);
    const checkOutDate = new Date(today);
    
    checkInDate.setDate(today.getDate() + daysFromToday);
    checkOutDate.setDate(today.getDate() + daysFromToday + stayDuration);
    
    const checkInStr = checkInDate.toISOString().split('T')[0];
    const checkOutStr = checkOutDate.toISOString().split('T')[0];
    
    cy.get('input[type="date"]').first().clear().type(checkInStr);
    cy.get('input[type="date"]').last().clear().type(checkOutStr);
    
    return { checkInStr, checkOutStr, nights: stayDuration };
});

// Custom command to intercept booking API calls
Cypress.Commands.add('interceptBookingAPI', (response = 'success') => {
    if (response === 'success') {
        cy.intercept('POST', '**/bookings', {
            statusCode: 201,
            body: {
                booking_id: 123,
                user_id: 1,
                hotel_id: 1,
                room_id: 1,
                check_in_date: '2024-01-15',
                check_out_date: '2024-01-16',
                total_amount: 5000,
                status: 'pending'
            }
        }).as('createBooking');
    } else if (response === 'error') {
        cy.intercept('POST', '**/bookings', {
            statusCode: 400,
            body: { message: 'Booking failed' }
        }).as('createBookingError');
    } else if (response === 'conflict') {
        cy.intercept('POST', '**/bookings', {
            statusCode: 409,
            body: { message: 'Booking conflict detected' }
        }).as('createBookingConflict');
    }
});

export {};
declare global {
  namespace Cypress {
    interface Chainable {
        getDataTest: (dataTestSelector: string) => Chainable<JQuery<HTMLElement>>;
        mockAuth: (user?: object) => Chainable<void>;
        clearAuth: () => Chainable<void>;
        waitForPageLoad: () => Chainable<void>;
        fillBookingDates: (daysFromToday?: number, stayDuration?: number) => Chainable<{checkInStr: string, checkOutStr: string, nights: number}>;
        interceptBookingAPI: (response?: 'success' | 'error' | 'conflict') => Chainable<void>;
    }
  }
}