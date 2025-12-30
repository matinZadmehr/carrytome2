const fs = require('fs');

async function validateHTML() {
    try {
        const { validate } = require('html-validator');
        console.log('🔍 Running full HTML validation...\n');

        const html = fs.readFileSync('index.html', 'utf8');

        const options = {
            data: html,
            format: 'text',
        };

        const result = await validate(options);

        if (result.includes('error') || result.includes('Error')) {
            console.error('❌ HTML Validation Errors Found:\n');
            console.error(result);
            process.exit(1);
        } else {
            console.log('✅ Full HTML validation passed!');
            console.log(result || 'No errors found.');
        }
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('💡 Install html-validator for full validation: npm install');
            console.log('   Running basic structure check instead...\n');
        } else {
            console.error('❌ Error validating HTML:', error.message);
            process.exit(1);
        }
    }
}

// Basic structure check without external dependency
function checkBasicStructure() {
    console.log('🔍 Checking HTML structure...\n');

    const html = fs.readFileSync('index.html', 'utf8');
    const issues = [];

    // Check for unclosed tags
    const openTags = html.match(/<section[^>]*>/g) || [];
    const closeTags = html.match(/<\/section>/g) || [];

    if (openTags.length !== closeTags.length) {
        issues.push(`⚠️  Mismatched section tags: ${openTags.length} opening, ${closeTags.length} closing`);
    }

    // Check for data-page sections (only in section tags, not CSS)
    const pageSections = html.match(/<section[^>]*data-page="[^"]+"[^>]*>/g) || [];
    const dataPagesInSections = html.match(/<section[^>]*\s+data-page="[^"]+"[^>]*>/g) || [];

    // Count unique page routes
    const uniquePages = new Set();
    pageSections.forEach(section => {
        const match = section.match(/data-page="([^"]+)"/);
        if (match) uniquePages.add(match[1]);
    });

    console.log(`   Found ${pageSections.length} section elements with data-page`);
    console.log(`   Found ${uniquePages.size} unique page routes: ${Array.from(uniquePages).join(', ')}`);

    // Check for common issues
    const unclosedDivs = (html.match(/<div[^>]*>/g) || []).length;
    const closedDivs = (html.match(/<\/div>/g) || []).length;

    if (unclosedDivs !== closedDivs) {
        issues.push(`⚠️  Mismatched div tags: ${unclosedDivs} opening, ${closedDivs} closing`);
    }

    if (issues.length > 0) {
        console.error('❌ Structure Issues Found:\n');
        issues.forEach(issue => console.error(issue));
        return false;
    }

    console.log('✅ Basic structure check passed!');
    console.log(`   Found ${openTags.length} section elements`);
    console.log(`   Found ${dataPages.length} pages with data-page attributes`);
    return true;
}

// Run basic check first (works without dependencies)
if (checkBasicStructure()) {
    // Try to run full validation if html-validator is installed
    validateHTML().catch(() => {
        console.log('\n💡 Install html-validator for full validation: npm install');
        console.log('   Basic structure check passed, but full validation requires dependencies.');
    });
}

