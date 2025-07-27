describe("Register and Login Pages Tests", () => {
    beforeEach(() => {
        cy.visit('/')
        cy.viewport(1280, 800) // Set a desktop viewport size
    })

    describe("Register Page Tests", () => {
        it("should visit the register page successfully", () => {
            // Navigate to register page
            cy.visit('/register')
            cy.location('pathname').should('eq', '/register')
            
            // Verify page content
            cy.contains('Create your account').should('be.visible')
            cy.contains('Join us and start your journey').should('be.visible')
        })

        it("should display all required form fields", () => {
            cy.visit('/register')
            
            // Check form fields exist
            cy.get('input[placeholder="First Name"]').should('be.visible')
            cy.get('input[placeholder="Last Name"]').should('be.visible')
            cy.get('input[placeholder="Email address"]').should('be.visible')
            cy.get('input[placeholder="Password"]').should('be.visible')
            cy.get('button[type="submit"]').should('contain', 'Sign up')
        })

        it("should display validation errors for empty fields", () => {
            cy.visit('/register')
            
            // Try to submit empty form
            cy.get('button[type="submit"]').click()
            
            // Form should not submit and stay on same page
            cy.location('pathname').should('eq', '/register')
        })

        it("should fill and submit registration form with valid data", () => {
            cy.visit('/register')
            
            // Fill form with valid data
            cy.get('input[placeholder="First Name"]').type('John')
            cy.get('input[placeholder="Last Name"]').type('Doe')
            cy.get('input[placeholder="Email address"]').type('john.doe@example.com')
            cy.get('input[placeholder="Password"]').type('password123')
            
            // Submit form
            cy.get('button[type="submit"]').click()
            
            // Should show loading spinner
            cy.get('button[type="submit"]').should('not.exist')
        })

        it("should have a link to login page", () => {
            cy.visit('/register')
            
            // Check login link exists
            cy.contains('Already have an account?').should('be.visible')
            cy.get('a[href="/login"]').should('contain', 'Sign in')
            
            // Click login link
            cy.get('a[href="/login"]').click()
            cy.location('pathname').should('eq', '/login')
        })

        it("should validate email format", () => {
            cy.visit('/register')
            
            // Fill form with invalid email
            cy.get('input[placeholder="First Name"]').type('John')
            cy.get('input[placeholder="Last Name"]').type('Doe')
            cy.get('input[placeholder="Email address"]').type('invalid-email')
            cy.get('input[placeholder="Password"]').type('password123')
            
            // Try to submit
            cy.get('button[type="submit"]').click()
            
            // Should stay on register page due to validation
            cy.location('pathname').should('eq', '/register')
        })

        it("should validate password length", () => {
            cy.visit('/register')
            
            // Fill form with short password
            cy.get('input[placeholder="First Name"]').type('John')
            cy.get('input[placeholder="Last Name"]').type('Doe')
            cy.get('input[placeholder="Email address"]').type('john.doe@example.com')
            cy.get('input[placeholder="Password"]').type('123')
            
            // Try to submit
            cy.get('button[type="submit"]').click()
            
            // Should stay on register page due to validation
            cy.location('pathname').should('eq', '/register')
        })
    })

    describe("Login Page Tests", () => {
        it("should visit the login page successfully", () => {
            // Navigate to login page
            cy.visit('/login')
            cy.location('pathname').should('eq', '/login')
            
            // Verify page content
            cy.contains('Sign in to your account').should('be.visible')
        })

        it("should display all required form fields", () => {
            cy.visit('/login')
            
            // Check form fields exist
            cy.get('input[type="email"]').should('be.visible')
            cy.get('input[type="password"]').should('be.visible')
            cy.get('button[type="submit"]').should('contain', 'Sign In')
            
            // Check labels
            cy.contains('Email Address').should('be.visible')
            cy.contains('Password').should('be.visible')
        })

        it("should display validation errors for empty fields", () => {
            cy.visit('/login')
            
            // Try to submit empty form
            cy.get('button[type="submit"]').click()
            
            // Form should not submit and stay on same page
            cy.location('pathname').should('eq', '/login')
        })

        it("should fill and submit login form with valid data", () => {
            cy.visit('/login')
            
            // Fill form with valid data
            cy.get('input[type="email"]').type('user@example.com')
            cy.get('input[type="password"]').type('password123')
            
            // Submit form
            cy.get('button[type="submit"]').click()
            
            // Should show loading spinner
            cy.get('button[type="submit"]').should('not.exist')
        })

        it("should have a link to register page", () => {
            cy.visit('/login')
            
            // Check register link exists
            cy.contains("Don't have an account?").should('be.visible')
            cy.get('a[href="/signup"]').should('contain', 'Register')
        })

        it("should validate email format", () => {
            cy.visit('/login')
            
            // Fill form with invalid email
            cy.get('input[type="email"]').type('invalid-email')
            cy.get('input[type="password"]').type('password123')
            
            // Try to submit
            cy.get('button[type="submit"]').click()
            
            // Should stay on login page due to validation
            cy.location('pathname').should('eq', '/login')
        })

        it("should validate password length", () => {
            cy.visit('/login')
            
            // Fill form with short password
            cy.get('input[type="email"]').type('user@example.com')
            cy.get('input[type="password"]').type('123')
            
            // Try to submit
            cy.get('button[type="submit"]').click()
            
            // Should stay on login page due to validation
            cy.location('pathname').should('eq', '/login')
        })

        it("should have proper form attributes", () => {
            cy.visit('/login')
            
            // Check form attributes
            cy.get('input[type="email"]')
                .should('have.attr', 'id', 'email')
                .should('have.attr', 'placeholder', 'Enter your email')
                .should('have.attr', 'autocomplete', 'email')
                .should('have.attr', 'required')
            
            cy.get('input[type="password"]')
                .should('have.attr', 'id', 'password')
                .should('have.attr', 'placeholder', 'Enter your password')
                .should('have.attr', 'required')
        })
    })

    describe("Navigation Between Register and Login Pages", () => {
        it("should navigate from home to register to login", () => {
            // Start from home
            cy.visit('/')
            cy.location('pathname').should('eq', '/')
            
            // Navigate to register
            cy.visit('/register')
            cy.location('pathname').should('eq', '/register')
            cy.contains('Create your account').should('be.visible')
            
            // Navigate to login from register
            cy.get('a[href="/login"]').click()
            cy.location('pathname').should('eq', '/login')
            cy.contains('Sign in to your account').should('be.visible')
        })

        it("should navigate from home to login to register", () => {
            // Start from home
            cy.visit('/')
            cy.location('pathname').should('eq', '/')
            
            // Navigate to login
            cy.visit('/login')
            cy.location('pathname').should('eq', '/login')
            cy.contains('Sign in to your account').should('be.visible')
        })

        it("should maintain form state when navigating", () => {
            cy.visit('/register')
            
            // Fill some fields
            cy.get('input[placeholder="First Name"]').type('John')
            cy.get('input[placeholder="Email address"]').type('john@example.com')
            
            // Navigate to login and back
            cy.get('a[href="/login"]').click()
            cy.go('back')
            
            // Fields should be empty (fresh page load)
            cy.get('input[placeholder="First Name"]').should('have.value', '')
            cy.get('input[placeholder="Email address"]').should('have.value', '')
        })
    })

    describe("Form Accessibility Tests", () => {
        it("should have proper form labels and accessibility attributes for register", () => {
            cy.visit('/register')
            
            // Check form inputs have proper placeholders
            cy.get('input[placeholder="First Name"]').should('exist')
            cy.get('input[placeholder="Last Name"]').should('exist')
            cy.get('input[placeholder="Email address"]').should('exist')
            cy.get('input[placeholder="Password"]').should('exist')
        })

        it("should have proper form labels and accessibility attributes for login", () => {
            cy.visit('/login')
            
            // Check form has proper labels
            cy.get('label[for="email"]').should('contain', 'Email Address')
            cy.get('label[for="password"]').should('contain', 'Password')
            
            // Check inputs are properly associated with labels
            cy.get('input#email').should('exist')
            cy.get('input#password').should('exist')
        })

        it("should have proper button states", () => {
            cy.visit('/register')
            
            // Check submit button
            cy.get('button[type="submit"]')
                .should('be.visible')
                .should('not.be.disabled')
                .should('contain', 'Sign up')
            
            cy.visit('/login')
            
            // Check submit button
            cy.get('button[type="submit"]')
                .should('be.visible')
                .should('not.be.disabled')
                .should('contain', 'Sign In')
        })
    })

    describe("Responsive Design Tests", () => {
        it("should display properly on mobile viewport for register page", () => {
            cy.viewport(375, 667) // iPhone SE
            cy.visit('/register')
            
            // Check page is responsive
            cy.get('div.max-w-md').should('be.visible')
            cy.contains('Create your account').should('be.visible')
            cy.get('input[placeholder="First Name"]').should('be.visible')
        })

        it("should display properly on mobile viewport for login page", () => {
            cy.viewport(375, 667) // iPhone SE
            cy.visit('/login')
            
            // Check page is responsive
            cy.get('div.max-w-md').should('be.visible')
            cy.contains('Sign in to your account').should('be.visible')
            cy.get('input[type="email"]').should('be.visible')
        })

        it("should display properly on tablet viewport", () => {
            cy.viewport(768, 1024) // iPad
            cy.visit('/register')
            cy.contains('Create your account').should('be.visible')
            
            cy.visit('/login')
            cy.contains('Sign in to your account').should('be.visible')
        })
    })
})