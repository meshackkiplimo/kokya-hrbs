# Load Testing for Hotel Booking System

This directory contains load tests for the hotel booking system using k6.

## Test Types

- **Smoke Test**: Basic functionality with minimal load
- **Stress Test**: Finding the breaking point 
- **Spike Test**: Sudden traffic spikes simulation
- **Soak Test**: Extended duration testing
- **Breakpoint Test**: Gradual load increase to find limits

## Spike Test

The spike test simulates a sudden surge of users trying to book rooms simultaneously.

### Test Configuration

- **Baseline**: 10 users for 20s
- **Spike**: Sudden jump to 1000 users for 20s  
- **Sustain**: Hold 1000 users for 20s
- **Recovery**: Scale back to 10 users for 20s
- **Cleanup**: Scale to 0 users for 20s

### Success Criteria

- Error rate < 10%
- 95% of requests complete within 2 seconds
- System recovers gracefully after spike

## Prerequisites

1. **Install k6**:
   ```bash
   npm install -g k6
   ```

2. **Start your backend server**:
   ```bash
   cd backend
   npm run dev
   ```
   Server should be running on `http://localhost:3000`

## Running Tests

### Quick Start - Spike Test
```bash
# From the loadtest directory
node run-spike-test.js
```

### Manual Test Execution
```bash
# Run spike test directly
k6 run spike/booking.test.ts

# Run other tests
k6 run smoke/login.test.ts
k6 run stress/booking.test.ts
k6 run soak/payment.test.ts
```

## Test Details

### Spike Test Features

- ✅ **POST Method**: Uses correct POST method for booking creation
- ✅ **Proper Headers**: Includes `Content-Type: application/json`
- ✅ **Realistic Data**: Uses future dates and random room IDs
- ✅ **Validation**: Checks response structure and booking retrieval
- ✅ **Conflict Avoidance**: Random room selection reduces booking conflicts

### What the Test Does

1. **Create Booking**: POST request to `/bookings` endpoint
2. **Validate Creation**: Checks for 201 status and booking ID
3. **Retrieve Booking**: GET request to verify booking was stored
4. **Validate Retrieval**: Confirms booking data matches

## Expected Results

During a spike test, you should monitor:

- **Response Times**: Should stay under 2000ms for 95% of requests
- **Error Rates**: Should remain below 10%
- **System Recovery**: Server should handle the load gracefully
- **Database Performance**: Monitor DB connections and query times

## Troubleshooting

### Common Issues

1. **Connection Refused**: Make sure backend server is running
2. **High Error Rates**: Check database capacity and connection limits  
3. **Timeout Errors**: Increase server timeout settings
4. **Memory Issues**: Monitor server memory usage during spikes

### Tips for Better Results

- Ensure database has sufficient connections
- Monitor server CPU and memory during tests
- Consider implementing rate limiting for production
- Use caching for frequently accessed data