## SAM Serverless Application Model

## common implementation pattern

```js
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const db = new DynamoDBClient();

export const handler = async event => {
  const key = event.idempotencyKey;

  const existing = await db.send(
    new GetItemCommand({
      TableName: "IdempotencyTable",
      Key: { id: { S: key } }
    })
  );

  if (existing.Item) {
    return JSON.parse(existing.Item.response.S);
  }

  const result = await processPayment(event);

  await db.send(
    new PutItemCommand({
      TableName: "IdempotencyTable",
      Item: {
        id: { S: key },
        response: { S: JSON.stringify(result) }
      }
    })
  );

  return result;
};
```

Here are **practical best practices** for building scalable, maintainable
backends with **AWS Lambda + Node.js**. I’ll keep it focused on what actually matters in production.

---

# ⚙️ 1. Structure Your Lambda Functions Properly

**Keep functions small and single-purpose**

- One Lambda = one responsibility (e.g., “createUser”, “processPayment”)
- Avoid monolithic “do everything” handlers

**Use a clean folder structure**

```
/src
  /handlers
  /services
  /repositories
  /utils
```

**Separate concerns**

- Handler → receives event
- Service → business logic
- Repository → database access

---

# 🚀 2. Optimize Cold Starts

Cold starts are one of the biggest issues with Lambda.

**Best practices:**

- Use **Node.js 18+ or 20** (faster startup)
- Keep deployment package small
- Avoid heavy libraries (e.g., full AWS SDK v2)

**Use modular imports**

```js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
```

Instead of:

```js
import AWS from "aws-sdk"; // ❌ heavy
```

**Initialize outside handler**

```js
const dbClient = new DynamoDBClient();

export const handler = async event => {
  // reuse client
};
```

---

# 📦 3. Manage Dependencies Smartly

- Use **Lambda Layers** for shared libraries
- Bundle with:

  - esbuild (fastest)
  - or webpack

**Why bundle?**

- Reduces size
- Faster cold start
- Removes unused code (tree shaking)

---

# 🔐 4. Handle Configuration & Secrets Correctly

**Never hardcode secrets**

Use:

- AWS Systems Manager Parameter Store
- AWS Secrets Manager

**Environment variables**

- Store non-sensitive config (timeouts, feature flags)

---

# 🧠 5. Use Async Patterns Efficiently

Node.js Lambda thrives on async.

**Avoid sequential awaits**

```js
// ❌ slow
await task1();
await task2();
```

**Use parallel execution**

```js
await Promise.all([task1(), task2()]);
```

---

# 🗄️ 6. Database Connection Management

For DBs like MongoDB or PostgreSQL:

**Reuse connections**

```js
let connection;

export const handler = async () => {
  if (!connection) {
    connection = await connectDB();
  }
};
```

**Better option:**

- Use serverless-friendly DBs:

  - DynamoDB (native AWS)
  - Aurora Serverless

---

# 📊 7. Logging & Monitoring

Use:

- Amazon CloudWatch

**Best practices:**

- Structured logs (JSON)
- Add request IDs
- Log errors with context

Example:

```js
console.error(
  JSON.stringify({
    message: "Payment failed",
    userId,
    error
  })
);
```

---

# ⚡ 8. Error Handling Strategy

- Always return meaningful HTTP responses
- Don’t expose internal errors

```js
try {
  // logic
} catch (err) {
  console.error(err);
  return {
    statusCode: 500,
    body: "Internal server error"
  };
}
```

---

# 🔁 9. Idempotency (Critical in Serverless)

Lambda can retry automatically.

**Make operations safe to retry**

- Use idempotency keys
- Avoid duplicate writes/payments

---

# 🌐 10. API Gateway Integration

Use:

- Amazon API Gateway

**Best practices:**

- Validate input at gateway level
- Use request/response mapping
- Enable throttling & rate limiting

---

# 🧪 11. Testing Strategy

- Unit test business logic (services)
- Mock AWS SDK

Tools:

- Jest

---

# 🚢 12. CI/CD & Deployment

Use:

- AWS SAM
- Serverless Framework

**Best practices:**

- Deploy per environment (dev/staging/prod)
- Use feature flags
- Automate rollbacks

---

# 🔒 13. Security Best Practices

- Use least-privilege IAM roles
- Validate all inputs
- Enable API Gateway auth (JWT, Cognito)

---

# ⚡ 14. Performance Tips That Matter

- Increase memory → also increases CPU (often faster overall)
- Use caching (Redis / API Gateway cache)
- Prefer event-driven architecture (SQS, SNS)

---

# 🧩 15. When NOT to Use Lambda

