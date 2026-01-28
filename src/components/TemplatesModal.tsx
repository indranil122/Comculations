'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { X, FileCode, Code2, Repeat, ListTree, FunctionSquare, FileText, Grid3X3, Database } from 'lucide-react';
import { CodeTemplate, Language } from '@/store/useStore';

const templates: CodeTemplate[] = [
    // C Templates
    {
        id: 'c-hello',
        name: 'Hello World',
        description: 'Basic C program with printf',
        language: 'c',
        category: 'Basics',
        icon: 'Code2',
        code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
    },
    {
        id: 'c-input',
        name: 'User Input',
        description: 'Reading input with scanf',
        language: 'c',
        category: 'Basics',
        icon: 'FileText',
        code: `#include <stdio.h>

int main() {
    char name[50];
    int age;
    
    printf("Enter your name: ");
    scanf("%s", name);
    
    printf("Enter your age: ");
    scanf("%d", &age);
    
    printf("Hello %s! You are %d years old.\\n", name, age);
    return 0;
}`
    },
    {
        id: 'c-loops',
        name: 'Loops',
        description: 'For, while, do-while loops',
        language: 'c',
        category: 'Control Flow',
        icon: 'Repeat',
        code: `#include <stdio.h>

int main() {
    // For loop
    printf("For loop (1-5):\\n");
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\\n\\n");
    
    // While loop
    printf("While loop (countdown):\\n");
    int count = 5;
    while (count > 0) {
        printf("%d ", count);
        count--;
    }
    printf("\\n\\n");
    
    // Do-while loop
    printf("Do-while (at least once):\\n");
    int x = 1;
    do {
        printf("x = %d\\n", x);
        x++;
    } while (x <= 3);
    
    return 0;
}`
    },
    {
        id: 'c-arrays',
        name: 'Arrays',
        description: 'Array declaration and operations',
        language: 'c',
        category: 'Data Structures',
        icon: 'Grid3X3',
        code: `#include <stdio.h>

int main() {
    // Array declaration
    int numbers[] = {10, 20, 30, 40, 50};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    // Print array elements
    printf("Array elements:\\n");
    for (int i = 0; i < size; i++) {
        printf("numbers[%d] = %d\\n", i, numbers[i]);
    }
    
    // Calculate sum
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += numbers[i];
    }
    printf("\\nSum: %d\\n", sum);
    printf("Average: %.2f\\n", (float)sum / size);
    
    return 0;
}`
    },
    {
        id: 'c-functions',
        name: 'Functions',
        description: 'Function definition and calls',
        language: 'c',
        category: 'Functions',
        icon: 'FunctionSquare',
        code: `#include <stdio.h>

// Function declarations
int add(int a, int b);
int factorial(int n);
void greet(char name[]);

int main() {
    // Using functions
    printf("5 + 3 = %d\\n", add(5, 3));
    printf("5! = %d\\n", factorial(5));
    greet("Student");
    
    return 0;
}

// Add two numbers
int add(int a, int b) {
    return a + b;
}

// Calculate factorial recursively
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Print greeting
void greet(char name[]) {
    printf("Hello, %s! Welcome to C programming.\\n", name);
}`
    },
    {
        id: 'c-pointers',
        name: 'Pointers',
        description: 'Pointer basics and usage',
        language: 'c',
        category: 'Advanced',
        icon: 'ListTree',
        code: `#include <stdio.h>

int main() {
    int num = 42;
    int *ptr = &num;  // Pointer to num
    
    printf("Value of num: %d\\n", num);
    printf("Address of num: %p\\n", (void*)&num);
    printf("Value of ptr: %p\\n", (void*)ptr);
    printf("Value pointed by ptr: %d\\n", *ptr);
    
    // Modify value through pointer
    *ptr = 100;
    printf("\\nAfter *ptr = 100:\\n");
    printf("Value of num: %d\\n", num);
    
    // Pointer arithmetic
    int arr[] = {10, 20, 30};
    int *arrPtr = arr;
    printf("\\nPointer arithmetic:\\n");
    for (int i = 0; i < 3; i++) {
        printf("*(arrPtr + %d) = %d\\n", i, *(arrPtr + i));
    }
    
    return 0;
}`
    },
    {
        id: 'c-struct',
        name: 'Structures',
        description: 'Struct definition and usage',
        language: 'c',
        category: 'Data Structures',
        icon: 'Database',
        code: `#include <stdio.h>
#include <string.h>

// Define a struct
struct Student {
    char name[50];
    int age;
    float gpa;
};

void printStudent(struct Student s);

int main() {
    // Create struct instances
    struct Student s1;
    strcpy(s1.name, "Alice");
    s1.age = 20;
    s1.gpa = 3.8;
    
    struct Student s2 = {"Bob", 22, 3.5};
    
    // Print students
    printf("Student 1:\\n");
    printStudent(s1);
    
    printf("\\nStudent 2:\\n");
    printStudent(s2);
    
    return 0;
}

void printStudent(struct Student s) {
    printf("Name: %s\\n", s.name);
    printf("Age: %d\\n", s.age);
    printf("GPA: %.2f\\n", s.gpa);
}`
    },

    // Python Templates
    {
        id: 'py-hello',
        name: 'Hello World',
        description: 'Basic Python print',
        language: 'python',
        category: 'Basics',
        icon: 'Code2',
        code: `# Hello World in Python
print("Hello, World!")
print("Welcome to Python programming!")

# Variables
name = "Student"
print(f"Hello, {name}!")`
    },
    {
        id: 'py-input',
        name: 'User Input',
        description: 'Reading user input',
        language: 'python',
        category: 'Basics',
        icon: 'FileText',
        code: `# Reading user input
name = input("Enter your name: ")
age = int(input("Enter your age: "))

print(f"Hello {name}!")
print(f"You are {age} years old.")
print(f"In 5 years, you'll be {age + 5}.")`
    },
    {
        id: 'py-loops',
        name: 'Loops',
        description: 'For and while loops',
        language: 'python',
        category: 'Control Flow',
        icon: 'Repeat',
        code: `# For loop
print("For loop (1-5):")
for i in range(1, 6):
    print(i, end=" ")
print()

# While loop
print("\\nWhile loop (countdown):")
count = 5
while count > 0:
    print(count, end=" ")
    count -= 1
print()

# Loop with list
print("\\nIterating over list:")
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"\\nSquares: {squares}")`
    },
    {
        id: 'py-functions',
        name: 'Functions',
        description: 'Function definition and usage',
        language: 'python',
        category: 'Functions',
        icon: 'FunctionSquare',
        code: `# Function definitions
def greet(name):
    """Simple greeting function"""
    return f"Hello, {name}!"

def add(a, b):
    """Add two numbers"""
    return a + b

def factorial(n):
    """Calculate factorial recursively"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Lambda function
square = lambda x: x ** 2

# Using functions
print(greet("Student"))
print(f"5 + 3 = {add(5, 3)}")
print(f"5! = {factorial(5)}")
print(f"7² = {square(7)}")`
    },
    {
        id: 'py-lists',
        name: 'Lists & Dicts',
        description: 'List and dictionary operations',
        language: 'python',
        category: 'Data Structures',
        icon: 'Grid3X3',
        code: `# Lists
numbers = [1, 2, 3, 4, 5]
print("List operations:")
print(f"Original: {numbers}")
numbers.append(6)
print(f"After append(6): {numbers}")
print(f"Sum: {sum(numbers)}")
print(f"Max: {max(numbers)}")
print(f"Slicing [1:4]: {numbers[1:4]}")

# Dictionaries
print("\\nDictionary operations:")
student = {
    "name": "Alice",
    "age": 20,
    "grades": [90, 85, 88]
}
print(f"Student: {student}")
print(f"Name: {student['name']}")
print(f"Average grade: {sum(student['grades']) / len(student['grades']):.2f}")

# Add new key
student["major"] = "Computer Science"
print(f"After adding major: {student}")`
    },
    {
        id: 'py-oop',
        name: 'Classes (OOP)',
        description: 'Object-oriented programming',
        language: 'python',
        category: 'OOP',
        icon: 'Database',
        code: `# Object-Oriented Programming in Python

class Animal:
    """Base class for animals"""
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    """Dog class inheriting from Animal"""
    def speak(self):
        return f"{self.name} says Woof!"
    
    def fetch(self):
        return f"{self.name} is fetching the ball!"

class Cat(Animal):
    """Cat class inheriting from Animal"""
    def speak(self):
        return f"{self.name} says Meow!"

# Create objects
dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())
print(dog.fetch())
print(cat.speak())

# List of animals
animals = [dog, cat]
print("\\nAll animals:")
for animal in animals:
    print(f"  {animal.speak()}")`
    },
    {
        id: 'py-files',
        name: 'File Handling',
        description: 'Reading and writing files',
        language: 'python',
        category: 'I/O',
        icon: 'FileText',
        code: `# File handling in Python
# Note: This is a demonstration - actual file operations require proper permissions

# Writing to a file
content = """Hello, File!
This is line 2.
This is line 3."""

print("Content to write:")
print(content)
print()

# Simulating file operations
lines = content.split('\\n')
print("Reading lines:")
for i, line in enumerate(lines, 1):
    print(f"Line {i}: {line}")

# Word count
words = content.split()
print(f"\\nTotal words: {len(words)}")
print(f"Total characters: {len(content)}")
print(f"Total lines: {len(lines)}")`
    },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Code2,
    FileText,
    Repeat,
    Grid3X3,
    FunctionSquare,
    ListTree,
    Database,
    FileCode,
};

