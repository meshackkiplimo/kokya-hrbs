describe('Hotel website', () => {


    beforeEach(() => {
    cy.visit('/')

    })
    it('It should contain the correct homepage text', () => {
        // cy.get('[data-test="hero-title"]').contains('Find Your')
        cy.getDataTest('hero-title').should('contain', 'Find Your')

    })
})