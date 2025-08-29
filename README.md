# BFHL Classifier API (Node/Express)

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7?logo=render)

A minimal, production-ready REST API that classifies mixed inputs (numbers, letters, special characters), computes summaries, and returns a response in a strict format for the **BFHL** challenge.

> **Live Health URL**: `https://bfhl-classifier-syedomar.onrender.com/`
> **API Endpoint**: `POST https://bfhl-classifier-syedomar.onrender.com/bfhl`

---

## ✨ Features

* **Strict response contract** required by the challenge
* **Token classification**: even, odd, alphabets (uppercased), specials
* **Sum of numeric tokens** returned **as a string**
* **Concatenation** of *all alphabetic characters* (from every token), **reversed**, with **alternating caps** (starts UPPER)
* **CORS enabled** — easy to call from a frontend
* **Graceful errors**: returns `is_success: false` with helpful messages
* **Stateless** — **no database required** (optional logging possible)

---

## 🧠 What it does (Rules)

* A token is treated as a **number** if it matches `^-?\d+$` — supports negatives, no `+`, no spaces.

  * Even/odd decided on `abs(n) % 2`.
  * Numbers are **returned as strings**.
* A token is treated as **alphabetic** if it matches `^[A-Za-z]+$`.

  * Returned uppercased **as whole tokens** in the `alphabets` array.
* Otherwise, the token goes to **`special_characters`** (e.g., `"abc123"`, `"$"`, `"7A"`, whitespace, etc.).
* `concat_string` is built from **every alphabetic character** found **anywhere** in the input, reversed, then alternating caps (Upper, lower, Upper, ...).
* `user_id` is built as `full_name_ddmmyyyy`, all **lowercase**, spaces → underscores.

---

## 📦 Tech Stack

* **Node.js** + **Express**
* **CORS** for cross-origin support
* Hosted on **Render** (Web Service)

---

## 📁 Project Structure

```
.
├─ server.js          # Express app + /bfhl route
├─ package.json       # Dependencies & scripts
├─ .gitignore         # node_modules, .env
└─ README.md          # This file
```

---

## 🔧 Setup & Local Development

### 1) Prerequisites

* Node.js LTS (v18+ recommended) — `node -v`

### 2) Install

```bash
npm install
```

### 3) (Optional) Environment variables

Set your identity values (used to build `user_id` and return email/roll):

* `FULL_NAME` — e.g., `syed omar albeez`
* `DOB_DDMMYYYY` — e.g., `17091999`
* `EMAIL` — e.g., `syedomar.albeez2022@vitstudent.ac.in`
* `ROLL_NUMBER` — e.g., `22BCE1107`

**bash/zsh:**

```bash
export FULL_NAME="syed omar albeez"
export DOB_DDMMYYYY="17091999"
export EMAIL="syedomar.xyz2022@vitstudent.ac.in"
export ROLL_NUMBER="22BCE11xx"
```

**PowerShell:**

```powershell
$env:FULL_NAME="syed omar albeez"
$env:DOB_DDMMYYYY="17091999"
$env:EMAIL="syedomar.xyz2022@vitstudent.ac.in"
$env:ROLL_NUMBER="22BCE11xx"
```

### 4) Run

```bash
npm start     # runs server.js on PORT=3000 by default
```

**Health check:** open `http://localhost:3000/`
**API:** `POST http://localhost:3000/bfhl`

---

## 🚀 Deploy to Render (Free)

1. **Push code to GitHub** (public repo)
2. On **Render** → **New** → **Web Service** → connect your repo
3. **Environment**: Node
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add **Environment Variables** on Render:

   * `FULL_NAME`, `DOB_DDMMYYYY`, `EMAIL`, `ROLL_NUMBER`
7. Deploy → verify health: `https://<your-app>.onrender.com/`
8. Test API: `https://<your-app>.onrender.com/bfhl`

> 🔎 **Note**: A browser uses **GET** — `/bfhl` accepts **POST** only. Use curl/Postman.

---

## 📡 API Reference

### `GET /`

Health endpoint.

**Response**

```json
{
  "ok": true,
  "message": "BFHL API is healthy. POST /bfhl to use."
}
```

---

### `POST /bfhl`

Classify tokens and compute outputs.

**Request Headers**

```
Content-Type: application/json
```

**Request Body**

```json
{
  "data": ["a", "1", "334", "4", "R", "$"]
}
```

**Response** (example)

```json
{
  "is_success": true,
  "user_id": "syed_omar_albeez_17091999",
  "email": "syedomar.xyz@vitstudent.ac.in",
  "roll_number": "22BCE11xx",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

**Response Schema**

* `is_success`: boolean
* `user_id`: `full_name_ddmmyyyy`, lowercase, spaces → underscores
* `email`: string
* `roll_number`: string
* `odd_numbers`: string\[]
* `even_numbers`: string\[]
* `alphabets`: string\[] (tokens uppercased)
* `special_characters`: string\[]
* `sum`: string (sum of numeric tokens)
* `concat_string`: string (see rules above)

---

## 🧪 Quick Testing

### Curl (macOS/Linux)

```bash
curl -X POST "https://<your-app>.onrender.com/bfhl" \
  -H "Content-Type: application/json" \
  -d '{"data":["2","a","y","4","&","-","*","5","92","b"]}'
```

### Curl (Windows, use `curl.exe`)

```bat
curl.exe -X POST "https://<your-app>.onrender.com/bfhl" ^
  -H "Content-Type: application/json" ^
  -d "{\"data\":[\"a\",\"1\",\"334\",\"4\",\"R\",\"$\"]}"
```

### PowerShell

```powershell
$body = @{ data = @("a","1","334","4","R","$") } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://<your-app>.onrender.com/bfhl" -ContentType "application/json" -Body $body
```

### Postman / Hoppscotch

* Method: **POST**
* URL: `https://<your-app>.onrender.com/bfhl`
* Headers: `Content-Type: application/json`
* Body → **Raw** → **JSON**:

```json
{ "data": ["A","ABcD","DOE"] }
```

Expect:

```json
{
  "alphabets": ["A","ABCD","DOE"],
  "even_numbers": [],
  "odd_numbers": [],
  "special_characters": [],
  "sum": "0",
  "concat_string": "EoDdCbAa",
  "is_success": true,
  "user_id": "syed_omar_albeez_17091999",
  "email": "syedomar.xyz@vitstudent.ac.in",
  "roll_number": "22BCE11xx"
}
```

---

## 🧰 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

* `npm start` – run in production mode
* `npm run dev` – auto-restart on file changes (requires `nodemon`)

---

## 📝 Error Handling & Status Codes

* For this challenge, the API **always returns 200** (OK) with `is_success` indicating success/failure.
* Invalid payload example:

```json
{
  "is_success": false,
  "error": "Invalid payload: 'data' must be an array of strings."
}
```

## ❓ FAQ

**Why does `/bfhl` say `Cannot GET /bfhl` in the browser?**
Because `/bfhl` only accepts **POST**. Use curl/Postman or a frontend making POST requests.

**How is `concat_string` built exactly?**
Take **all alphabetic characters** from every input token, reverse the list, then apply **alternating caps** starting with **UPPER**.

---

---

## 🙌 Acknowledgements

* Built for the BFHL challenge — designed to be simple, readable, and deployable in minutes.
