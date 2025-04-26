# CalcIt

<!-- Project Description -->
CalcIt is a simple, clean, modern web calculator.  
It supports both basic and scientific operations with a responsive layout.

# Features

<!-- List of supported features -->
- Addition (+), subtraction (-), multiplication (*), division (/)
- Scientific functions: sin, cos, tan, square root (√), exponentiation (^)
- Decimal numbers
- Parentheses
- Delete last entry (DEL)
- Clear all (C)
- Keyboard input support
- Mobile and desktop responsive design

# Technologies

<!-- Technologies used in the project -->
- HTML
- CSS
- JavaScript

# How to Use

<!-- Instructions for running the project -->
- Open `index.html` in your browser or,
- Open ""  in your browser (github link)
- Click buttons or use your keyboard to perform calculations

# Future Improvements

<!-- Planned features to be added -->
- Add history of calculations
- Add themes (light and dark mode)

# About `handleKeyPress(e)`

<!-- Explanation of the handleKeyPress function -->
This function manages keyboard input for the calculator.

It works like this:

- If you press `Enter`, it triggers the equal `=` operation.
- If you press `Escape`, it clears the calculator with `C`.
- If you press `Backspace`, it deletes the last character using `DEL`.
- If you press `r`, it inserts the square root symbol `√`.
- If you press any number (0-9), operator (+, -, *, /), decimal point (.), parentheses `(` or `)`, or exponentiation `^`, it adds that character directly to the input.

It prevents the browser's default behavior for these keys to make sure everything works inside the calculator only.

Simple and direct input control for better user experience.
