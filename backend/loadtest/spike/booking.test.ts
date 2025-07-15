import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';


export const options = {
    stages: [
        { duration: '10s', target: 2 },     // Baseline
        { duration: '5s', target: 20 },     // Quick spike to 20 users
        { duration: '10s', target: 20 },    // Stay at 20 for 10s
        { duration: '5s', target: 2 },      // Scale down to baseline
        { duration: '10s', target: 0 },     // Scale down to 0
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'],      // Target 10% error rate
        http_req_duration: ['p(95)<2000'],  // 95% requests within 2s
    }
};


export default function () {
    // Create a booking
    




    // Required booking data structure with future dates
    const today = new Date();
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 7); // 7 days from now
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 2); // 2 nights stay

    const booking = {
        user_id: 1, // Use consistent user ID to avoid DB lookup issues
        hotel_id: 1,
        room_id: Math.floor(Math.random() * 1000) + 1, // Increase room range to avoid conflicts
        check_in_date: checkInDate.toISOString().split('T')[0], // YYYY-MM-DD format
        check_out_date: checkOutDate.toISOString().split('T')[0], // YYYY-MM-DD format
        total_amount: 24000, // 2 nights * 12000
        status: "confirmed"
    };

    // Create booking with proper headers
    const createResponse = http.post(
        `${BASE_URL}/bookings`,
        JSON.stringify(booking),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    // Verify booking creation
    const createChecks = check(createResponse, {
        'booking created successfully': (r) => r.status === 201,
        'response time < 2000ms': (r) => r.timings.duration < 2000,
        'response has booking data': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return body && body.booking_id;
            } catch {
                return false;
            }
        }
    });

    // If booking was created successfully, verify we can retrieve it
    if (createChecks) {
        try {
            const body = JSON.parse(createResponse.body as string);
            if (body && body.booking_id) {
                const getResponse = http.get(
                    `${BASE_URL}/bookings/${body.booking_id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                check(getResponse, {
                    'get booking successful': (r) => r.status === 200,
                    'get response time < 2000ms': (r) => r.timings.duration < 2000,
                    'retrieved booking matches': (r) => {
                        try {
                            const responseBody = JSON.parse(r.body as string);
                            return responseBody &&
                                   responseBody.room_id === booking.room_id &&
                                   responseBody.user_id === booking.user_id;
                        } catch {
                            return false;
                        }
                    }
                });
            }
        } catch (e) {
            console.error('Failed to parse booking response:', e);
        }
    }

    sleep(1);
}