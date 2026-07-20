# Air Ticket Booking Service

Orchestrates the flight-booking flow — seat validation, cost calculation, status transitions,
and async notification — by coordinating with the Flight & Search Service (HTTP) and the
Reminder Service (RabbitMQ). All requests arrive via the API Gateway, which validates the
JWT before any booking code runs.

Part of a 5-service system: [API Gateway](https://github.com/Prateek-5/APIGateway) · [Auth Service](https://github.com/Prateek-5/Auth_Service) · **Booking Service** · [Flight & Search Service](https://github.com/Prateek-5/FlightAndSearchService) · [Reminder Service](https://github.com/Prateek-5/ReminderService)

---

## What it does

```
POST /api/v1/booking    Create a booking
```

The booking flow on `createBooking`:

```
1. GET flight/:id from FlightAndSearchService  ← HTTP call
2. Validate noOfSeats <= flight.totalSeats
3. Calculate totalCost = price × noOfSeats
4. INSERT booking row (status: "Inprocess")
5. PATCH flight/:id { totalSeats: totalSeats - noOfSeats }  ← decrement seats
6. UPDATE booking status → "Booked"
7. Publish confirmation message to RabbitMQ queue  ← async, fire-and-forget
8. Return confirmed booking
```

---

## Data model

```
Booking
────────────────────────────────────
id          PK
flightId    INT    (reference to FlightAndSearchService — no FK across services)
userId      INT    (reference to AuthService — no FK across services)
status      ENUM   Inprocess | Booked | Cancelled   (default: Inprocess)
noOfSeats   INT    (default: 1)
totalCost   INT    (derived: flight.price × noOfSeats)
```

---

## Inter-service communication

```
                    ┌─────────────────────┐
                    │  API Gateway :3005  │  validates JWT before forwarding
                    └──────────┬──────────┘
                               │ HTTP
                    ┌──────────▼──────────┐
                    │  Booking  :3002     │
                    └──┬──────────────┬───┘
         HTTP (axios)  │              │  AMQP (RabbitMQ)
               ┌───────▼──────┐  ┌───▼──────────────┐
               │ FlightSearch │  │ ReminderService  │
               │    :3000     │  │   (async queue)  │
               └──────────────┘  └──────────────────┘
```

**HTTP** — synchronous call to FlightSearch to read flight data and decrement seats.
Both happen in the same request flow; a failure at the seat-decrement step would leave
the booking in `Inprocess` status (a real system would add a saga-style compensating step).

**RabbitMQ** — after the booking is confirmed, a message is published to the
`REMINDER_BINDING_KEY` queue. The Reminder Service picks this up asynchronously and sends
a confirmation email. The booking response doesn't wait for the email to send.

---

## Key design decisions

**Status as a state machine.**
`Inprocess → Booked` is the happy path. `Cancelled` exists for future compensating flows.
The booking row is created as `Inprocess` before any side effects — if the process crashes
after the DB write but before the flight-seat update, the `Inprocess` status is the signal
that reconciliation is needed.

**Cross-service references without foreign keys.**
`flightId` and `userId` reference rows in other services' databases. There are no cross-DB
foreign keys — referential integrity is enforced at the application layer (the service
validates the flight exists before booking). This is the standard microservices trade-off:
loose coupling over DB-level consistency.

**Notification is async and fire-and-forget.**
The booking confirmation should not be blocked by whether the email send succeeds. Publishing
to a queue decouples the two: booking is fast and crash-safe; email delivery is eventual.

---

## Stack

| Concern | Library |
|---|---|
| HTTP server | Express 4 |
| ORM | Sequelize + Sequelize CLI |
| Database | MySQL |
| Inter-service HTTP | Axios |
| Message queue | amqplib (RabbitMQ / AMQP) |
| HTTP status codes | http-status-codes |

---

## Setup

Requires: MySQL, RabbitMQ, and FlightAndSearchService running.

```bash
npm install
npx sequelize-cli db:migrate
```

Create `.env`:
```
PORT=3002
DB_NAME=booking_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
FLIGHT_SERVICE_PATH=http://localhost:3000
REMINDER_BINDING_KEY=reminder-binding-key
MESSAGE_BROKER_URL=amqp://localhost
```

```bash
node src/index.js
```
