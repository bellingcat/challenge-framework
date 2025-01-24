// Script to take all raw Puzzle files and encrypt their contents
// using the secret from the previous puzzle (the first puzzle is not encrypted)
// Also add a field to each puzzle that is encrypted with the answer to the puzzle
// For checking the answer to the puzzle
const fs = require("fs");
const CryptoJS = require("crypto-js");
const yaml = require("js-yaml");

// Find all the puzzle files matching the pattern
const puzzleFiles = fs
    .readdirSync("./src/puzzles_raw")
    .filter((file) => file.endsWith(".yaml"));

// Create an object to store the puzzles
const challenges = {};
for (const path of puzzleFiles) {
    // Fetch the puzzle content
    const text = fs.readFileSync("./src/puzzles_raw/" + path, "utf8");
    var rawPuzzle = yaml.load(text);

    const challenge = rawPuzzle.metadata.challenge;
    const puzzleId = rawPuzzle.metadata.id;

    // Check if the challenge already exists as a key in the challenges object
    if (challenges[challenge] === undefined) {
        challenges[challenge] = { title: challenge, puzzles: {} };
    }

    challenges[challenge]["puzzles"][puzzleId] = rawPuzzle;
    challenges[challenge]["puzzles"][puzzleId].metadata.path = path;
}

for (const challenge of Object.values(challenges)) {
    const rawPuzzles = challenge.puzzles;
    for (const [id, rawPuzzle] of Object.entries(rawPuzzles)) {
        const publishDate =
            rawPuzzle.metadata.publishDate !== undefined
                ? new Date(rawPuzzle.metadata.publishDate)
                : undefined;
        const unlockDate = new Date(rawPuzzle.metadata.unlockDate);
        const today = new Date();

        // Do not publish the puzzle if the publish date is in the future or undefined
        if (publishDate === undefined || publishDate > today) continue;

        // Build a new puzzle object
        var newPuzzle = {};

        // Copy the metadata
        newPuzzle.metadata = rawPuzzle.metadata;

        // If the puzzle is the first puzzle, or if the unlockDate is today or in the past don't encrypt the content
        if (id === "0" || unlockDate <= today) {
            newPuzzle.unencryptedContent = rawPuzzle.unencryptedContent;
        } else {
            const previousSecret = rawPuzzles[id - 1].secret;
            newPuzzle.encryptedContent = CryptoJS.AES.encrypt(
                JSON.stringify(rawPuzzle.unencryptedContent),
                previousSecret
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, ""),
            ).toString();
        }

        // Add the answer check
        newPuzzle.answerCheck = CryptoJS.AES.encrypt(
            JSON.stringify("Answer Correct"),
            rawPuzzle.answer
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, ""),
        ).toString();

        // Add the encrypted secret
        newPuzzle.encryptedSecret = CryptoJS.AES.encrypt(
            rawPuzzle.secret,
            rawPuzzle.answer
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, ""),
        ).toString();

        // Write the new puzzle to a file
        fs.writeFileSync(
            "./src/puzzles/" + rawPuzzle.metadata.path,
            yaml.dump(newPuzzle, (lineWidth = -1)),
        );
    }
}