export default function TemplatesModal() {
    const { setShowTemplates, language, setLanguage, setCode } = useStore();
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

    const filteredTemplates = templates.filter(t => {
        if (t.language !== language) return false;
        if (selectedCategory === 'all') return true;
        return t.category === selectedCategory;
    });

    const categories = ['all', ...new Set(templates.filter(t => t.language === language).map(t => t.category))];

    const handleSelectTemplate = (template: CodeTemplate) => {
        setCode(template.code);
        setShowTemplates(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowTemplates(false)}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-default)] w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Code Templates</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Start with a pre-built template</p>
                    </div>
                    <button
                        onClick={() => setShowTemplates(false)}
                        className="btn-icon"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Language Tabs */}
                <div className="px-6 pt-4 flex items-center gap-4">
                    <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-1 border border-[var(--border-default)]">
                        <button
                            onClick={() => setLanguage('c')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'c'
                                    ? 'bg-[var(--accent-primary)] text-white'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            C
                        </button>
                        <button
                            onClick={() => setLanguage('python')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'python'
                                    ? 'bg-[var(--accent-primary)] text-white'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Python
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-[var(--accent-primary)] text-white'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                                    }`}
                            >
                                {cat === 'all' ? 'All' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTemplates.map((template) => {
                            const Icon = iconMap[template.icon] || Code2;
                            return (
                                <motion.button
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    className="template-card text-left"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-[var(--text-primary)] truncate">{template.name}</h3>
                                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{template.description}</p>
                                            <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                                                {template.category}
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
