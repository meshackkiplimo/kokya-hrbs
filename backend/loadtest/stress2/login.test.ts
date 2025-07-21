import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '1m', target: 100 },    // Ramp up to 100 users
    { duration: '2m', target: 200 },    // Ramp up to 200 users
    { duration: '2m', target: 300 },    // Ramp up to 300 users
    { duration: '2m', target: 400 },    // Stress test with 400 users
    { duration: '1m', target: 0 },      // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
  ext: {
    loadimpact: {
      name: 'login API Stress Test',
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
      },
    },
  },
};

export default function () {
  const response = http.post(`${BASE_URL}/auth/login`, {
    email: 'smeski2111@ueab.ac.ke',
    password: '1234567'
  }
    
  );

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has valid data': (r) => {
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


