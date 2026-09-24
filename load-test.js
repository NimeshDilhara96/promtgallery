import http from 'k6/http';
import { check, sleep } from 'k6';

// --------------------------------------------------------
// INSTRUCTIONS:
// 1. Install k6: https://k6.io/docs/get-started/installation/
// 2. Run your Next.js app in production mode:
//    npm run build && npm run start
// 3. Run this script in a separate terminal: 
//    k6 run load-test.js
// --------------------------------------------------------

export const options = {
  // Simulates a realistic traffic spike: 
  // Ramps up to 50 concurrent users over 30s, holds for 1m, then ramps down.
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // LATENCY BUDGET: 95% of requests must complete below 500ms
    http_req_duration: ['p(95)<500'],
    // ERROR BUDGET: Error rate must be less than 1% (Next.js crashing / DB timeouts)
    http_req_failed: ['rate<0.01'], 
  },
};

const BASE_URL = 'http://localhost:3000'; // Change this to your production URL when testing live

export default function () {
  // 1. Test the homepage (Likely cached / fast TTFB)
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'homepage loaded successfully (200)': (r) => r.status === 200,
  });

  sleep(1); // Simulate user reading the page for 1 second

  // 2. Test a Dynamic Search (Forces a MongoDB Regex Query)
  const searchRes = http.get(`${BASE_URL}/?search=cyberpunk&category=General`);
  check(searchRes, {
    'search loaded successfully (200)': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Test Pagination (Forces a MongoDB skip/limit query)
  const pageRes = http.get(`${BASE_URL}/?page=2`);
  check(pageRes, {
    'pagination loaded successfully (200)': (r) => r.status === 200,
  });

  sleep(1);
}
