const fs = require('fs');
const readline = require('readline');
const cli = require("@caporal/core").default;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createMCQ() {
    const content = await askQuestion('Enter the MCQ content: ');
    const options = [];
    let addOption = true;
    while (addOption) {
        const option = await askQuestion('Enter option (type "done" to finish): ');
        if (option.toLowerCase() === 'done') {
            addOption = false;
        } else {
            options.push(option);
        }
    }
    const answer = await askQuestion('Enter the correct option number: ');
    return { type: 'MCQ', content, options, answer };
}

async function createShortAnswer() {
    const content = await askQuestion('Enter the short answer question: ');
    const answer = await askQuestion('Enter the answer: ');
    return { type: 'ShortAnswer', content, answer };
}

async function createTrueFalse() {
    const content = await askQuestion('Enter the statement: ');
    const answer = await askQuestion('Is the statement true or false? (true/false): ');
    return { type: 'TrueFalse', content, answer: answer.toLowerCase() === 'true' };
}

async function createQuestion() {
    const type = await askQuestion('Question type (MCQ/ShortAnswer/TrueFalse): ');
    switch (type.toLowerCase()) {
        case 'mcq': return createMCQ();
        case 'shortanswer': return createShortAnswer();
        case 'truefalse': return createTrueFalse();
        default: throw new Error('Invalid question type');
    }
}

async function addQuestionToExam(examFile) {
    let exam;
    try {
        const fileContent = fs.readFileSync(examFile, 'utf-8');
        exam = JSON.parse(fileContent);
    } catch (error) {
        throw new Error(`Unable to read or parse exam file: ${error.message}`);
    }

    const question = await createQuestion();
    const position = await askQuestion(`Enter the position to insert the question (1-${exam.questions.length + 1}): `);
    const pos = parseInt(position) - 1;
    if (pos >= 0 && pos <= exam.questions.length) {
        exam.questions.splice(pos, 0, question);
    } else {
        throw new Error('Invalid position');
    }

    return exam;
}

cli
    .version('1.0.0')
    .command('add-question', 'Add a question to an existing exam')
    .argument('<examFile>', 'The JSON file of the exam')
    .action(async ({ args, logger }) => {
        try {
            const updatedExam = await addQuestionToExam(args.examFile);
            fs.writeFileSync(args.examFile, JSON.stringify(updatedExam, null, 2));
            logger.info(`Question added to exam '${args.examFile}' successfully.`);
        } catch (error) {
            logger.error(`Error adding question: ${error.message}`);
        } finally {
            rl.close();
        }
    });

cli.run(process.argv.slice(2));
