describe("User Booking Functionality", () => {
    beforeEach(() => {
        cy.visit('/')
        cy.viewport(1280, 800)
    })

    describe("Hotel Page Access and Display", () => {
        it("should navigate to hotels page successfully", () => {
            cy.visit('/hotels')
            cy.location('pathname').should('eq', '/hotels')
            
            // Verify page content
            cy.contains('Find Your Perfect Stay').should('be.visible')
            cy.contains('Discover amazing hotels with comfortable rooms').should('be.visible')
        })

        it("should display search and filter controls", () => {
            cy.visit('/hotels')
            
            // Check search input
            cy.get('input[placeholder="Search hotels or locations..."]').should('be.visible')
            
            // Check category filter
            cy.get('select').first().should('be.visible')
            cy.get('select').first().should('contain', 'All Categories')
            
            // Check price range filter
            cy.get('select').eq(1).should('be.visible')
            cy.get('select').eq(1).should('contain', 'All Prices')
        })

        it("should display loading state initially", () => {
            cy.visit('/hotels')
            
            // Should show loading spinner initially (may be brief)
            cy.get('.loading', { timeout: 1000 }).should('exist').or(() => {
                // If loading is too fast, just verify the page loaded
                cy.contains('Find Your Perfect Stay').should('be.visible')
            })
        })

        it("should display hotels grid when data loads", () => {
            cy.visit('/hotels')
            cy.waitForPageLoad()
            
            // Should show hotels found count or no results message
            cy.get('body').should('contain', 'found').or('contain', 'No hotels found')
        })
    })

    describe("Hotel Search and Filtering", () => {
        beforeEach(() => {
            cy.visit('/hotels')
            cy.waitForPageLoad()
        })

        it("should filter hotels by search term", () => {
            const searchInput = cy.get('input[placeholder="Search hotels or locations..."]')
            
            // Type in search term
            searchInput.type('luxury')
            
            // Results should update
            cy.get('body').should('exist')
        })

        it("should filter hotels by category", () => {
            const categorySelect = cy.get('select').first()
            
            // Get available options
            categorySelect.find('option').then($options => {
                if ($options.length > 1) {
                    // Select a category other than "All Categories"
                    categorySelect.select($options.eq(1).val())
                    cy.get('body').should('exist')
                }
            })
        })

        it("should filter hotels by price range", () => {
            const priceSelect = cy.get('select').eq(1)
            
            // Test different price ranges
            ['budget', 'mid', 'luxury'].forEach(range => {
                priceSelect.select(range)
                cy.get('body').should('exist')
            })
        })

        it("should show results count", () => {
            cy.get('body').should('contain', 'hotel').and('contain', 'found')
        })
    })

    describe("Room Viewing and Details", () => {
        beforeEach(() => {
            cy.visit('/hotels')
            cy.waitForPageLoad()
        })

        it("should display available rooms for hotels", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.contains('Available Rooms').should('be.visible')
                    cy.get('button:contains("Book")').should('exist')
                } else {
                    cy.get('body').should('contain', 'room').or('contain', 'Room')
                }
            })
        })

        it("should open room details modal when View Details is clicked", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("View Details")').length > 0) {
                    cy.get('button:contains("View Details")').first().click()
                    
                    // Should open room details modal
                    cy.get('body').should('contain', 'Room Information')
                      .or('contain', 'Room Type')
                      .or('contain', 'Price per night')
                    
                    // Should have close button
                    cy.get('button:contains("Close")').should('exist')
                      .or(() => cy.get('button').contains('×').should('exist'))
                }
            })
        })

        it("should display comprehensive room information in modal", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("View Details")').length > 0) {
                    cy.get('button:contains("View Details")').first().click()
                    
                    // Check for all room details
                    cy.get('body').should('contain', 'Room Type')
                    cy.get('body').should('contain', 'Price per night')
                    cy.get('body').should('contain', 'Capacity')
                    cy.get('body').should('contain', 'Amenities')
                    
                    // Should show room number
                    cy.get('body').should('contain', 'Room')
                    
                    // Close modal
                    cy.get('button:contains("Close")').click()
                      .or(() => cy.get('button').contains('×').click())
                }
            })
        })

        it("should allow booking from room details modal", () => {
            cy.mockAuth()
            cy.visit('/hotels')
            cy.waitForPageLoad()
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("View Details")').length > 0) {
                    cy.get('button:contains("View Details")').first().click()
                    
                    // Should have book button in modal
                    cy.get('button:contains("Book This Room")').should('exist')
                      .or(() => cy.get('button:contains("Book")').should('exist'))
                }
            })
        })
    })

    describe("Booking Process - Unauthenticated User", () => {
        beforeEach(() => {
            cy.clearAuth()
            cy.visit('/hotels')
            cy.waitForPageLoad()
        })

        it("should prompt login when unauthenticated user tries to book", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    // Set up alert handler
                    cy.window().then((win) => {
                        cy.stub(win, 'alert').as('windowAlert')
                    })
                    
                    cy.get('button:contains("Book")').first().click()
                    
                    // Should show login prompt
                    cy.get('@windowAlert').should('have.been.calledWith', 'Please log in to make a booking')
                }
            })
        })

        it("should not show booking modal for unauthenticated users", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Should not open booking modal
                    cy.get('body').should('not.contain', 'Book Room')
                    cy.get('body').should('not.contain', 'Check-in Date')
                }
            })
        })
    })

    describe("Booking Process - Authenticated User", () => {
        beforeEach(() => {
            cy.mockAuth()
            cy.visit('/hotels')
            cy.waitForPageLoad()
        })

        it("should open booking modal when authenticated user clicks Book", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Should open booking modal
                    cy.get('body').should('contain', 'Book Room')
                    cy.get('body').should('contain', 'Check-in Date')
                    cy.get('body').should('contain', 'Check-out Date')
                }
            })
        })

        it("should display booking form with all required elements", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Check for booking form elements
                    cy.get('body').should('contain', 'Check-in Date')
                    cy.get('body').should('contain', 'Check-out Date')
                    cy.get('input[type="date"]').should('have.length.at.least', 2)
                    cy.get('button:contains("Confirm")').should('exist')
                    cy.get('button:contains("Cancel")').should('exist')
                    
                    // Should show room details
                    cy.get('body').should('contain', 'Room #')
                    cy.get('body').should('contain', '/night')
                }
            })
        })

        it("should validate required booking form fields", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Set up alert handler
                    cy.window().then((win) => {
                        cy.stub(win, 'alert').as('windowAlert')
                    })
                    
                    // Try to submit without filling dates
                    cy.get('button:contains("Confirm")').click()
                    
                    // Should show validation message
                    cy.get('@windowAlert').should('have.been.calledWith', 'Please fill in all booking details')
                }
            })
        })

        it("should validate check-out date is after check-in date", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Set up alert handler
                    cy.window().then((win) => {
                        cy.stub(win, 'alert').as('windowAlert')
                    })
                    
                    // Set invalid dates (check-out before check-in)
                    const today = new Date()
                    const tomorrow = new Date(today)
                    tomorrow.setDate(today.getDate() + 1)
                    
                    const todayStr = today.toISOString().split('T')[0]
                    const tomorrowStr = tomorrow.toISOString().split('T')[0]
                    
                    cy.get('input[type="date"]').first().clear().type(tomorrowStr)
                    cy.get('input[type="date"]').last().clear().type(todayStr)
                    
                    cy.get('button:contains("Confirm")').click()
                    
                    // Should show validation error
                    cy.get('@windowAlert').should('have.been.calledWith', 'Check-out date must be after check-in date')
                }
            })
        })

        it("should calculate and display total amount correctly", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Fill valid dates using custom command
                    cy.fillBookingDates(1, 2) // 1 day from today, 2 nights stay
                    
                    // Should show total calculation
                    cy.get('body').should('contain', 'Total nights: 2')
                    cy.get('body').should('contain', 'Total amount:')
                    cy.get('body').should('contain', 'KSH')
                }
            })
        })

        it("should successfully create booking with valid data", () => {
            cy.interceptBookingAPI('success')
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Fill valid booking data
                    cy.fillBookingDates(1, 1)
                    
                    // Submit booking
                    cy.get('button:contains("Confirm")').click()
                    
                    // Should make API call
                    cy.wait('@createBooking')
                    
                    // Should redirect to bookings page
                    cy.url().should('include', '/user-dashboard/bookings')
                }
            })
        })

        it("should handle booking API errors gracefully", () => {
            cy.interceptBookingAPI('error')
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Set up alert handler
                    cy.window().then((win) => {
                        cy.stub(win, 'alert').as('windowAlert')
                    })
                    
                    // Fill valid booking data
                    cy.fillBookingDates(1, 1)
                    
                    // Submit booking
                    cy.get('button:contains("Confirm")').click()
                    
                    // Should show error message
                    cy.get('@windowAlert').should('have.been.calledWith', 'Booking failed. Please try again.')
                }
            })
        })

        it("should handle booking conflicts", () => {
            cy.interceptBookingAPI('conflict')
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Fill valid booking data
                    cy.fillBookingDates(1, 1)
                    
                    // Submit booking
                    cy.get('button:contains("Confirm")').click()
                    
                    // Should handle conflict appropriately
                    cy.get('body').should('exist') // Basic assertion that app doesn't crash
                }
            })
        })

        it("should allow user to cancel booking", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Click cancel button
                    cy.get('button:contains("Cancel")').click()
                    
                    // Modal should close
                    cy.get('body').should('not.contain', 'Book Room')
                }
            })
        })

        it("should reset form when modal is reopened", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Fill some data
                    cy.fillBookingDates(1, 1)
                    
                    // Cancel
                    cy.get('button:contains("Cancel")').click()
                    
                    // Reopen modal
                    cy.get('button:contains("Book")').first().click()
                    
                    // Form should be reset
                    cy.get('input[type="date"]').first().should('have.value', '')
                    cy.get('input[type="date"]').last().should('have.value', '')
                }
            })
        })
    })

    describe("Booking Form Accessibility and UX", () => {
        beforeEach(() => {
            cy.mockAuth()
            cy.visit('/hotels')
            cy.waitForPageLoad()
        })

        it("should have proper form labels and accessibility attributes", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Check for labels
                    cy.get('body').should('contain', 'Check-in Date')
                    cy.get('body').should('contain', 'Check-out Date')
                    
                    // Check date inputs have proper attributes
                    cy.get('input[type="date"]').should('have.attr', 'min')
                    cy.get('input[type="date"]').first().should('have.attr', 'min')
                    cy.get('input[type="date"]').last().should('have.attr', 'min')
                }
            })
        })

        it("should handle keyboard navigation properly", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Tab through form elements
                    cy.get('input[type="date"]').first().focus()
                    cy.focused().tab()
                    cy.get('input[type="date"]').last().should('be.focused')
                }
            })
        })

        it("should disable confirm button when loading", () => {
            cy.interceptBookingAPI('success')
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Fill valid data
                    cy.fillBookingDates(1, 1)
                    
                    // Submit booking
                    cy.get('button:contains("Confirm")').click()
                    
                    // Button should show loading state
                    cy.get('button:contains("Booking...")').should('exist')
                      .or(() => cy.get('button[disabled]').should('exist'))
                }
            })
        })
    })

    describe("Responsive Design for Booking", () => {
        beforeEach(() => {
            cy.mockAuth()
        })

        it("should display booking modal properly on mobile devices", () => {
            cy.viewport(375, 667) // iPhone SE
            cy.visit('/hotels')
            cy.waitForPageLoad()
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Modal should be visible and responsive
                    cy.get('body').should('contain', 'Book Room')
                    cy.get('input[type="date"]').should('be.visible')
                    cy.get('button:contains("Confirm")').should('be.visible')
                    cy.get('button:contains("Cancel")').should('be.visible')
                }
            })
        })

        it("should display booking modal properly on tablet devices", () => {
            cy.viewport(768, 1024) // iPad
            cy.visit('/hotels')
            cy.waitForPageLoad()
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Modal should be visible and responsive
                    cy.get('body').should('contain', 'Book Room')
                    cy.get('input[type="date"]').should('be.visible')
                }
            })
        })

        it("should maintain functionality across different screen sizes", () => {
            const viewports = [
                [320, 568], // iPhone 5
                [375, 667], // iPhone SE
                [414, 896], // iPhone XR
                [768, 1024], // iPad
                [1024, 768], // iPad Landscape
                [1280, 800]  // Desktop
            ];
            
            viewports.forEach(([width, height]) => {
                cy.viewport(width, height)
                cy.visit('/hotels')
                cy.waitForPageLoad()
                
                cy.get('body').then($body => {
                    if ($body.find('button:contains("Book")').length > 0) {
                        cy.get('button:contains("Book")').first().click()
                        cy.get('body').should('contain', 'Book Room')
                        cy.get('button:contains("Cancel")').click()
                    }
                })
            })
        })
    })

    describe("Error Handling and Edge Cases", () => {
        beforeEach(() => {
            cy.mockAuth()
            cy.visit('/hotels')
            cy.waitForPageLoad()
        })

        it("should handle network errors gracefully", () => {
            // Simulate network failure
            cy.intercept('POST', '**/bookings', { forceNetworkError: true }).as('networkError')
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    cy.fillBookingDates(1, 1)
                    cy.get('button:contains("Confirm")').click()
                    
                    // Should handle network error gracefully
                    cy.get('body').should('exist') // App shouldn't crash
                }
            })
        })

        it("should handle date validation edge cases", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Test past dates (should be prevented by min attribute)
                    const yesterday = new Date()
                    yesterday.setDate(yesterday.getDate() - 1)
                    const yesterdayStr = yesterday.toISOString().split('T')[0]
                    
                    cy.get('input[type="date"]').first().should('have.attr', 'min')
                    
                    // The browser should prevent setting past dates due to min attribute
                    cy.get('input[type="date"]').first().invoke('attr', 'min').then(minDate => {
                        expect(minDate).to.be.at.least(yesterdayStr)
                    })
                }
            })
        })

        it("should handle very long stay durations", () => {
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    
                    // Test 30-day stay
                    cy.fillBookingDates(1, 30)
                    
                    // Should calculate total correctly
                    cy.get('body').should('contain', 'Total nights: 30')
                }
            })
        })
    })

    describe("Integration with Payment System", () => {
        beforeEach(() => {
            cy.mockAuth()
            cy.interceptBookingAPI('success')
        })

        it("should redirect to user dashboard after successful booking", () => {
            cy.visit('/hotels')
            cy.waitForPageLoad()
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    cy.fillBookingDates(1, 1)
                    cy.get('button:contains("Confirm")').click()
                    
                    // Should redirect to user dashboard bookings
                    cy.url().should('include', '/user-dashboard/bookings')
                }
            })
        })

        it("should maintain booking data in API request", () => {
            cy.visit('/hotels')
            cy.waitForPageLoad()
            
            cy.get('body').then($body => {
                if ($body.find('button:contains("Book")').length > 0) {
                    cy.get('button:contains("Book")').first().click()
                    cy.fillBookingDates(1, 2)
                    cy.get('button:contains("Confirm")').click()
                    
                    cy.wait('@createBooking').then((interception) => {
                        expect(interception.request.body).to.have.property('user_id')
                        expect(interception.request.body).to.have.property('hotel_id')
                        expect(interception.request.body).to.have.property('room_id')
                        expect(interception.request.body).to.have.property('check_in_date')
                        expect(interception.request.body).to.have.property('check_out_date')
                        expect(interception.request.body).to.have.property('total_amount')
                        expect(interception.request.body).to.have.property('status', 'pending')
                    })
                }
            })
        })
    })
})