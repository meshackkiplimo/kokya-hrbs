import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1, // 1 
    iterations: 1, // 1 iterations
    duration: '15s', // 15 seconds duration

};

export default function () {
    const url = 'http://localhost:3000/auth/login';
    const payload = JSON.stringify({
        email: 'smeski2111@ueab.ac.ke',
        password: '1234567'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has token': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body.token === 'string';
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}