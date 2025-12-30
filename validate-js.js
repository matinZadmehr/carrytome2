const fs = require('fs');

function validateJavaScript() {
    console.log('🔍 Validating JavaScript syntax...\n');

    try {
        const js = fs.readFileSync('app.js', 'utf8');

        // Try to parse the JavaScript
        try {
            // Basic syntax check using eval in a safe way
            new Function(js);
            console.log('✅ JavaScript syntax is valid!');

            // Additional checks
            const issues = [];

            // Check for common issues
            if (js.includes('console.log') && !js.includes('//')) {
                // Just a warning, not an error
            }

            // Check for unclosed functions
            const openBraces = (js.match(/{/g) || []).length;
            const closeBraces = (js.match(/}/g) || []).length;

            if (openBraces !== closeBraces) {
                issues.push(`⚠️  Mismatched braces: ${openBraces} opening, ${closeBraces} closing`);
            }

            const openParens = (js.match(/\(/g) || []).length;
            const closeParens = (js.match(/\)/g) || []).length;

            if (openParens !== closeParens) {
                issues.push(`⚠️  Mismatched parentheses: ${openParens} opening, ${closeParens} closing`);
            }

            if (issues.length > 0) {
                console.error('❌ Structure Issues Found:\n');
                issues.forEach(issue => console.error(issue));
                process.exit(1);
            }

            console.log('✅ All JavaScript checks passed!');

        } catch (parseError) {
            console.error('❌ JavaScript Syntax Error:');
            console.error(parseError.message);
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error reading JavaScript file:', error.message);
        process.exit(1);
    }
}

validateJavaScript();

