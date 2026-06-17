# 🧮 Calculator App

A sleek, dark-themed calculator built with vanilla HTML, CSS, and JavaScript: featuring a custom button grid, keyboard support, and advanced math operations. Built as part of my Frontend Development Internship at **CodeAlpha**.

---

## 🔗 Live Demo

> _https://codealpha-calculator-beta.vercel.app/_



---

## ✨ Features

- Full arithmetic: addition, subtraction, multiplication, division
- Advanced operations: square (`x²`), square root (`√`), percentage (`%`)
- Sign toggle (`+/-`) for positive/negative switching
- Backspace key to delete the last character
- Expression history shown above the result
- Divide-by-zero error handling
- Keyboard input support (numbers, operators, Enter, Backspace, Escape)
- Button press animation on both click and keyboard input
- Comma-formatted output (e.g., `1,000,000`)
- Responsive design for mobile screens

---

## 🗂️ Project Structure

```
CodeAlpha_Calculator/
├── index.html        # App markup and button layout
├── css/
│   └── style.css     # Dark theme, grid layout, animations
└── js/
    └── script.js     # All calculator logic
```

---

## 🧠 JavaScript Logic: Deep Dive

The entire app runs on a single `expression` string variable that acts as the live state of the calculation.

### Core State

```js
let expression = "";
```

Every button press either appends to, modifies, or evaluates this string. The display always reflects the current state of `expression`.

---

### `main()` — Entry Point

Initializes all event listeners:

- Loops over every `.btn` element and reads its `data-*` attribute to determine what action to trigger.
- Sets up a `keydown` listener on `document` for keyboard input.

```js
btns.forEach((btn) => {
    btn.addEventListener("click", () => {
        // Reads data-num, data-action, data-clear, data-signFlip, data-equals, data-backspace
    });
});
```

---

### `appendValue(val)` — Number Input

Appends a digit or decimal point to `expression`.

**Decimal guard:** Before adding `.`, it splits `expression` by operators and checks whether the last number segment already contains a decimal point. If it does, the `.` is ignored; preventing invalid values like `3.1.4`.

```js
const parts = expression.split(/[\+\-\*\/]/);
const lastPart = parts[parts.length - 1];
if (lastPart.includes('.')) return;
```

---

### `appendOperator(op)` — Operator Input

Appends `+`, `-`, `*`, or `/` to `expression`.

**Guard 1:** Does nothing if `expression` is empty.

**Guard 2:** If the last character is already an operator, it replaces it with the new one; so pressing `+` then `-` gives `-`, not `+-`.

```js
if (['+', '-', '*', '/'].includes(lastChar)) {
    expression = expression.slice(0, -1) + op;
}
```

The `%` key is routed to `percentage()` instead of being appended directly.

---

### `calculate()` — Evaluate Expression

Uses JavaScript's native `eval()` to compute the result.

**Guards before evaluation:**
1. Expression is empty → return
2. Last character is an operator → return (incomplete expression)
3. Expression includes `/0` → shows "Error" and resets

**After evaluation:**
- Saves the expression into `#history` with `×` / `÷` symbols for display
- Triggers a CSS fade-in animation on the history element using a DOM reflow trick:
  ```js
  historyDisplay.classList.remove("fade-in-effect");
  void historyDisplay.offsetWidth; // forces reflow to restart animation
  historyDisplay.classList.add("fade-in-effect");
  ```
- Formats the result with `toLocaleString()` for comma separation
- Sets `expression` to the raw result string so calculations can continue chaining

---

### `deleteLast()` — Backspace

Removes the last character from `expression` using `slice(0, -1)`, then updates the display.

---

### `clearAll()` — Reset

Resets `expression` to `""`, clears the history display, and calls `updateDisplay()` which shows `"0"`.

---

### `toggleSign()` — Positive / Negative

Uses a regex to find the last number in the expression:

```js
const match = expression.match(/(-?\d+\.?\d*)$/);
```

If found, it checks whether the number already starts with `-`. If yes, removes the sign. If no, prepends `-`.

