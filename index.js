const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

// This validates that a fields is filled
const answerValidation = async(input)=>{
  if(input.trim() === ""|| input.trim() === null){
    return "This is a required field; you must re-run this program."
  }
  return true
}

// These are the questions it will ask when you run the app
inquirer
  .prompt([
    {
      type: "input",
      name: "github",
      message: "What is your Github username?",
      validate: answerValidation
      
    },
    {
      type: "input",
      name: "email",
      message: "What is your email?",
    },
    {
      type: "input",
      name: "url",
      message: "What is the URL to your project?",
    },
    {
      type: "input",
      name: "title",
      message: "What is your project's name?",
    },
    {
      type: "input",
      name: "description",
      message: "Please write a short description of your project",
    },
    {
      type: "list",
      name: "license",
      message: "What kind of license should your project have?",
      choices: ["MIT", "APACHE", "GPL", "BSD", "None"],
    },
    {
      type: "input",
      name: "installation",
      message: "What command should be run to install dependencies?",
      default: "npm i",
    },
    {
      type: "input",
      name: "test",
      message: "What command should be run to run tests?",
      default: "npm test",
    },
    {
      type: "input",
      name: "usage",
      message: "What does the user need to know about using the repo?",
    },
    {
      type: "input",
      name: "contributing",
      message:
        "What does the user need to know about contributing to the repo?",
    },
  ])
  .then((response) => {
    const githubCall = `https://api.github.com/users/${response.github}`;

    axios.get(githubCall).then((res) => {
      var avatar = res.data.avatar_url;
      var name = res.data.name;
      var githubPage = res.data.html_url;

      const data = dataDump(response, avatar, name, githubPage);

      fs.writeFile("./export/README.md", data, function () {});
    });
  });

const dataDump = (
  {
    github,
    url,
    email,
    title,
    description,
    license,
    installation,
    test,
    usage,
    contributing,
  },
  avatar,
  name,
  githubPage
) => {
  return `
# ${title}

## Description

${description}

## Table of Contents 

* [Installation](#installation)

* [Usage](#usage)

* [License](#license)

* [Contributing](#contributing)

* [Tests](#tests)

* [Questions](#questions)

## Installation

To install necessary dependencies, run the following command:

\`\`\`
${installation}
\`\`\`

## Usage

${usage}

[![GitHub license](https://img.shields.io/badge/license-${license}-blue.svg)](${url})  
## Contributing

${contributing}

## Tests

To run tests, run the following command:

\`\`\`
${test}
\`\`\`

## Questions

If you have any questions about the repo, open an issue or contact [${name}](${githubPage}) directly at ${email}.

<a href="${githubPage}" target="_blank">

<img src="${avatar}" alt="${github}" height=200px width=200px>
</a>


`;
};
