const fs = require('fs');
const readline = require('readline');
const cli = require("@caporal/core").default;

// 创建命令行界面实例
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 定义一个函数来询问问题
function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

// 创建考试对象的函数
async function createExam(name, description) {
    const duration = await askQuestion('Enter the duration of the exam (in minutes): ');
    const type = await askQuestion('Enter the type of the exam (e.g., Final, Midterm, Quiz): ');
    const numberOfQuestions = await askQuestion('How many questions are in the exam? ');

    const questions = [];
    for (let i = 0; i < parseInt(numberOfQuestions); i++) {
        const question = await askQuestion(`Enter question ${i + 1}: `);
        questions.push(question);
    }

    return {
        name,
        description,
        duration,
        type,
        questions
    };
}

// CLI 命令定义
cli
    .version('1.0.0')
    .command('create', 'Create a new exam')
    .argument('<name>', 'Name of the exam')
    .argument('[description]', 'Description of the exam', { default: 'No description provided.' })
    .action(async ({ args, logger }) => {
        try {
            const exam = await createExam(args.name, args.description);
            fs.writeFileSync(`${args.name}.json`, JSON.stringify(exam, null, 2));
            logger.info(`Exam '${args.name}' created successfully.`);
        } catch (error) {
            logger.error(`Error creating exam: ${error.message}`);
        } finally {
            rl.close();
        }
    });

cli.run(process.argv.slice(2));
