import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';


export const options = {
    stages: [
        { duration: '20s', target: 10 },    // Baseline
        { duration: '20s', target: 1000 },  // Spike to 1000 users
        { duration: '20s', target: 1000 },  // Stay at 1000 for 20s
        { duration: '20s', target: 10 },    // Scale down to baseline
        { duration: '20s', target: 0 },     // Scale down to 0
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'],      // Error rate < 10%
        http_req_duration: ['p(95)<2000'],  // 95% requests within 2s
    }
};


export default function () {
    // Create a booking
    




    // Required booking data structure
    const booking = {
        user_id: 1,
            hotel_id: 1,
            room_id: 1,
            check_in_date: '2023-10-01',
            check_out_date: '2023-10-03',
            total_amount: 24000, // 2 nights * 12000
            status: "confirmed",
            created_at: new Date(),
            updated_at: new Date(),
    };

    // Create booking
    const createResponse = http.post(
        `${BASE_URL}/bookings`,
        JSON.stringify(booking),
      
    );

    // Verify booking creation
    const createChecks = check(createResponse, {
        'booking created successfully': (r) => r.status === 201,
        'response time < 2000ms': (r) => r.timings.duration < 2000,
        'response has booking data': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return body.booking && body.booking.booking_id;
            } catch {
                return false;
            }
        }
    });

    // If booking was created successfully, verify we can retrieve it
    if (createChecks) {
        try {
            const body = JSON.parse(createResponse.body as string);
            if (body.booking && body.booking.booking_id) {
                const getResponse = http.get(
                    `${BASE_URL}/bookings/${body.booking.booking_id}`,
                   
                );

                check(getResponse, {
                    'get booking successful': (r) => r.status === 200,
                    'get response time < 2000ms': (r) => r.timings.duration < 2000,
                    'retrieved booking matches': (r) => {
                        try {
                            const body = JSON.parse(r.body as string);
                            return body.booking && 
                                   body.booking.car_id === booking.room_id &&
                                   body.booking.customer_id === booking.user_id;
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