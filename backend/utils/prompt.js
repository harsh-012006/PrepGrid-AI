const conceptExplainPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:

- Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
- If the explanation includes a code example, provide a small code block.
- Keep the formatting very clean and clear.
- Return the result as a valid JSON object in the following format:

{
  "title": "Short title here?",
  "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;

const questionAnswerPrompt = (numberOfQuestions, role, experience, topicsToFocus) => `
Generate exactly ${numberOfQuestions} technical interview questions and detailed answers for:
- Job Role: ${role}
- Experience Level: ${experience} years  
- Focus Topics: ${topicsToFocus}

IMPORTANT: Format the output EXACTLY as shown below:

Q1: [First question here?]
A1: [Detailed answer here covering the concept, examples, and best practices]

Q2: [Second question here?]
A2: [Detailed answer here covering the concept, examples, and best practices]

Q3: [Third question here?]
A3: [Detailed answer here covering the concept, examples, and best practices]

Continue this pattern for all ${numberOfQuestions} questions.

Requirements:
- Each answer should be detailed and beginner-friendly
- Include code examples where relevant
- Each answer should be 3-5 sentences minimum
- Format must follow Q#: and A#: pattern exactly
- Do NOT add any introductory text before Q1
- Do NOT add any closing text after A${numberOfQuestions}
`;

// Fallback explanation when API is not available
const generateFallbackExplanation = (question) => {
  const questionLower = question.toLowerCase();
  
  // Extract key concepts from the question
  let title = "Concept Explanation";
  let explanation = "";
  
  if (questionLower.includes("wireframe")) {
    title = "Understanding Wireframes in UI/UX Design";
    explanation = `## What is a Wireframe?

A **wireframe** is a skeletal visual representation of a user interface, typically created in the early stages of design. It focuses on layout, structure, and content placement rather than colors, typography, or visual design elements.

### Why Wireframes Are Crucial

1. **Planning and Structure**: Wireframes help plan the layout and content hierarchy before development begins
2. **Communication**: They provide a clear blueprint for designers, developers, and stakeholders to align on the user interface
3. **User Flow**: Wireframes map out how users will navigate through the interface
4. **Cost-Effective**: Issues can be identified and fixed at the wireframe stage, preventing costly revisions later
5. **Testing**: Low-fidelity wireframes allow for quick user testing and iteration

### Key Benefits

- Save development time and costs
- Clarify information architecture
- Focus on user experience before visual design
- Make it easy to iterate based on feedback`;
  } else if (questionLower.includes("flexbox") || questionLower.includes("css")) {
    title = "CSS Flexbox: A Complete Guide";
    explanation = `## What is CSS Flexbox?

**Flexbox** (Flexible Box Layout) is a CSS layout model that provides an efficient way to arrange, distribute, and align elements within a container, even when their size is unknown or dynamic.

### Key Concepts

1. **Container and Items**: Flexbox works with a flex container and flex items
2. **Main Axis and Cross Axis**: Layout is determined along two axes for flexible control
3. **Flexible Sizing**: Items can grow or shrink to fill available space

### Why Use Flexbox?

- **Responsive Design**: Automatically adapts to different screen sizes
- **Alignment Control**: Easy horizontal and vertical alignment
- **Order Independence**: Change visual order without modifying HTML
- **Dynamic Sizing**: Items adjust based on available space

### Common Properties

- \`display: flex\` - Enables flexbox
- \`flex-direction\` - Sets main axis direction
- \`justify-content\` - Aligns items along main axis
- \`align-items\` - Aligns items along cross axis`;
  } else if (questionLower.includes("promise") || questionLower.includes("async")) {
    title = "Understanding JavaScript Promises and Async/Await";
    explanation = `## What are Promises?

A **Promise** in JavaScript is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

### States of a Promise

1. **Pending**: Initial state, operation hasn't completed
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

### Why Use Promises?

- Handle asynchronous operations elegantly
- Avoid "callback hell" (deeply nested callbacks)
- Chain multiple asynchronous operations
- Better error handling with .catch()

### Async/Await Syntax

Async/await provides cleaner syntax for working with promises:
- \`async\` - Declares an asynchronous function
- \`await\` - Pauses execution until promise resolves
- Try/catch - Handle errors naturally`;
  } else if (questionLower.includes("error") && questionLower.includes("node")) {
    title = "Error Handling in Node.js";
    explanation = `## Error Handling in Node.js

Error handling is crucial in Node.js applications to ensure reliability and provide meaningful feedback when things go wrong.

### Types of Errors in Node.js

1. **Synchronous Errors**: Caught using try-catch blocks
2. **Asynchronous Errors**: Handled via callbacks, promises, or async/await
3. **Operational Errors**: Expected errors (network failures, invalid input)
4. **Programmer Errors**: Bugs in code (undefined variables, type errors)

### Best Practices

**1. Try-Catch for Synchronous Code**
\`\`\`javascript
try {
  const data = JSON.parse(jsonString);
} catch (error) {
  console.error('Parse error:', error.message);
}
\`\`\`

**2. Callback Error-First Pattern**
\`\`\`javascript
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  // Process data
});
\`\`\`

**3. Promise Error Handling**
\`\`\`javascript
fetchData()
  .then(result => processResult(result))
  .catch(error => console.error('Error:', error));
\`\`\`

**4. Async/Await with Try-Catch**
\`\`\`javascript
async function getData() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Re-throw if needed
  }
}
\`\`\`

### Error Handling in Express.js

**Error Middleware:**
\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});
\`\`\`

### Unhandled Errors

Always handle unhandled rejections and uncaught exceptions:
\`\`\`javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Log to monitoring service
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exit gracefully
});
\`\`\`

### Key Takeaways

- Always handle errors, never ignore them
- Use appropriate error handling for sync/async code
- Provide meaningful error messages
- Log errors for debugging
- Use error monitoring services in production`;
  } else if (questionLower.includes("virtual dom") || questionLower.includes("react")) {
    title = "Understanding React's Virtual DOM";
    explanation = `## What is the Virtual DOM?

The **Virtual DOM** is a lightweight JavaScript representation of the actual DOM. React uses it to optimize rendering and improve performance.

### How It Works

1. **Create Virtual DOM**: React creates a virtual representation of the UI
2. **Detect Changes**: When state/props change, a new Virtual DOM is created
3. **Diffing Algorithm**: React compares old and new Virtual DOM trees
4. **Reconciliation**: Only changed elements are updated in the real DOM

### Why Use Virtual DOM?

- **Performance**: Minimizes expensive DOM operations
- **Batching**: Multiple updates are batched together
- **Predictable**: Declarative programming model
- **Cross-platform**: Same code can render to different platforms

### Real DOM vs Virtual DOM

**Real DOM:**
- Slow updates (browser reflow/repaint)
- Direct manipulation is expensive
- Updates entire subtree on changes

**Virtual DOM:**
- Fast in-memory operations
- Efficient diffing algorithm
- Updates only what changed

### Code Example

\`\`\`javascript
// When you write this React code:
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// React:
// 1. Creates Virtual DOM representation
// 2. Detects count changed
// 3. Diffs old vs new Virtual DOM
// 4. Updates only the button text in real DOM
\`\`\`

### Benefits

- Automatic optimization without manual DOM manipulation
- Easier to reason about UI updates
- Foundation for React's component model`;
  } else if (questionLower.includes("closure")) {
    title = "JavaScript Closures Explained";
    explanation = `## What is a Closure?

A **closure** is a function that has access to variables from its outer (enclosing) scope, even after the outer function has finished executing.

### How Closures Work

\`\`\`javascript
function outer() {
  const message = 'Hello';
  
  function inner() {
    console.log(message); // Can access 'message'
  }
  
  return inner;
}

const myFunc = outer();
myFunc(); // Prints: "Hello"
\`\`\`

### Key Concepts

1. **Lexical Scoping**: Functions are executed using the scope chain in effect when they were defined
2. **Persistent Scope**: Inner functions keep references to outer variables
3. **Memory**: Variables in closure are not garbage collected

### Common Use Cases

**1. Data Privacy / Encapsulation**
\`\`\`javascript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.getCount();  // 1
// 'count' cannot be accessed directly
\`\`\`

**2. Event Handlers**
\`\`\`javascript
function setupButton(buttonId) {
  const button = document.getElementById(buttonId);
  const clickCount = 0;
  
  button.onclick = function() {
    clickCount++; // Closure remembers clickCount
    console.log(\`Clicked \${clickCount} times\`);
  };
}
\`\`\`

**3. Callbacks & Async Operations**
\`\`\`javascript
function fetchUserData(userId) {
  const startTime = Date.now();
  
  fetch(\`/api/users/\${userId}\`)
    .then(data => {
      const elapsed = Date.now() - startTime;
      console.log(\`Loaded in \${elapsed}ms\`); // Closure
    });
}
\`\`\`

### Important Notes

- Every function in JavaScript forms a closure
- Closures can lead to memory leaks if not careful
- Useful for module patterns and factory functions`;
  } else if (questionLower.includes("node.js") && (questionLower.includes("what is") || questionLower.includes("use case"))) {
    title = "Node.js: JavaScript Runtime for Server-Side Development";
    explanation = `## What is Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side, outside of a browser.

### Key Features

1. **Asynchronous & Non-Blocking**: Handles multiple operations concurrently
2. **Event-Driven**: Uses event loop for managing operations
3. **Single-Threaded**: Uses one main thread with async operations
4. **Fast**: Built on V8 engine (compiles JS to machine code)
5. **NPM**: Largest package ecosystem with 1M+ packages

### Use Cases

**1. REST APIs & Web Services**
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [...] });
});

app.listen(3000);
\`\`\`

**2. Real-Time Applications**
- Chat applications
- Live notifications
- Collaborative tools
- Gaming servers

**3. Microservices Architecture**
- Lightweight services
- Easy to scale
- Fast startup time

**4. Command-Line Tools**
- Build tools (Webpack, Vite)
- Package managers (npm, yarn)
- Development utilities

**5. Streaming Applications**
- Video/audio streaming
- File uploads
- Data processing pipelines

### Why Choose Node.js?

✅ **Same Language**: Use JavaScript everywhere (frontend + backend)
✅ **Fast Development**: Quick prototyping and iteration
✅ **Scalable**: Handles many concurrent connections efficiently
✅ **Large Ecosystem**: NPM has packages for almost everything
✅ **Active Community**: Large community, lots of resources

### When NOT to Use Node.js

❌ CPU-intensive tasks (video encoding, complex calculations)
❌ Heavy computation requirements
❌ Applications requiring multi-threading

### Popular Node.js Frameworks

- **Express**: Minimal web framework
- **NestJS**: TypeScript framework with architecture
- **Fastify**: High-performance web framework
- **Socket.io**: Real-time bidirectional communication`;
  } else if (questionLower.includes("event loop")) {
    title = "Understanding Node.js Event Loop";
    explanation = `## The Node.js Event Loop

The **event loop** is the core mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

### How It Works

\`\`\`
   ┌───────────────────────────┐
┌─>│           timers          │ (setTimeout, setInterval)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ (I/O callbacks)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ (internal)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │ (retrieve I/O events)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │ (setImmediate)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
\`\`\`

### Phases Explained

1. **Timers**: Executes setTimeout() and setInterval() callbacks
2. **Pending Callbacks**: Executes I/O callbacks deferred to next iteration
3. **Poll**: Retrieves new I/O events and executes I/O callbacks
4. **Check**: Executes setImmediate() callbacks
5. **Close Callbacks**: Executes close event callbacks (e.g., socket.on('close'))

### Microtasks vs Macrotasks

**Microtasks** (higher priority):
- Promise callbacks (.then, .catch, .finally)
- process.nextTick()
- queueMicrotask()

**Macrotasks**:
- setTimeout, setInterval
- setImmediate
- I/O operations

### Example

\`\`\`javascript
console.log('1: Start');

setTimeout(() => console.log('2: setTimeout'), 0);

Promise.resolve().then(() => console.log('3: Promise'));

process.nextTick(() => console.log('4: nextTick'));

console.log('5: End');

// Output:
// 1: Start
// 5: End
// 4: nextTick
// 3: Promise
// 2: setTimeout
\`\`\`

### Key Takeaways

- Single-threaded but handles concurrency through async I/O
- Non-blocking operations are offloaded to system
- Callbacks executed in specific order
- Understanding event loop helps write efficient Node.js code`;
  } else if (questionLower.includes("middleware")) {
    title = "Understanding Middleware in Web Frameworks";
    explanation = `## What is Middleware?

**Middleware** are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.

### How Middleware Works

\`\`\`
Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler → Response
\`\`\`

Each middleware can:
1. Execute code
2. Modify request/response objects
3. End the request-response cycle
4. Call the next middleware with \`next()\`

### Common Use Cases

**1. Logging Middleware**
\`\`\`javascript
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url} - \${new Date().toISOString()}\`);
  next(); // Pass to next middleware
});
\`\`\`

**2. Authentication Middleware**
\`\`\`javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // User is authenticated, proceed
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Use in routes
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

**3. Request Body Parsing**
\`\`\`javascript
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
\`\`\`

**4. CORS Middleware**
\`\`\`javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
\`\`\`

**5. Error Handling Middleware**
\`\`\`javascript
// Must have 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});
\`\`\`

### Middleware Types in Express.js

1. **Application-level**: \`app.use()\` or \`app.METHOD()\`
2. **Router-level**: \`router.use()\` or \`router.METHOD()\`
3. **Built-in**: \`express.json()\`, \`express.static()\`
4. **Third-party**: \`cors()\`, \`morgan()\`, \`helmet()\`
5. **Error-handling**: Special 4-parameter middleware

### Execution Order

Middleware executes in the order it's defined:

\`\`\`javascript
app.use(middleware1); // Runs first
app.use(middleware2); // Runs second
app.get('/route', middleware3, handler); // middleware3 then handler
\`\`\`

### Best Practices

✅ Always call \`next()\` unless you're ending the response
✅ Place error-handling middleware last
✅ Use middleware for cross-cutting concerns (auth, logging, validation)
✅ Keep middleware functions focused and single-purpose
✅ Order matters - place middleware strategically`;
  } else if (questionLower.includes("event delegation")) {
    title = "JavaScript Event Delegation Explained";
    explanation = `## What is Event Delegation?

**Event delegation** is a technique where you attach a single event listener to a parent element instead of attaching listeners to multiple child elements. It leverages event bubbling to handle events efficiently.

### How Event Bubbling Works

When an event occurs on an element, it first runs handlers on that element, then on its parent, then all the way up to the document:

\`\`\`
<div> (grandparent)
  <ul> (parent)
    <li>Item 1</li> (child - event triggers here)
    <li>Item 2</li>
  </ul>
</div>

Click on Item 1 → Bubbles to <ul> → Bubbles to <div> → Bubbles to document
\`\`\`

### Without Event Delegation (Inefficient)

\`\`\`javascript
// BAD: Attaching listener to each item
const items = document.querySelectorAll('li');
items.forEach(item => {
  item.addEventListener('click', (e) => {
    console.log('Clicked:', e.target.textContent);
  });
});

// Problems:
// - Multiple listeners (memory intensive)
// - New items won't have listeners
// - Hard to manage
\`\`\`

### With Event Delegation (Efficient)

\`\`\`javascript
// GOOD: Single listener on parent
const list = document.querySelector('ul');
list.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('Clicked:', e.target.textContent);
  }
});

// Benefits:
// - One listener for all items
// - Works with dynamically added items
// - Better performance
\`\`\`

### Real-World Example: Todo List

\`\`\`javascript
const todoList = document.getElementById('todo-list');

// Delegate events for delete and complete buttons
todoList.addEventListener('click', (e) => {
  // Check if delete button was clicked
  if (e.target.classList.contains('delete-btn')) {
    const todoItem = e.target.closest('.todo-item');
    todoItem.remove();
  }
  
  // Check if complete checkbox was clicked
  if (e.target.classList.contains('complete-checkbox')) {
    const todoItem = e.target.closest('.todo-item');
    todoItem.classList.toggle('completed');
  }
});

// Add new todos dynamically - they automatically work!
function addTodo(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = \`
    <input type="checkbox" class="complete-checkbox">
    <span>\${text}</span>
    <button class="delete-btn">Delete</button>
  \`;
  todoList.appendChild(li);
}
\`\`\`

### When to Use Event Delegation

✅ **Use when:**
- You have many similar child elements
- Elements are added/removed dynamically
- You want better performance
- Managing events for lists, tables, or grids

❌ **Avoid when:**
- You need to handle events on specific unique elements
- Event shouldn't bubble (some events don't bubble)
- The parent element is very far from children (performance)

### Common Pitfalls

1. **Not checking the target**: Always verify e.target matches your selector
2. **Forgetting stopPropagation**: Sometimes you need to stop bubbling
3. **Using on elements too far apart**: Keep parent reasonably close

### Key Benefits

- **Performance**: One listener vs many
- **Memory Efficient**: Less memory usage
- **Dynamic Content**: Works with elements added later
- **Cleaner Code**: Easier to maintain`;
  } else if (questionLower.includes("let") && questionLower.includes("const") && questionLower.includes("var")) {
    title = "Understanding var, let, and const in JavaScript";
    explanation = `## var, let, and const: Key Differences

JavaScript has three ways to declare variables, each with different scoping and behavior rules.

### Quick Comparison Table

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function | Block | Block |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassignment | Yes | Yes | No |
| Redeclaration | Yes | No | No |
| Global Object | Yes | No | No |

### 1. var (Old Way - Avoid)

**Function-scoped** and has confusing behavior:

\`\`\`javascript
function example() {
  var x = 1;
  if (true) {
    var x = 2; // Same variable!
    console.log(x); // 2
  }
  console.log(x); // 2 (modified)
}

// Hoisting issue
console.log(y); // undefined (not error!)
var y = 5;

// Becomes:
var y;
console.log(y);
y = 5;
\`\`\`

### 2. let (Modern - Use for changing values)

**Block-scoped** with better behavior:

\`\`\`javascript
function example() {
  let x = 1;
  if (true) {
    let x = 2; // Different variable!
    console.log(x); // 2
  }
  console.log(x); // 1 (unchanged)
}

// Temporal Dead Zone (TDZ)
console.log(y); // ReferenceError!
let y = 5;

// Can reassign
let count = 0;
count = 1; // OK
count++; // OK
\`\`\`

### 3. const (Modern - Use by default)

**Block-scoped** and cannot be reassigned:

\`\`\`javascript
const PI = 3.14159;
PI = 3.14; // TypeError!

// But object properties CAN change
const user = { name: 'John' };
user.name = 'Jane'; // OK
user.age = 25; // OK
user = {}; // TypeError!

// Arrays can be modified
const numbers = [1, 2, 3];
numbers.push(4); // OK
numbers = []; // TypeError!
\`\`\`

### Best Practices

1. **Default to \`const\`**: Use for values that won't be reassigned
2. **Use \`let\`**: When you need to reassign (counters, accumulators)
3. **Avoid \`var\`**: Only use for legacy code compatibility

\`\`\`javascript
// GOOD
const maxUsers = 100;
const apiUrl = 'https://api.example.com';

let currentPage = 1;
for (let i = 0; i < 10; i++) {
  // let is perfect for loop counters
}

// BAD
var totalCount = 0; // Use let instead
\`\`\`

### Common Pitfalls

\`\`\`javascript
// 1. const doesn't make objects immutable
const config = { debug: true };
config.debug = false; // This works!

// To freeze:
const frozenConfig = Object.freeze({ debug: true });
frozenConfig.debug = false; // Silently fails (strict mode: error)

// 2. Loop variables with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 (var is function-scoped)

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2 (let creates new binding each iteration)
\`\`\`

### Summary

- **const**: Immutable binding, use by default
- **let**: Mutable binding, use when needed
- **var**: Legacy, avoid in modern code`;
  } else if (questionLower.includes("rest api") || (questionLower.includes("http") && questionLower.includes("method"))) {
    title = "REST API and HTTP Methods Explained";
    explanation = `## What is a REST API?

**REST** (Representational State Transfer) is an architectural style for designing networked applications. A REST API uses HTTP methods to perform CRUD operations on resources.

### Core Principles of REST

1. **Client-Server**: Separation of concerns
2. **Stateless**: Each request contains all needed information
3. **Cacheable**: Responses must define if they're cacheable
4. **Uniform Interface**: Consistent way to interact with resources
5. **Layered System**: Client doesn't know if connected directly to server

### HTTP Methods (Verbs)

**1. GET - Retrieve Data**
\`\`\`javascript
// Read all users
GET /api/users
Response: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// Read single user
GET /api/users/1
Response: { id: 1, name: 'John', email: 'john@example.com' }

// GET is idempotent (same result every time)
// GET should never modify data
\`\`\`

**2. POST - Create New Resource**
\`\`\`javascript
// Create new user
POST /api/users
Body: { name: 'Alice', email: 'alice@example.com' }
Response: { id: 3, name: 'Alice', email: 'alice@example.com' }

// POST is NOT idempotent (creates new resource each time)
\`\`\`

**3. PUT - Update Entire Resource**
\`\`\`javascript
// Replace entire user
PUT /api/users/1
Body: { name: 'John Updated', email: 'john.new@example.com' }
Response: { id: 1, name: 'John Updated', email: 'john.new@example.com' }

// PUT is idempotent (same result if repeated)
// Must send complete resource
\`\`\`

**4. PATCH - Partial Update**
\`\`\`javascript
// Update only specific fields
PATCH /api/users/1
Body: { email: 'newemail@example.com' }
Response: { id: 1, name: 'John', email: 'newemail@example.com' }

// PATCH is idempotent
// Only send fields to update
\`\`\`

**5. DELETE - Remove Resource**
\`\`\`javascript
// Delete user
DELETE /api/users/1
Response: { message: 'User deleted successfully' }

// DELETE is idempotent
// Subsequent calls return same result (404 or 204)
\`\`\`

### HTTP Status Codes

**Success (2xx)**
- **200 OK**: Request succeeded
- **201 Created**: Resource created (POST)
- **204 No Content**: Succeeded but no response body (DELETE)

**Client Errors (4xx)**
- **400 Bad Request**: Invalid data sent
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but no permission
- **404 Not Found**: Resource doesn't exist

**Server Errors (5xx)**
- **500 Internal Server Error**: Server crashed
- **503 Service Unavailable**: Server overloaded

### RESTful API Design Example

\`\`\`javascript
// Express.js REST API
const express = require('express');
const app = express();

app.use(express.json());

// GET - Read all
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// GET - Read one
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
});

// POST - Create
app.post('/api/posts', (req, res) => {
  const newPost = { id: Date.now(), ...req.body };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT - Update entire
app.put('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  posts[index] = { id: req.params.id, ...req.body };
  res.json(posts[index]);
});

// PATCH - Partial update
app.patch('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: 'Not found' });
  Object.assign(post, req.body);
  res.json(post);
});

// DELETE - Remove
app.delete('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  posts.splice(index, 1);
  res.status(204).send();
});
\`\`\`

### Best Practices

✅ Use nouns for endpoints: \`/users\` not \`/getUsers\`
✅ Use plural nouns: \`/users\` not \`/user\`
✅ Use proper HTTP methods
✅ Return appropriate status codes
✅ Version your API: \`/api/v1/users\`
✅ Use filtering: \`/users?role=admin&active=true\`
✅ Implement pagination: \`/users?page=2&limit=20\``;
  } else if (questionLower.includes("jwt") || questionLower.includes("json web token")) {
    title = "JWT (JSON Web Token) Authentication";
    explanation = `## What is JWT?

**JSON Web Token (JWT)** is a compact, URL-safe means of representing claims to be transferred between two parties. It's commonly used for stateless authentication.

### JWT Structure

A JWT consists of three parts separated by dots:
\`\`\`
header.payload.signature
\`\`\`

**Example JWT:**
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0IiwibmFtZSI6IkpvaG4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
\`\`\`

### Three Parts Explained

**1. Header** (Algorithm & Token Type)
\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

**2. Payload** (Claims/Data)
\`\`\`json
{
  "userId": "1234",
  "name": "John",
  "role": "admin",
  "exp": 1735689600
}
\`\`\`

**3. Signature** (Verify authenticity)
\`\`\`
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
\`\`\`

### How JWT Authentication Works

\`\`\`
1. Client → POST /login (username, password)
2. Server → Verify credentials
3. Server → Generate JWT with user info
4. Server → Return JWT to client
5. Client → Store JWT (localStorage/cookie)
6. Client → Send JWT in Authorization header
7. Server → Verify JWT signature
8. Server → Extract user info from payload
9. Server → Process request
\`\`\`

### Implementation Example

**Creating JWT (Node.js)**
\`\`\`javascript
const jwt = require('jsonwebtoken');

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verify credentials
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ token, user: { id: user._id, email: user.email } });
});
\`\`\`

**Verifying JWT (Middleware)**
\`\`\`javascript
const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer '
  
  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

**Client-Side Usage**
\`\`\`javascript
// Store token after login
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token } = await response.json();
localStorage.setItem('token', token);

// Use token in subsequent requests
const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/profile', {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  return response.json();
};
\`\`\`

### JWT Claims (Payload Fields)

**Registered Claims:**
- **iss** (issuer): Who issued the token
- **sub** (subject): Subject of token (user ID)
- **aud** (audience): Intended recipient
- **exp** (expiration): Expiration timestamp
- **iat** (issued at): When token was created
- **nbf** (not before): Token not valid before this time

**Custom Claims:**
Add any data you need (userId, role, email, etc.)

### Security Best Practices

✅ **Use strong secret**: Long, random secret key
✅ **Set expiration**: Tokens should expire (15min - 7 days)
✅ **HTTPS only**: Never send JWT over HTTP
✅ **Don't store sensitive data**: JWT is encoded, not encrypted
✅ **Validate on server**: Always verify signature
✅ **Use refresh tokens**: For long-lived sessions
✅ **Implement token blacklist**: For logout functionality

### JWT vs Sessions

**JWT Advantages:**
- Stateless (no server storage)
- Scalable (no session store needed)
- Mobile-friendly
- Cross-domain auth

**Session Advantages:**
- Can revoke immediately
- Less data sent with each request
- Sensitive data stays on server

### Common Pitfalls

❌ Storing JWT in localStorage (XSS vulnerable)
❌ No expiration time
❌ Including sensitive data in payload
❌ Weak or hardcoded secret
❌ Not validating token on every request`;
  } else {
    // Generic explanation for unknown topics
    explanation = `## Understanding the Topic

"${question}"

This is an important concept in web development. To get a comprehensive explanation of this topic:

1. Try again in a few moments when the service becomes available
2. Check documentation related to the topic
3. Review related tutorials and guides

### General Tips for Learning

- Break down complex topics into smaller components
- Practice with real examples and code
- Test your understanding by implementing solutions
- Refer to official documentation`;
  }
  
  return {
    title,
    explanation
  };
};

// Fallback questions when API is unavailable
const generateFallbackQuestions = (numberOfQuestions, role, topicsToFocus) => {
  const allQuestions = [
    // Frontend Developer & Node.js
    { question: "What is the difference between let, const, and var in JavaScript?", answer: "let and const are block-scoped while var is function-scoped. const variables cannot be reassigned while let can. var is hoisted to the top of the function scope. Use const by default, let when reassignment is needed, and avoid var.", topics: ["javascript", "react", "node.js", "frontend"] },
    { question: "Explain the concept of closures in JavaScript.", answer: "A closure is a function that has access to variables from its outer scope even after that scope has executed. Closures are created every time a function is created. They're useful for data privacy and callback functions.", topics: ["javascript", "react", "node.js"] },
    { question: "What is the virtual DOM in React?", answer: "The virtual DOM is an in-memory representation of the real DOM. React uses it to compare changes and update only the parts that changed. This improves performance by reducing direct DOM manipulation.", topics: ["react", "frontend"] },
    { question: "How do React hooks work?", answer: "Hooks are functions that let you 'hook into' React state and lifecycle features. Common hooks include useState for state management and useEffect for side effects. Hooks must be called at the top level of components.", topics: ["react", "frontend"] },
    { question: "What is CSS Flexbox and when should you use it?", answer: "Flexbox is a CSS layout model for arranging elements in a container. Use it for one-dimensional layouts like navbars, centering content, or responsive designs. It provides easy alignment and distribution of space.", topics: ["css", "frontend", "react"] },
    { question: "Explain CSS Grid and its use cases.", answer: "CSS Grid is a 2D layout system for creating complex grid structures. Use it for multi-dimensional layouts like page layouts with header, sidebar, and main content. It's powerful for responsive designs.", topics: ["css", "frontend"] },
    { question: "What is event delegation?", answer: "Event delegation is a technique where you attach an event listener to a parent element instead of individual child elements. Events bubble up, so you can handle them at the parent level. This improves performance for dynamic lists.", topics: ["javascript", "frontend", "react"] },
    { question: "How does async/await work in JavaScript?", answer: "Async/await is syntactic sugar for promises. An async function returns a promise. The await keyword pauses execution until a promise resolves. It makes asynchronous code look synchronous and easier to read.", topics: ["javascript", "async", "node.js", "react"] },
    { question: "What is Node.js and what are its use cases?", answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows server-side JavaScript execution. Use cases include REST APIs, real-time applications, microservices, and command-line tools.", topics: ["node.js", "backend", "javascript"] },
    { question: "Explain the event loop in Node.js.", answer: "The event loop is Node.js's core mechanism for handling asynchronous operations. It manages callbacks, microtasks, and timers. Understanding the event loop is crucial for writing efficient Node.js applications.", topics: ["node.js", "javascript", "async"] },
    { question: "What is Express.js and how is it used?", answer: "Express.js is a minimal and flexible Node.js web application framework. It provides routing, middleware support, and HTTP utilities. It's the most popular framework for building REST APIs with Node.js.", topics: ["node.js", "backend", "express"] },
    { question: "What is REST API and what are HTTP methods?", answer: "REST is an architectural style using HTTP methods: GET (retrieve), POST (create), PUT (update), DELETE (remove), PATCH (partial update). REST APIs are stateless and cacheable, making them scalable.", topics: ["node.js", "backend", "api", "rest"] },
    { question: "Explain the concept of middleware in web frameworks.", answer: "Middleware are functions that process requests between client and response. They can modify requests/responses, authenticate users, log data, and handle errors. They execute in the order they're defined.", topics: ["node.js", "backend", "express", "middleware"] },
    { question: "What is database normalization?", answer: "Normalization is the process of organizing database tables to reduce redundancy. It involves dividing data into logical tables and establishing relationships through foreign keys. It improves data integrity and query performance.", topics: ["node.js", "backend", "database", "sql"] },
    { question: "What are indexes in databases?", answer: "Indexes are data structures that improve query performance by creating a fast lookup mechanism. Primary keys are automatically indexed. Additional indexes can be created on frequently searched columns.", topics: ["node.js", "backend", "database", "performance"] },
    { question: "Explain the difference between SQL and NoSQL databases.", answer: "SQL databases are relational with structured schemas and ACID transactions. NoSQL databases are flexible with various data models (document, key-value, graph). Choose SQL for structured data, NoSQL for flexible/large-scale data.", topics: ["node.js", "backend", "database", "mongodb"] },
    { question: "What is JWT (JSON Web Token) and how does it work?", answer: "JWT is a stateless authentication token containing encoded claims. It has three parts: header, payload, and signature. The server verifies the signature to authenticate requests without storing session data.", topics: ["node.js", "backend", "authentication", "jwt"] },
    { question: "What is the purpose of environment variables?", answer: "Environment variables store sensitive data like API keys and database passwords outside of code. They allow different configurations for development, testing, and production without changing code.", topics: ["node.js", "backend", "security"] },
    { question: "Explain the concept of caching and its benefits.", answer: "Caching stores frequently accessed data in faster storage. It reduces database queries, improves response times, and decreases server load. Redis and memcached are popular caching solutions.", topics: ["node.js", "backend", "performance", "redis"] },
    { question: "How do you handle errors in Node.js?", answer: "Error handling in Node.js uses try-catch blocks, error callbacks, and promise rejection handling. Always handle errors in callbacks and promise chains to prevent unhandled rejections.", topics: ["node.js", "javascript", "error-handling"] }
  ];

  // Filter questions based on topics if provided
  let filteredQuestions = allQuestions;
  if (topicsToFocus) {
    const topics = topicsToFocus.toLowerCase().split(',').map(t => t.trim());
    filteredQuestions = allQuestions.filter(q => 
      q.topics.some(topic => 
        topics.some(userTopic => topic.includes(userTopic) || userTopic.includes(topic))
      )
    );
  }

  // If no questions match the filter, return all questions
  if (filteredQuestions.length === 0) {
    filteredQuestions = allQuestions;
  }

  // Shuffle and return requested number of questions
  const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
  const resultCount = Math.min(numberOfQuestions, shuffled.length);
  const result = [];
  for (let i = 0; i < resultCount; i++) {
    result.push(shuffled[i]);
  }
  
  return result;
};

module.exports = { questionAnswerPrompt, conceptExplainPrompt, generateFallbackExplanation, generateFallbackQuestions };
