let expression = ""; 

const resultDisplay = document.getElementById("result");
const historyDisplay = document.getElementById("history");
const btns = document.querySelectorAll(".btn");

function main() {
    btns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const num = btn.dataset.num;
            let op = btn.dataset.action;
            const clear = btn.dataset.clear;
            const signFlip = btn.dataset.signflip || btn.dataset.signFlip;
            const equals = btn.dataset.equals;
            const backspace = btn.dataset.backspace;

            if (num !== undefined) appendValue(num);
            else if (op) {
                if (op === '√') {
                    calculateSquareRoot();
                }
                else if (op === 'sq') {
                    calculateSquare();
                }
                else {
                    if (op === '÷') op = '/';
                    if (op === '×') op = '*';
                    appendOperator(op);
                }
            }
            else if (clear) clearAll();
            else if (signFlip) toggleSign();
            else if (equals) calculate();
            else if (backspace) deleteLast();

            btn.classList.add("btn-pressed");
            setTimeout(() => {
                btn.classList.remove("btn-pressed");
            }, 80); 
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key >= '0' && e.key <= '9') {
            appendValue(e.key);
            btnBlinkOnKeyboardInput(e.key, 'num');
        }

        if (e.key === '.') {
            appendValue('.');
            btnBlinkOnKeyboardInput(e.key, 'num');
        };

        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            appendOperator(e.key);
            btnBlinkOnKeyboardInput(e.key, 'action');
        }

        if (e.key === 'Enter' || e.key === '=') calculate();
        if (e.key === 'Backspace') deleteLast();
        if (e.key === 'Escape') clearAll();

        if (e.key === '%') {
            percentage();
            btnBlinkOnKeyboardInput(e.key, 'action');
        }
    });
}

function btnBlinkOnKeyboardInput(key, dataName) {
    let button;
    if (key === '*') {
        button = document.querySelector(`[data-${dataName}="×"]`);
    } else if (key === '/') {
        button = document.querySelector(`[data-${dataName}="÷"]`);
    } else {
        button = document.querySelector(`[data-${dataName}="${key}"]`);
    }
    if (button) {
        button.classList.add("btn-pressed");
        setTimeout(() => {
            button.classList.remove("btn-pressed");
        }, 100);
    }
}

function updateDisplay() {
    let formattedDisplay = expression
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');

    resultDisplay.innerText = formattedDisplay || "0";
}

function appendValue(val) {
    if (val === '.') {
        const parts = expression.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
    }

    expression += val;
    updateDisplay();
}

function appendOperator(op) {
    if (expression === "") return;

    // If last character is already an operator, replace it with new op:
    const lastChar = expression.slice(-1);
    if (op === '%') {
        percentage();
    }
    else if (['+', '-', '*', '/'].includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    updateDisplay();
}

function calculate() {
    if (expression === "") return;

    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) return;

    // Divide by zero check (e.g. /0)
    if (expression.includes('/0')) {
        resultDisplay.innerText = "Error";
        expression = "";
        return;
    }

    try {
        let historyFormatted = expression.replace(/\*/g, '×').replace(/\//g, '÷');
        historyDisplay.innerText = historyFormatted;

        // Animation class toggle
        historyDisplay.classList.remove("fade-in-effect");
        void historyDisplay.offsetWidth; // DOM reflow trigger to restart the animation
        historyDisplay.classList.add("fade-in-effect");

        // Real evaluation
        let finalResult = eval(expression);

        // Format number with commas 
        if (!isNaN(finalResult)) {
            expression = finalResult.toString();
            resultDisplay.innerText = "=" + Number(finalResult).toLocaleString();
        } else {
            resultDisplay.innerText = "Error";
            expression = "";
        }
    } catch (error) {
        resultDisplay.innerText = "Error";
        expression = "";
    }
}

function clearAll() {
    expression = "";
    historyDisplay.innerText = "";
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function toggleSign() {
    if (expression === "") return;

    const match = expression.match(/(-?\d+\.?\d*)$/);
    if (match) {
        const lastNumber = match[1];
        const toggledNumber = lastNumber.startsWith('-') ? lastNumber.slice(1) : '-' + lastNumber;
        expression = expression.substring(0, expression.length - lastNumber.length) + toggledNumber;
        updateDisplay();
    }
}

function percentage() {
    if (expression === "") return;
    try {
        let currentVal = eval(expression);
        expression = (currentVal / 100).toString();
        updateDisplay();
    } catch {
        resultDisplay.innerText = "Error";
    }
}

function calculateSquareRoot() {
    if (expression === "") return;
    try {
        expression = Math.sqrt(eval(expression)).toString();
        updateDisplay();
    }
    catch {
        resultDisplay.innerText = "Error";
    }
}

function calculateSquare() {
    if (expression === "") return;
    try {
        expression = Math.pow(eval(expression), 2).toString();
        updateDisplay();
    }
    catch {
        resultDisplay.innerText = "Error";
    }
}
main();