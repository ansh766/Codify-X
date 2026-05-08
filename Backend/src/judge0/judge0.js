const axios = require("axios");
const isObject = require("../utils/isObject");
const { sleep } = require("../utils/utils");
const CustomError = require("../utils/CustomError");

const JUDGE0_URL = "https://ce.judge0.com";

const judge0 = {

  // languages Ids
  languageId: {
    c: 110,
    cpp: 105,
    java: 91,
    javascript: 102,
    python: 109
  },

  // error Ids
  errors: {
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error (SIGSEGV)",
    8: "Runtime Error (SIGXFSZ)",
    9: "Runtime Error (SIGFPE)",
    10: "Runtime Error (SIGABRT)",
    11: "Runtime Error (NZEC)",
    12: "Runtime Error (Other)",
    13: "Internal Error",
    14: "Exec Format Error"
  },


  // to submitting solution to judge0
  validateProblem: async function (referenceSolution, testCases) {

    const submissionBatch = this.createSubmissionBatch(referenceSolution, testCases);
    const result = await this.submitBatch(submissionBatch);
    await this.checkResult(result);

  },

  // to check the user submitted result
  submitUserSolution: async function (userSolution, language, testCases) {

    const submissionBatch = this.createSubmissionBatch([{ language: language, solutionCode: userSolution }], testCases);
    const result = await this.submitBatch(submissionBatch);
    return await this.getSubmissionResult(result);

  },

  // to run user solution
  runUserSolution: async function (userSolution, language, testCases) {

    const submissionBatch = this.createSubmissionBatch([{ language: language, solutionCode: userSolution }], testCases);
    const result = await this.submitBatch(submissionBatch);
    return await this.getRunTestResult(result);

  },

  // this function creates submission batch
  createSubmissionBatch: function (solutions, testCases) {

    const submissionBatch = [];

    for (const solution of solutions) {

      if (!isObject(solution))
        throw new CustomError("Solution Array can only contain elements of type Object", 400);

      if (solution.solutionCode == "")
        throw new CustomError("SolutionCode could not be empty field", 400);

      const languageId = this.getLanguageId(solution.language);

      for (const testCase of testCases) {
        const batch = {
          language_id: languageId,
          source_code: solution.solutionCode,
          stdin: testCase.input,
          expected_output: testCase.output
        };

        submissionBatch.push(batch);
      }
    }

    return submissionBatch;
  },


  // submitting batch
  submitBatch: async function (submissionBatch) {

    // ===============================
    // 1️⃣ SEND CODE → GET TOKENS
    // ===============================
    const response = await axios.post(
      `${JUDGE0_URL}/submissions/batch`,
      { submissions: submissionBatch },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const tokens = response.data.map(r => r.token);

    if (!tokens.length) {
      throw new CustomError("No tokens received from Judge0", 500);
    }

    // ===============================
    // 2️⃣ POLL UNTIL ALL RESULTS READY
    // ===============================
    let results = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {

      const resultResponse = await axios.get(
        `${JUDGE0_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(","),
            base64_encoded: false,
            fields: "*"
          }
        }
      );

      results = resultResponse.data.submissions;

      // status_id directly available hai public Judge0 mein
      const allDone = results.every(r => r.status_id > 2);
      if (allDone) break;

      await sleep(1000);
      attempts++;
    }

    if (!results) {
      throw new CustomError("Failed to fetch results from Judge0", 500);
    }

    return results;
  },


  // this function returns the language Id if exists otherwise throw an error
  getLanguageId: function (language) {
    const languageId = this.languageId[language];

    if (!languageId)
      throw new CustomError(`Invalid language: '${language}' given in referenceSolution`, 400);

    return languageId;
  },


  // check result (used in validateProblem)
checkResult: async function (result) {
  for (const testCase of result) {
    console.log("Expected:", JSON.stringify(testCase.expected_output));
    console.log("Actual:  ", JSON.stringify(testCase.stdout));
    console.log("Compile:", testCase.compile_output);
    console.log("Status:", testCase.status_id);
    if (testCase.status_id != 3)
      throw new CustomError(this.errors[testCase.status_id], 400);
  }
},

  // to get Submission result
  getSubmissionResult: async function (result) {

    const submissionResult = {
      totalTestCases: result.length
    };

    for (const testCase of result) {

      if (testCase.status_id == 5) {
        submissionResult.status = "tle";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }

      if (testCase.status_id == 6) {
        submissionResult.status = "compilation-error";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }

      if (testCase.status_id > 12) {
        submissionResult.status = "pending";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }

      if (testCase.status_id > 6) {
        if (!submissionResult.passedTestCases)
          submissionResult.passedTestCases = 0;

        submissionResult.status = "runtime-error";
        submissionResult.errorMessage = testCase.compile_output;
        return submissionResult;
      }

      if (!submissionResult.passedTestCases) {
        submissionResult.passedTestCases = 0;
        submissionResult.runtime = 0;
        submissionResult.memory = 0;
      }

      if (testCase.status_id == 3)
        submissionResult.passedTestCases++;

      submissionResult.runtime += parseFloat(testCase.time);
      if (testCase.memory > submissionResult.memory)
        submissionResult.memory = testCase.memory;
    }

    if (submissionResult.passedTestCases < result.length)
      submissionResult.status = "wrong-answer";
    else
      submissionResult.status = "accepted";

    return submissionResult;
  },

  // to get run test result
  getRunTestResult: async function (result) {

    let runTestResult = [];

    for (const testCase of result) {

      const testResult = {
        status: null,
        runtime: testCase.time,
        memory: testCase.memory,
        errorMessage: testCase.compile_output,
        input: testCase.stdin,
        expectedOutput: testCase.expected_output,
        output: testCase.stdout
      };

      if (testCase.status_id == 3)
        testResult.status = "accepted";
      else if (testCase.status_id == 4)
        testResult.status = "wrong-answer";
      else if (testCase.status_id == 5)
        testResult.status = "tle";
      else if (testCase.status_id == 6)
        testResult.status = "compilation-error";
      else if (testCase.status_id > 12)
        testResult.status = "pending";
      else
        testResult.status = "runtime-error";

      runTestResult.push(testResult);
    }

    return runTestResult;
  }

};

module.exports = judge0;