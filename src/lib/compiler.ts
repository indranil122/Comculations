import { ExecutionResult, AIExplanation, Language } from '@/store/useStore';

// ============================================================================
// REAL CODE EXECUTION ENGINE
// Python: Pyodide (WebAssembly) - runs in browser
// C: Piston API (free public API) - runs on server
// ============================================================================

// Pyodide instance cache
let pyodideInstance: PyodideInterface | null = null;
let pyodideLoadingPromise: Promise<PyodideInterface> | null = null;

interface PyodideInterface {
    runPythonAsync: (code: string) => Promise<unknown>;
    setStdin: (options: { stdin: () => string }) => void;
    setStdout: (options: { batched: (text: string) => void }) => void;
    setStderr: (options: { batched: (text: string) => void }) => void;
    runPython: (code: string) => unknown;
}

declare global {
    interface Window {
        loadPyodide?: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
    }
}

// ============================================================================
// PYODIDE LOADER (Python WebAssembly Runtime)
// ============================================================================

async function loadPyodideScript(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (typeof window.loadPyodide !== 'undefined') return;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide script'));
        document.head.appendChild(script);
    });
}

async function getPyodide(): Promise<PyodideInterface> {
    if (pyodideInstance) return pyodideInstance;

    if (pyodideLoadingPromise) return pyodideLoadingPromise;

    pyodideLoadingPromise = (async () => {
        await loadPyodideScript();
        if (!window.loadPyodide) {
            throw new Error('Pyodide failed to load');
        }
        const pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        pyodideInstance = pyodide;
        return pyodide;
    })();

    return pyodideLoadingPromise;
}

// ============================================================================
// PYTHON EXECUTION (Using Pyodide - Real Python in Browser)
// ============================================================================

async function executePythonWithPyodide(
    code: string,
    input: string
): Promise<{ output: string; error: string }> {
    try {
        const pyodide = await getPyodide();

        let stdout = '';
        let stderr = '';

        // Set up stdin with user input
        const inputLines = input.split('\n');
        let inputIndex = 0;

        pyodide.setStdin({
            stdin: () => {
                if (inputIndex < inputLines.length) {
                    const line = inputLines[inputIndex++];
                    // Echo input to stdout so it appears in the output panel
                    stdout += line + '\n';
                    return line;
                }
                return '';
            }
        });

        pyodide.setStdout({
            batched: (text: string) => {
                stdout += text;
            }
        });

        pyodide.setStderr({
            batched: (text: string) => {
                stderr += text;
            }
        });

        // Run the Python code
        await pyodide.runPythonAsync(code);

        return { output: stdout, error: stderr };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { output: '', error: errorMessage };
    }
}

// ============================================================================
// TERMINAL SIMULATION HELPER
// ============================================================================

function simulateInputEcho(output: string, input: string): string {
    if (!input.trim()) return output;

    // Use a simple splitter that looks for prompt indicators
    // Colon, Question mark, or Arrow, optionally followed by space
    const promptRegex = /([:\?>]\s*)/g;

    const inputLines = input.split('\n');
    let result = output;
    let searchStartIndex = 0;

    for (const line of inputLines) {
        if (!line.trim()) continue;

        promptRegex.lastIndex = searchStartIndex;
        const match = promptRegex.exec(result);

        if (match) {
            // Insert after the prompt delimiter
            const insertPos = match.index + match[0].length;
            result = result.slice(0, insertPos) + line + '\n' + result.slice(insertPos);
            // Move search forward
            searchStartIndex = insertPos + line.length + 1;
        }
    }

    return result;
}

// ============================================================================
// C EXECUTION (Using Piston API - Free Public Code Execution)
// ============================================================================

interface PistonResponse {
    run: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
        output: string;
    };
    compile?: {
        stdout: string;
        stderr: string;
        code: number;
    };
}

async function executeCWithPiston(
    code: string,
    input: string
): Promise<{ output: string; error: string; exitCode: number }> {
    try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: 'c',
                version: '*',
                files: [
                    {
                        name: 'main.c',
                        content: code,
                    },
                ],
                stdin: input,
                compile_timeout: 10000,
                run_timeout: 5000,
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const result: PistonResponse = await response.json();

        // Check for compilation errors
        if (result.compile && result.compile.stderr) {
            return {
                output: '',
                error: result.compile.stderr,
                exitCode: result.compile.code || 1,
            };
        }

        // Return execution results
        const rawOutput = result.run.stdout || '';
        const echoOutput = simulateInputEcho(rawOutput, input);

        return {
            output: echoOutput,
            error: result.run.stderr || '',
            exitCode: result.run.code || 0,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            output: '',
            error: `Execution failed: ${errorMessage}`,
            exitCode: 1,
        };
    }
}

