import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000'; // Update if your API runs on a different port

export const options = {
    stages: [
        { duration: '1m', target: 20 },   // ramp-up to 20 users over 2 minutes
        { duration: '3m', target: 20 },  // stay at 20 users for 56 minutes (total 58m)
        { duration: '40s', target: 0 },    // ramp-down to 0 users
    ],
    ext: {
        loadimpact: {
            name: 'payments GET Soak Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/payments`, {
      
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}