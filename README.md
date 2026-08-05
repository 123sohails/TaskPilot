# TaskPilot

**A distributed workflow execution engine implementing the reliability patterns behind tools like Zapier and n8n — retries, idempotency, and dead-letter handling.**

## Objective

Automation tools like Zapier and n8n let you chain a trigger to a sequence of actions. The visible part — the drag-and-drop builder — is the easy 80%. The hard 20%, and the part that actually matters in production, is making sure that chain survives failure: a webhook that fires twice doesn't cause duplicate side effects, a temporarily-down API doesn't lose the event, and a permanently failed run doesn't disappear silently.

TaskPilot is built to solve exactly that 20%. It is not trying to compete with Zapier or n8n as a product — it has no integration marketplace, no visual builder, and no multi-tenant UI. It is a focused study of the distributed-systems problems those tools solve internally:

- **Idempotency** — the same triggering event, delivered more than once, is only ever acted on once.
- **Retries with backoff** — a failed step is retried automatically with increasing delay, instead of the workflow silently dying.
- **Dead-letter handling** — a step that fails after all retries is parked somewhere visible and inspectable, not lost.
- **Observability** — every execution is logged with status, duration, and retry count, so failures are diagnosable.

## Concrete example

A form submission triggers a workflow: save the submitter's email to a database, then send a welcome email.

- If the welcome-email API is briefly down, a naive script crashes and the signup is lost. TaskPilot retries automatically and recovers once the API is back.
- If the form's client fires the same submission twice (a common real-world occurrence), a naive script saves the email and sends the welcome message twice. TaskPilot recognizes the duplicate via an idempotency key and only processes it once.

## What this project demonstrates

- Distributed job execution (Node.js, Redis, BullMQ)
- Failure-mode engineering: retries, backoff, idempotency, dead-letter queues
- API design for triggering and monitoring asynchronous work
- One AI-powered decision step (Groq API) used for conditional branching
- Load testing under simulated failure to validate reliability claims with real numbers

## What this project deliberately does not include

No drag-and-drop UI, no OAuth logins, no integration marketplace, no multi-tenant accounts. These are Zapier/n8n's product surface, not their engineering core, and are out of scope by design — see Objective above.

## Tech stack

- **Runtime:** Node.js, Express
- **Queue:** Redis, BullMQ
- **Database:** supabase
- **AI step:** Groq API
- **Observability:** Prometheus-compatible `/metrics` endpoint

## Status

In development.