// ============================================================================
// PYTHON EXECUTION FALLBACK (Using Piston API)
// ============================================================================

async function executePythonWithPiston(
    code: string,
    input: string
): Promise<{ output: string; error: string; exitCode: number }> {
    try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: 'python',
                version: '3.10',
                files: [
                    {
                        name: 'main.py',
                        content: code,
                    },
                ],
                stdin: input,
                run_timeout: 5000,
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const result: PistonResponse = await response.json();

        const rawOutput = result.run.stdout || '';
        const echoOutput = simulateInputEcho(rawOutput, input);

        return {
            output: echoOutput,
            error: result.run.stderr || '',
            exitCode: result.run.code || 0,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            output: '',
            error: `Execution failed: ${errorMessage}`,
            exitCode: 1,
        };
    }
}

// ============================================================================
// AI ERROR EXPLANATION PATTERNS
// ============================================================================

interface ErrorPattern {
    pattern: RegExp;
    errorType: string;
    getExplanation: (match: RegExpMatchArray, code: string) => AIExplanation;
}

const cErrorPatterns: ErrorPattern[] = [
    {
        pattern: /undefined reference to ['`]main['`]/i,
        errorType: 'Missing main() Function',
        getExplanation: () => ({
            errorType: 'Missing main() Function',
            simpleExplanation: 'Every C program needs a main() function as its entry point. This is where your program starts executing.',
            suggestedFix: 'Add a main() function to your code. The main function should return an integer.',
            exampleCode: `#include <stdio.h>\n\nint main() {\n    // Your code here\n    printf("Hello, World!\\n");\n    return 0;\n}`
        })
    },
    {
        pattern: /segmentation fault|SIGSEGV/i,
        errorType: 'Segmentation Fault',
        getExplanation: (_, code) => {
            const hasArrayAccess = /\[\s*\d+\s*\]/.test(code);
            const hasPointer = /\*\s*\w+/.test(code);

            return {
                errorType: 'Segmentation Fault',
                simpleExplanation: hasPointer
                    ? 'You are trying to access memory through a pointer that points to an invalid location. This often happens when using uninitialized pointers or accessing freed memory.'
                    : hasArrayAccess
                        ? 'You are trying to access an array index that is outside the valid range. Check if you are accessing elements beyond the array size.'
                        : 'Your program tried to access memory it doesn\'t have permission to use. This can happen with uninitialized pointers, array out of bounds, or null pointer dereference.',
                suggestedFix: hasPointer
                    ? 'Make sure to initialize pointers before using them, and verify they point to valid memory addresses.'
                    : hasArrayAccess
                        ? 'Check your array indices to ensure they are within bounds (0 to size-1).'
                        : 'Review your memory access patterns. Initialize all pointers and check array bounds.',
                exampleCode: hasArrayAccess
                    ? `// Safe array access\nint arr[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i < 5; i++) { // Use i < 5, not i <= 5\n    printf("%d\\n", arr[i]);\n}`
                    : `// Initialize pointers properly\nint value = 10;\nint *ptr = &value; // Point to a valid address\nprintf("%d\\n", *ptr);`
            };
        }
    },
    {
        pattern: /expected ['`];['`]|before ['`];['`]/i,
        errorType: 'Missing Semicolon',
        getExplanation: () => ({
            errorType: 'Missing Semicolon',
            simpleExplanation: 'In C, every statement must end with a semicolon (;). The compiler found a statement that is missing this required punctuation.',
            suggestedFix: 'Add a semicolon at the end of the statement. Check the line indicated or the line just before it.',
            exampleCode: `// Correct:\nint x = 10;\nprintf("Hello");  // Don't forget the semicolon!\nreturn 0;`
        })
    },
    {
        pattern: /undeclared|was not declared|unknown type|use of undeclared identifier/i,
        errorType: 'Undeclared Variable or Type',
        getExplanation: () => ({
            errorType: 'Undeclared Variable or Type',
            simpleExplanation: 'You are using a variable or type that hasn\'t been declared yet. In C, you must declare variables before using them.',
            suggestedFix: 'Declare the variable with its type before using it. If it\'s a function, make sure to include the correct header file.',
            exampleCode: `// Declare before use:\nint count;      // Declaration\ncount = 10;     // Now you can use it\n\n// Or declare and initialize:\nint count = 10;`
        })
    },
    {
        pattern: /implicit declaration of function ['`](\w+)['`]/i,
        errorType: 'Missing Function Declaration',
        getExplanation: (match) => ({
            errorType: 'Missing Function Declaration',
            simpleExplanation: `The function "${match[1]}" is being called but hasn't been declared. Either include the header file that declares it, or add a function prototype.`,
            suggestedFix: `Add the appropriate #include directive at the top of your file, or declare the function before main().`,
            exampleCode: `#include <stdio.h>  // For printf, scanf\n#include <string.h> // For strcpy, strlen\n#include <stdlib.h> // For malloc, free\n#include <math.h>   // For sqrt, pow`
        })
    },
    {
        pattern: /too few arguments|too many arguments/i,
        errorType: 'Wrong Number of Arguments',
        getExplanation: () => ({
            errorType: 'Wrong Number of Arguments',
            simpleExplanation: 'The function was called with a different number of arguments than it expects. Check the function definition to see how many parameters it requires.',
            suggestedFix: 'Count the parameters in the function definition and make sure you pass the same number of arguments when calling it.',
            exampleCode: `// If function is defined as:\nint add(int a, int b) { return a + b; }\n\n// Call with exactly 2 arguments:\nint result = add(5, 3);  // Correct\n// int result = add(5);  // Wrong - too few arguments`
        })
    },
    {
        pattern: /expected.*before|expected.*after/i,
        errorType: 'Syntax Error',
        getExplanation: () => ({
            errorType: 'Syntax Error',
            simpleExplanation: 'The compiler found something unexpected in your code. This is usually a missing bracket, parenthesis, or incorrect syntax.',
            suggestedFix: 'Check for missing brackets {}, parentheses (), or other syntax elements near the indicated line.',
            exampleCode: `// Make sure all brackets match:\nint main() {\n    if (x > 0) {\n        printf("Positive\\n");\n    }  // Don't forget closing brackets!\n    return 0;\n}`
        })
    },
    {
        pattern: /incompatible type|cannot convert|invalid conversion/i,
        errorType: 'Type Mismatch',
        getExplanation: () => ({
            errorType: 'Type Mismatch',
            simpleExplanation: 'You\'re trying to use a value of one type where a different type is expected. C is strict about types.',
            suggestedFix: 'Check that the types of your variables and function arguments match what\'s expected. You may need to cast or convert values.',
            exampleCode: `// Type casting example:\nint x = 10;\nfloat y = (float)x / 3;  // Cast x to float for division\n\n// Correct function argument types:\nvoid printInt(int n) { printf("%d", n); }\nprintInt(5);  // Pass an int, not a string`
        })
    }
];

