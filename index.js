const { exec } = require("child_process");
const { parse } = require("recipe-ingredient-parser-v2");
const { promisify } = require("util");

const promiseExec = promisify(exec);

// export interface IParsedIngredinets {
//   qty?: string;
//   unit?: string;
//   name: string;
//   other?: string;
//   comment?: string;
//   input: string;
// }

async function runParser(input) {
  //  use the regex ingredient parser first to format some of the odd wording
  const { quantity, unit, ingredient } = parse(input);
  const formattedIngredient = `${quantity || ""} ${unit || ""} ${
    ingredient || ""
  }`
    .trim()
    .replace(/\s+/g, " ");

  const { stdout, stderr } = await promiseExec(
    `./parse "${formattedIngredient}"`
  );
  if (!!stderr) {
    // catch err
  } else {
    const result = JSON.parse(stdout).map((e) => {
      delete e.display;
      return e;
    });

    console.log(result);
    return result;
  }
}

runParser(process.argv[2]);
// runParser(["1pound beef", "10 cup water, boiled first", "1 tbsp honey"]);
