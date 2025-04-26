let display = '';
let hasCalculated = false;

function hasBalancedParentheses(input) {
  let count = 0;
  for (const char of input) {
    if (char === '(') count++;
    else if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

function hasValidSequences(input) {
  // Check for consecutive operators
  if (/[+\-*/^]{2,}/.test(input)) return false;
  
  // Check for multiple decimal points in numbers
  const numbers = input.split(/[+\-*/()√^]|sin|cos|tan/);
  for (const num of numbers) {
    if (num && (num.match(/\./g) || []).length > 1) return false;
  }
  
  // Check for consecutive functions
  if (/√√|sinsin|coscos|tantan/.test(input)) return false;
  
  // Check for invalid sequences after operators
  if (/[+\-*/^]$/.test(input)) return false;
  
  return true;
}

function isValidInput(input) {
  if (!input) return false;
  return hasBalancedParentheses(input) && hasValidSequences(input);
}

function processSquareRoots(expression) {
  const sqrtRegex = /√(\d+(\.\d+)?|\([^)]+\))/g;
  return expression.replace(sqrtRegex, (match) => {
    const valueStr = match.substring(1);
    let value;
    
    if (valueStr.startsWith('(') && valueStr.endsWith(')')) {
      const innerExpression = valueStr.substring(1, valueStr.length - 1);
      value = evaluateSimpleExpression(innerExpression);
    } else {
      value = parseFloat(valueStr);
    }
    
    if (isNaN(value) || value < 0) throw new Error('Invalid square root');
    return Math.sqrt(value).toString();
  });
}

function processTrigFunctions(expression) {
  const trigRegex = /(sin|cos|tan)\(([^)]+)\)/g;
  return expression.replace(trigRegex, (match, func, value) => {
    const evaluated = evaluateSimpleExpression(value);
    const radians = evaluated * (Math.PI / 180); // Convert to radians
    let result;
    
    switch(func) {
      case 'sin':
        result = Math.sin(radians);
        break;
      case 'cos':
        result = Math.cos(radians);
        break;
      case 'tan':
        result = Math.tan(radians);
        break;
    }
    
    return result.toString();
  });
}

function processPower(expression) {
  const powerRegex = /(\d+(\.\d+)?|\([^)]+\))\^(\d+(\.\d+)?|\([^)]+\))/g;
  return expression.replace(powerRegex, (match) => {
    const [base, exponent] = match.split('^');
    let baseValue, expValue;
    
    if (base.startsWith('(') && base.endsWith(')')) {
      baseValue = evaluateSimpleExpression(base.substring(1, base.length - 1));
    } else {
      baseValue = parseFloat(base);
    }
    
    if (exponent.startsWith('(') && exponent.endsWith(')')) {
      expValue = evaluateSimpleExpression(exponent.substring(1, exponent.length - 1));
    } else {
      expValue = parseFloat(exponent);
    }
    
    return Math.pow(baseValue, expValue).toString();
  });
}

function evaluateSimpleExpression(expression) {
  try {
    // Sanitize the expression
    const sanitizedExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .trim();
    
    // Validate the expression
    if (!/^[0-9+\-*/(). ]+$/.test(sanitizedExpression)) {
      throw new Error('Invalid characters in expression');
    }
    
    // Evaluate the expression
    const result = Function('"use strict";return (' + sanitizedExpression + ')')();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    
    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
}

function evaluateExpression(expression) {
  try {
    let processedExpression = expression;
    processedExpression = processTrigFunctions(processedExpression);
    processedExpression = processSquareRoots(processedExpression);
    processedExpression = processPower(processedExpression);
    return evaluateSimpleExpression(processedExpression);
  } catch (error) {
    throw error;
  }
}

function updateDisplay() {
  const displayElement = document.querySelector('.calculator-display');
  displayElement.textContent = display || '0';
}

function handleButtonClick(value) {
  if (value === '=') {
    try {
      if (!isValidInput(display)) {
        throw new Error('Invalid expression');
      }
      const result = evaluateExpression(display);
      display = result.toString();
      hasCalculated = true;
    } catch (error) {
      display = 'Error';
      hasCalculated = true;
    }
  } else if (value === 'C') {
    display = '';
    hasCalculated = false;
  } else if (value === 'DEL') {
    if (display === 'Error') {
      display = '';
    } else {
      display = display.slice(0, -1);
    }
    hasCalculated = false;
  } else if (value === '√') {
    if (display.length > 0) {
      const lastChar = display[display.length - 1];
      if (lastChar.match(/[0-9)]/)) {
        display += '*';
      }
    }
    display += '(√';
    hasCalculated = false;
  } else if (['sin', 'cos', 'tan'].includes(value)) {
    if (display.length > 0) {
      const lastChar = display[display.length - 1];
      if (lastChar.match(/[0-9)]/)) {
        display += '*';
      }
    }
    display += value + '(';
    hasCalculated = false;
  } else {
    if (value === '(' && display.length > 0) {
      const lastChar = display[display.length - 1];
      if (lastChar.match(/[0-9)]/)) {
        display += '*' + value;
        hasCalculated = false;
        updateDisplay();
        return;
      }
    }

    if (hasCalculated && !['√', '(', '+', '-', '*', '/', '^'].includes(value)) {
      display = value;
    } else if (hasCalculated) {
      display += value;
    } else {
      display += value;
    }
    hasCalculated = false;
  }
  updateDisplay();
}

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleButtonClick('=');
  } else if (e.key === 'Escape') {
    e.preventDefault();
    handleButtonClick('C');
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    handleButtonClick('DEL');
  } else if (e.key === 'r') {
    e.preventDefault();
    handleButtonClick('√');
  } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '(', ')', '^'].includes(e.key)) {
    e.preventDefault();
    handleButtonClick(e.key);
  }
}

window.addEventListener('keydown', handleKeyPress);