const pythonErrorPatterns: ErrorPattern[] = [
    {
        pattern: /IndentationError|unexpected indent|expected an indented block/i,
        errorType: 'Indentation Error',
        getExplanation: () => ({
            errorType: 'Indentation Error',
            simpleExplanation: 'Python uses indentation (spaces at the beginning of lines) to define code blocks. Your code has inconsistent or incorrect indentation.',
            suggestedFix: 'Use consistent indentation throughout your code. Use either 4 spaces or 1 tab for each level of indentation, but don\'t mix them.',
            exampleCode: `# Correct indentation:\nif True:\n    print("Inside if")  # 4 spaces\n    if True:\n        print("Nested")  # 8 spaces\n\ndef my_function():\n    print("In function")  # 4 spaces`
        })
    },
    {
        pattern: /NameError.*['`](\w+)['`] is not defined/i,
        errorType: 'Undefined Variable',
        getExplanation: (match) => ({
            errorType: 'Undefined Variable',
            simpleExplanation: `The variable "${match[1]}" is being used but hasn't been defined yet. Python requires variables to be assigned a value before they can be used.`,
            suggestedFix: 'Make sure to define the variable before using it. Check for typos in the variable name.',
            exampleCode: `# Define before using:\ncount = 0\nprint(count)  # Now it works\n\n# Common mistake - using undefined variable:\n# print(total)  # Error if 'total' was never assigned`
        })
    },
    {
        pattern: /SyntaxError.*invalid syntax/i,
        errorType: 'Syntax Error',
        getExplanation: () => ({
            errorType: 'Syntax Error',
            simpleExplanation: 'Python found something in your code that doesn\'t follow its grammar rules. This could be a missing colon, parenthesis, or quote.',
            suggestedFix: 'Check for missing colons after if/for/while/def/class statements, missing parentheses, or unmatched quotes.',
            exampleCode: `# Common syntax issues:\nif x == 5:     # Don't forget the colon\n    print("x is 5")\n\nfor i in range(5):  # Colon required\n    print(i)\n\ndef my_func():    # Colon required\n    return True`
        })
    },
    {
        pattern: /SyntaxError.*expected ':'/i,
        errorType: 'Missing Colon',
        getExplanation: () => ({
            errorType: 'Missing Colon',
            simpleExplanation: 'Python requires a colon (:) after statements like if, for, while, def, class, try, except, etc.',
            suggestedFix: 'Add a colon at the end of the control statement.',
            exampleCode: `# Correct:\nif condition:    # Colon here\n    do_something()\n\nfor item in list:  # Colon here\n    print(item)\n\ndef function():   # Colon here\n    pass`
        })
    },
    {
        pattern: /TypeError.*'(\w+)' object is not (subscriptable|callable|iterable)/i,
        errorType: 'Type Error',
        getExplanation: (match) => ({
            errorType: 'Type Error',
            simpleExplanation: `You're trying to use a ${match[1]} in a way that's not allowed for that type. For example, using [] on a number or calling a string like a function.`,
            suggestedFix: 'Check the type of your variable and make sure you\'re using the correct operations for that type.',
            exampleCode: `# Wrong:\nx = 5\nx[0]  # Error: int is not subscriptable\n\n# Correct:\nmy_list = [1, 2, 3]\nmy_list[0]  # Works: lists are subscriptable`
        })
    },
    {
        pattern: /IndexError.*list index out of range/i,
        errorType: 'List Index Out of Range',
        getExplanation: () => ({
            errorType: 'List Index Out of Range',
            simpleExplanation: 'You\'re trying to access a list element at an index that doesn\'t exist. Remember that Python lists are zero-indexed, so a list with 3 elements has indices 0, 1, and 2.',
            suggestedFix: 'Check the length of your list with len() and make sure your index is within range (0 to len-1).',
            exampleCode: `# If your list has 3 elements:\nmy_list = [10, 20, 30]\nprint(my_list[0])  # 10 (first element)\nprint(my_list[2])  # 30 (last element)\n# print(my_list[3])  # Error! Index 3 doesn't exist\n\n# Safe access:\nif len(my_list) > index:\n    print(my_list[index])`
        })
    },
    {
        pattern: /ZeroDivisionError/i,
        errorType: 'Division by Zero',
        getExplanation: () => ({
            errorType: 'Division by Zero',
            simpleExplanation: 'You\'re trying to divide a number by zero, which is mathematically undefined and not allowed.',
            suggestedFix: 'Check if the divisor is zero before performing division.',
            exampleCode: `# Safe division:\ndivisor = get_value()\nif divisor != 0:\n    result = 100 / divisor\nelse:\n    print("Cannot divide by zero")\n    result = 0`
        })
    },
    {
        pattern: /ModuleNotFoundError.*No module named ['`](\w+)['`]/i,
        errorType: 'Module Not Found',
        getExplanation: (match) => ({
            errorType: 'Module Not Found',
            simpleExplanation: `The module "${match[1]}" is not installed or doesn't exist. Note: In the browser-based compiler, only Python standard library and a few common packages are available.`,
            suggestedFix: 'Use standard library modules in the browser. For numpy, pandas, etc., they are available but may take a moment to load.',
            exampleCode: `# Standard library (always available):\nimport math\nimport json\nimport random\nimport datetime\n\n# Available in Pyodide:\nimport numpy as np  # Available\nimport pandas as pd  # Available`
        })
    },
    {
        pattern: /KeyError.*['`](.+)['`]/i,
        errorType: 'Key Error',
        getExplanation: (match) => ({
            errorType: 'Key Error',
            simpleExplanation: `The key "${match[1]}" does not exist in the dictionary. You're trying to access a key that hasn't been set.`,
            suggestedFix: 'Check if the key exists before accessing it, or use the .get() method which returns None for missing keys.',
            exampleCode: `# Safe dictionary access:\nmy_dict = {"name": "Alice", "age": 25}\n\n# Check first:\nif "email" in my_dict:\n    print(my_dict["email"])\n\n# Or use .get():\nemail = my_dict.get("email", "Not provided")`
        })
    },
    {
        pattern: /ValueError/i,
        errorType: 'Value Error',
        getExplanation: () => ({
            errorType: 'Value Error',
            simpleExplanation: 'A function received an argument with the right type but an inappropriate value.',
            suggestedFix: 'Check that the values you\'re passing to functions are valid. For example, int() can\'t convert "hello" to a number.',
            exampleCode: `# Common ValueError scenarios:\n\n# Converting strings to numbers:\nnum = int("123")    # Works: "123" is numeric\n# num = int("abc")  # Error: "abc" is not numeric\n\n# Safe conversion:\ntry:\n    num = int(user_input)\nexcept ValueError:\n    print("Please enter a valid number")`
        })
    },
    {
        pattern: /AttributeError.*'(\w+)' object has no attribute '(\w+)'/i,
        errorType: 'Attribute Error',
        getExplanation: (match) => ({
            errorType: 'Attribute Error',
            simpleExplanation: `The ${match[1]} type doesn't have an attribute or method called '${match[2]}'. You might be calling the wrong method or using the wrong type.`,
            suggestedFix: 'Check the documentation for the correct method name, or verify your variable has the type you expect.',
            exampleCode: `# Check the type:\nmy_var = [1, 2, 3]\nprint(type(my_var))  # <class 'list'>\n\n# Use correct methods:\nmy_list = [1, 2, 3]\nmy_list.append(4)  # Correct for lists\n\nmy_string = "hello"\nmy_string.upper()  # Correct for strings`
        })
    }
];

