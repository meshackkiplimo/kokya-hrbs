describe('Hotel website', () => {


    beforeEach(() => {
    cy.visit('/')

    })
    it('It should contain the correct homepage text', () => {
        cy.get('h1').contains('Find Your')

    })
})