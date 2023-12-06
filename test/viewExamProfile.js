const fs = require('fs');
const cli = require("@caporal/core").default;

function viewExamProfile(examFile) {
    let exam;
    try {
        const fileContent = fs.readFileSync(examFile, 'utf-8');
        exam = JSON.parse(fileContent);
    } catch (error) {
        throw new Error(`Unable to read or parse exam file: ${error.message}`);
    }

    console.log(`Exam Name: ${exam.name}`);
    console.log(`Description: ${exam.description}`);
    console.log(`Duration: ${exam.duration} minutes`);
    console.log(`Total Questions: ${exam.questions.length}`);

    exam.questions.forEach((question, index) => {
        console.log(`\nQuestion ${index + 1}:`);
        console.log(`  Type: ${question.type}`);
        console.log(`  Content: ${question.content}`);
        if (question.type.toLowerCase() === 'mcq') {
            console.log('  Options:');
            question.options.forEach((option, idx) => {
                console.log(`    ${idx + 1}: ${option}`);
            });
        }
    });
}

cli
    .version('1.0.0')
    .command('view', 'View exam profile')
    .argument('<examFile>', 'The JSON file of the exam')
    .action(({ args, logger }) => {
        try {
            viewExamProfile(args.examFile);
        } catch (error) {
            logger.error(`Error viewing exam profile: ${error.message}`);
        }
    });

cli.run(process.argv.slice(2));