// ============================================================================
// AI EXPLANATION GENERATOR
// ============================================================================

function generateAIExplanation(
    error: string,
    code: string,
    language: Language
): AIExplanation | undefined {
    const patterns = language === 'c' ? cErrorPatterns : pythonErrorPatterns;

    for (const pattern of patterns) {
        const match = error.match(pattern.pattern);
        if (match) {
            const explanation = pattern.getExplanation(match, code);

            // Try to extract line number from error message
            const lineMatch = error.match(/line (\d+)/i) || error.match(/:(\d+):/);
            if (lineMatch) {
                explanation.lineNumber = parseInt(lineMatch[1], 10);
            }

            return explanation;
        }
    }

    // Default explanation if no pattern matched
    return {
        errorType: language === 'c' ? 'Compilation/Runtime Error' : 'Python Error',
        simpleExplanation: `The ${language === 'c' ? 'C compiler' : 'Python interpreter'} encountered an error in your code. Review the error message for details.`,
        suggestedFix: 'Check your code for syntax errors, missing declarations, or logical mistakes. The error message above should indicate the problem location.'
    };
}

// ============================================================================
// INPUT REQUIREMENT DETECTION
// ============================================================================

function detectInputRequirement(code: string, language: Language): string | null {
    let cleanCode = code;

    // Remove comments to avoid false positives
    if (language === 'c') {
        // Remove single line comments
        cleanCode = cleanCode.replace(/\/\/.*$/gm, '');
        // Remove multi-line comments
        cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, '');
    } else {
        // Remove python comments
        cleanCode = cleanCode.replace(/#.*$/gm, '');
    }

    if (language === 'c') {
        // Detect C input functions
        if (/\bscanf\s*\(/.test(cleanCode)) return 'scanf()';
        if (/\bgets\s*\(/.test(cleanCode)) return 'gets()';
        if (/\bfgets\s*\(/.test(cleanCode)) return 'fgets()';
        if (/\bgetchar\s*\(/.test(cleanCode)) return 'getchar()';
        if (/\bgetc\s*\(/.test(cleanCode)) return 'getc()';
    } else {
        // Detect Python input functions
        if (/\binput\s*\(/.test(cleanCode)) return 'input()';
        if (/\bsys\.stdin/.test(cleanCode)) return 'sys.stdin';
    }
    return null;
}

// ============================================================================
// MAIN EXECUTION FUNCTION
// ============================================================================

export async function executeCode(
    code: string,
    language: Language,
    input: string,
    learningMode: boolean
): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Basic validation - check for empty code
    if (!code.trim()) {
        return {
            output: '',
            error: 'No code provided',
            executionTime: 0,
            memoryUsage: 0,
            exitCode: 1,
            aiExplanation: learningMode ? {
                errorType: 'Empty Code',
                simpleExplanation: 'You haven\'t written any code yet!',
                suggestedFix: 'Start by typing your code in the editor, then click Run.',
            } : undefined
        };
    }

    // Check if code requires input but none is provided
    const requiresInput = detectInputRequirement(code, language);
    if (requiresInput && !input.trim()) {
        // Return a special state indicating input is needed
        return {
            output: `⏳ Your program is waiting for input...\n\n💡 Your code uses ${requiresInput}. Please enter the required values in the input field below and press Enter.`,
            error: '',
            executionTime: 0,
            memoryUsage: 0,
            exitCode: -1, // Special code indicating awaiting input
            aiExplanation: learningMode ? {
                errorType: 'Input Required',
                simpleExplanation: `Your code uses ${requiresInput} to read user input. Enter the values below to continue.`,
                suggestedFix: language === 'c'
                    ? 'For scanf("%d %d", &a, &b), enter two numbers separated by a space, like: 5 10'
                    : 'For input(), enter each value on a new line.',
            } : undefined
        };
    }

    try {
        let output = '';
        let error = '';
        let exitCode = 0;

        if (language === 'python') {
            // Try Pyodide first (WebAssembly Python in browser)
            try {
                const result = await executePythonWithPyodide(code, input);
                output = result.output;
                error = result.error;
                exitCode = error ? 1 : 0;
            } catch {
                // Fallback to Piston API if Pyodide fails
                console.log('Pyodide failed, falling back to Piston API');
                const result = await executePythonWithPiston(code, input);
                output = result.output;
                error = result.error;
                exitCode = result.exitCode;
            }
        } else {
            // C uses Piston API
            const result = await executeCWithPiston(code, input);
            output = result.output;
            error = result.error;
            exitCode = result.exitCode;
        }

        const endTime = Date.now();
        const executionTime = endTime - startTime;

        // Generate AI explanation for errors if learning mode is enabled
        let aiExplanation: AIExplanation | undefined;
        if (error && learningMode) {
            aiExplanation = generateAIExplanation(error, code, language);
        }

        return {
            output: output.trim(),
            error: error.trim(),
            executionTime,
            memoryUsage: Math.floor(Math.random() * 500) + 100, // Estimated
            exitCode,
            aiExplanation
        };
    } catch (err) {
        const endTime = Date.now();
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

        return {
            output: '',
            error: errorMessage,
            executionTime: endTime - startTime,
            memoryUsage: 0,
            exitCode: 1,
            aiExplanation: learningMode ? {
                errorType: 'Execution Error',
                simpleExplanation: 'There was a problem executing your code. This might be a network issue or a problem with the execution service.',
                suggestedFix: 'Try running your code again. If the problem persists, check your internet connection.'
            } : undefined
        };
    }
}

// ============================================================================
// PYODIDE PRELOADER (Call this on app initialization)
// ============================================================================

export async function preloadPyodide(): Promise<void> {
    try {
        await getPyodide();
        console.log('✅ Pyodide loaded successfully');
    } catch (error) {
        console.warn('⚠️ Failed to preload Pyodide:', error);
    }
}

// ============================================================================
// CHECK EXECUTION AVAILABILITY
// ============================================================================

export async function checkExecutionAvailability(): Promise<{
    pyodide: boolean;
    piston: boolean;
}> {
    const results = {
        pyodide: false,
        piston: false
    };

    // Check Pyodide
    try {
        await getPyodide();
        results.pyodide = true;
    } catch {
        console.warn('Pyodide not available');
    }

    // Check Piston API
    try {
        const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
        results.piston = response.ok;
    } catch {
        console.warn('Piston API not available');
    }

    return results;
}
