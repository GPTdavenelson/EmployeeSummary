const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const render = require('./lib/htmlRenderer');
const generatePhoneNumber = require('./data-utils');
const teamMembers = [];
const employeeIds = [];

const questionsEmployee = [
    {
        type: 'input',
        name: 'nameManager',
        message: "What's the manager's name?",
        validate: function (value) {
            if (value && value.length > 0) {
                return true;
            }
            return 'Name is required';
        },
    },
    {
        type: 'input',
        name: 'managerId',
        message: 'Team manager ID?',
        default: function () {
            return employeeIds.length + 1;
        },
    },
    {
        type: 'input',
        name: 'emailManager',
        message: "What is the manager's email?",
        default: function (value) {
            const splitName = value.nameManager.split(' ');
            return `${splitName[0]}@dundermifflin.com`;
        },
    },
    {
        type: 'input',
        name: 'officeNumber',
        message: "What is the manager's office number?",
        default: function () {
            return `570-904-${Math.floor(1000 + Math.random() * 9000)}`;
        },
    },
];

function manager() {
    console.log(`
    ${chalk.magentaBright('Welcome to Dunder Mifflin Team Builder')}
    
    
    `);

    inquirer.prompt(questionsEmployee).then(function (data) {
        const manager = new Manager(data.nameManager, data.managerId, data.emailManager, data.officeNumber);
        teamMembers.push(manager);
        employeeIds.push(data.managerId);
        team();
    });
}

function team() {
    console.log(employeeIds);
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'memberChoice',
                message: 'Which type of member would you like to add?',
                choices: ['Engineer', 'Intern', 'Save & Exit'],
            },
        ])
        .then(function (data) {
            if (data.memberChoice === 'Engineer') {
                engineer();
            } else if (data.memberChoice === 'Intern') {
                intern();
            } else outputTeam();
        });
}

function engineer() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'engineerName',
                message: "What is the engineer's name?",
                validate: function (value) {
                    if (value && value.length > 0) {
                        return true;
                    }
                    return 'Name is required';
                },
            },
            {
                type: 'input',
                name: 'engineerId',
                message: "What is the engineer's ID?",
                default: function () {
                    return employeeIds.length + 1;
                },
            },
            {
                type: 'input',
                name: 'engineerEmail',
                message: "What is the engineer's email?",
                default: function (value) {
                    const splitName = value.engineerName.split(' ');
                    return `${splitName[0]}@dundermifflin.com`;
                },
            },
            {
                type: 'input',
                name: 'engineerGithub',
                message: "What is the engineer's GitHub username?",
                default: function (value) {
                    const splitName = value.engineerName.split(' ');
                    return `${splitName[0]}${splitName[1]}`;
                },
            },
        ])
        .then(function (data) {
            const engineer = new Engineer(data.engineerName, data.engineerId, data.engineerEmail, data.engineerGithub);
            teamMembers.push(engineer);
            employeeIds.push(data.engineerId);
            team();
        });
}

function intern() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'internName',
                message: "What is the intern's name?",
                validate: function (value) {
                    if (value && value.length > 0) {
                        return true;
                    }
                    return 'Name is required';
                },
            },
            {
                type: 'input',
                name: 'internId',
                message: "What is the intern's ID?",
                default: function () {
                    return employeeIds.length + 1;
                },
            },
            {
                type: 'input',
                name: 'internEmail',
                message: "What is the intern's email?",
                default: function (value) {
                    const splitName = value.internName.split(' ');
                    return `${splitName[0]}@dundermifflin.com`;
                },
            },
            {
                type: 'input',
                name: 'internSchool',
                message: "What is the intern's school?",
                default: function () {
                    return 'UCONN';
                },
            },
        ])
        .then(function (data) {
            const intern = new Intern(data.internName, data.internId, data.internEmail, data.internSchool);
            teamMembers.push(intern);
            employeeIds.push(data.internId);
            team();
        });
}

function outputTeam() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath, render(teamMembers), 'utf-8');

    console.log(`Meet the team: 
    ${teamMembers}
    `);
}

manager();
