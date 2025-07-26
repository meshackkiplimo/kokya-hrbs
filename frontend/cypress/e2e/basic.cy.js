describe('Hotel website', () => {


    beforeEach(() => {
    cy.visit('/')

    })
    it('It should contain the correct homepage text', () => {
        // cy.get('[data-test="hero-title"]').contains('Find Your')
        cy.getDataTest('hero-title').should('contain', 'Find Your')

    })
    it("menu works well",()=>{
        cy.visit('/')
        cy.getDataTest('hotels-link').click()
        
        // Set viewport to mobile size to make mobile menu toggle visible
        cy.viewport(375, 667) // iPhone 6/7/8 size
        cy.getDataTest('mobile-menu-toggle').click()

    })
})