Avoid Lambda if:

- Long-running jobs (>15 min)
- Heavy CPU workloads
- Constant high throughput (consider containers like ECS/Fargate)

---

# ✅ Simple Production Checklist

- [ ] Small, focused functions
- [ ] Bundled & optimized
- [ ] Secrets managed securely
- [ ] Proper logging & monitoring
- [ ] Idempotent logic
- [ ] Tested & CI/CD enabled

---

If you want, I can give you a **production-ready starter template (Node.js Lambda)** or review your current architecture.

Let’s break this down properly—because **dependency management is one of the biggest performance and maintainability levers in AWS Lambda (Node.js)**.

---

# 📦 Why Dependency Management Matters in Lambda

Bad dependency handling leads to:

- ❌ Slow cold starts
- ❌ Large deployment packages
- ❌ Hard-to-maintain code
- ❌ Duplicate libraries across functions

Good handling gives you:

- ⚡ Faster execution
- 📉 Smaller bundles
- 🔁 Reusable code

---

# 🧱 1. Use Lambda Layers for Shared Libraries

A **Lambda Layer** is a shared package used by multiple Lambdas.

## ✅ When to Use Layers

Use layers for:

- Shared utilities (logging, validation)
- Common SDK wrappers
- Heavy dependencies (e.g., database clients)

---

## 📁 Example Structure

```
layer/
  nodejs/
    package.json
    node_modules/
```

Deploy this layer and attach it to multiple functions.

---

## ⚙️ How It Works

Instead of each Lambda having:

```
node_modules/
  axios/
  lodash/
```

👉 You move them into a layer
👉 All Lambdas reuse it

---

## ⚠️ When NOT to Use Layers

Avoid layers if:

- You deploy very frequently (layers add versioning complexity)
- You want fully self-contained functions (simpler CI/CD)

---

# ⚡ 2. Bundle Your Code (CRITICAL)

Bundling = packaging your code into a **single optimized file**

Use:

- esbuild → fastest, best for Lambda
- webpack → more configurable

---

## 🚀 Why Bundling is Important

Without bundling:

```
node_modules = 10–50MB 😬
```

With bundling:

```
bundle.js = ~1MB ⚡
```

Benefits:

- Faster cold starts
- Less I/O at runtime
- Tree-shaking (removes unused code)

---

## 🧪 Example with esbuild

```bash
npx esbuild src/handler.js \
  --bundle \
  --platform=node \
  --target=node18 \
  --outdir=dist
```

---

## 📦 Output

```
dist/
  handler.js   ✅ (everything inside)
```

---

# 🌳 3. Tree Shaking (Automatic Optimization)

Bundlers remove unused code:

```js
import _ from "lodash";
```

👉 becomes only what you actually use

---

# 🧩 4. Combine Layers + Bundling (Best Strategy)

### Smart setup:

| Type of dependency      | Where it goes    |
| ----------------------- | ---------------- |
| Frequently updated code | Bundle           |
| Rarely changing libs    | Layer            |
| AWS SDK v3 modules      | Bundle (modular) |

---

# 🔥 5. Avoid Common Mistakes

## ❌ Shipping full AWS SDK v2

Instead use modular v3:

```js
import { S3Client } from "@aws-sdk/client-s3";
```

---

## ❌ Not excluding dev dependencies

Use:

```bash
npm install --production
```

---

## ❌ Huge node_modules in every Lambda

👉 Fix with bundling or layers

---

## ❌ One layer for everything

👉 Better:

- `core-utils-layer`
- `db-layer`
- `auth-layer`

---

# ⚖️ esbuild vs webpack (Quick Comparison)

| Feature         | esbuild ⚡ | webpack 🧠 |
| --------------- | ---------- | ---------- |
| Speed           | Very fast  | Slower     |
| Config          | Simple     | Complex    |
| Tree shaking    | Yes        | Yes        |
| Best for Lambda | ✅         | ⚠️         |

👉 In 90% of Lambda projects → **use esbuild**

---

# 🧠 Production Tips

- Keep bundle under **5MB if possible**
- Use **minify** in production:

```bash
--minify
```

- Externalize layer dependencies:

```bash
--external:aws-sdk
```

---

# ✅ Simple Strategy to Follow

1. Bundle every Lambda with esbuild
2. Use layers for shared/heavy dependencies
3. Use AWS SDK v3 (modular imports)
4. Keep packages small and focused

---

# 🧩 Mental Model

Think of it like:

- **Bundling = optimize per function**
- **Layers = reuse across functions**

---

If you want, I can give you a **ready-to-use esbuild config + Lambda layer setup** that you can drop into your project.