This correctly handles expressions like `10+5` → targets `5` and flips it to `-5`, giving `10+-5`.

---

### `percentage()` — Percentage Conversion

Evaluates the current expression, divides the result by `100`, and sets that as the new expression.

```js
expression = (currentVal / 100).toString();
```

Useful for quick percentage calculations — e.g., `50` → `0.5`.

---

### `calculateSquareRoot()` — √

Evaluates the current expression and applies `Math.sqrt()`.

```js
expression = Math.sqrt(eval(expression)).toString();
```

Displays `NaN` protection via try/catch. Results feed back into `expression` so they can be chained into further operations.

---

### `calculateSquare()` — x²

Evaluates the current expression and applies `Math.pow(value, 2)`.

```js
expression = Math.pow(eval(expression), 2).toString();
```

Same chaining behavior as square root.

---

### `updateDisplay()` — Render Expression

Replaces raw `*` and `/` in `expression` with the display symbols `×` and `÷` before rendering:

```js
let formattedDisplay = expression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
resultDisplay.innerText = formattedDisplay || "0";
```

This keeps the internal expression valid for `eval()` while showing clean symbols to the user.

---

### `btnBlinkOnKeyboardInput(key, dataName)` — Keyboard Visual Feedback

When the user presses a key, this function finds the matching button in the DOM and briefly adds the `btn-pressed` class to simulate a click animation.

Handles key mapping for `*` → `×` and `/` → `÷` since the data attributes use symbol characters.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0–9` | Input digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operator |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last character |
| `Escape` | Clear all |
| `%` | Convert to percentage |

---

## 🎨 Design Highlights

- **Color palette:** Dark background (`#0f0f0f`) with amber accents (`#ffa726`)
- **Font:** JetBrains Mono for a developer-aesthetic monospace look
- **Glow effect:** Amber box-shadow on the display for a neon terminal feel
- **Grid layout:** CSS Grid with `repeat(5, 1fr)` for the 5-column button panel
- **Special button spans:** `0` and `=` span two columns using `grid-column`; `x²` spans two rows
- **Hover effects:** Only apply on non-touch devices using `@media (hover: hover)`
- **Mobile responsive:** Layout and font sizes scale down below `600px`

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| HTML5 | Structure and button layout |
| CSS3 | Dark theme, grid, animations, responsive |
| JavaScript (ES6+) | All calculator logic, DOM manipulation |
| JetBrains Mono | Monospace display font via Fontshare CDN |

---

## 🔮 Future Enhancements

To further elevate the calculator into a full-featured premium utility, the following roadmap highlights planned improvements:

* **Scientific Mode:** Integrate complex mathematical functions such as Trigonometry (`sin`, `cos`, `tan`), Logarithms (`log`, `ln`), and Pi (`π`) constants.
* **Calculation History Log:** Add a dedicated, scrollable sidebar or modal overlay to store and review past calculations.
* **Theme Customization:** Introduce a dynamic theme switcher supporting Dark, Light, and Cyberpunk/Neon OLED modes.
* **Responsive Sound Effects:** Implement subtle, high-fidelity tactile audio feedback or haptic clicks for mobile interactions.
* **Advanced Memory Keys:** Deploy traditional memory functions (`M+`, `M-`, `MR`, `MC`) for advanced algebraic tracking.

## 🚀 Getting Started

No build tools or dependencies required.

```bash
git clone https://github.com/Saqib216/CodeAlpha_Calculator.git
cd calculator-app
# Open index.html in your browser
```

Or just open `index.html` directly in any modern browser.

---

## 👨‍💻 Author

**Muhammad Saqib Hussnain** |
Frontend Development Intern @ CodeAlpha
- [GitHub](https://github.com/Saqib216)
- [LinkedIn](https://www.linkedin.com/in/saqib-hussnain) 
- [Instagram](https://instagram.com/itx.saqib.hussnain)


---

## 📄 License

This project is open source and available for educational and personal use.