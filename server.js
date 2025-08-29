// server.js
const express = require("express");
const cors = require("cors");

function toUserId(fullName, dobDDMMYYYY) {
  const name = String(fullName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  return `${name}_${dobDDMMYYYY}`;
}

function isPureIntegerString(s) {
  return /^-?\d+$/.test(s);
}

function isPureAlphaString(s) {
  return /^[A-Za-z]+$/.test(s);
}

function splitDataTokens(dataArray) {
  const odd = [];
  const even = [];
  const alpha = [];
  const special = [];

  let sum = 0;
  const letters = [];

  for (const raw of dataArray) {
    const s = String(raw); 
    for (const ch of s) {
      if (/[A-Za-z]/.test(ch)) letters.push(ch);
    }

    if (isPureIntegerString(s)) {
      const n = parseInt(s, 10);
      sum += n;
      if (Math.abs(n) % 2 === 0) even.push(s);
      else odd.push(s);
    } else if (isPureAlphaString(s)) {
      alpha.push(s.toUpperCase());
    } else {
      special.push(s);
    }
  }
  letters.reverse();
  const concatChars = letters.map((ch, idx) =>
    idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
  );
  const concat_string = concatChars.join("");

  return {
    odd_numbers: odd,
    even_numbers: even,
    alphabets: alpha,
    special_characters: special,
    sum: String(sum),
    concat_string,
  };
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "BFHL API is healthy. POST /bfhl to use.",
  });
});

// Core route
app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body || {};
    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        error: "Invalid payload: 'data' must be an array of strings.",
      });
    }

    // Pull user metadata from env
    const FULL_NAME = process.env.FULL_NAME || "syed omar albeez";
    const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "17091999"; 
    const EMAIL = process.env.EMAIL || "syedomar.albeez2022@vitstudent.ac.in";
    const ROLL = process.env.ROLL_NUMBER || "22BCE1107";

    const result = splitDataTokens(data);

    return res.status(200).json({
      is_success: true,
      user_id: toUserId(FULL_NAME, DOB_DDMMYYYY),
      email: EMAIL,
      roll_number: ROLL,
      ...result,
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      error: "Internal error processing request.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API listening on port ${PORT}`);
});
