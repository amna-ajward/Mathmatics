import { useState } from "react";
import questionData from "../data/constructionQuestion.json";
import { stringSimilarity } from "string-similarity-js";
import { Sentence, CharConverter } from "../types/types";

export function useQuery(userQuestion: string): {
	commands: string[];
	steps: string[];
} {
	let commands: string[] = [];
	let steps: string[] = [];

	const restructureduserQuestion: string[] =
		getRestructedUserQuestion(userQuestion);
	const { abstractedUserQuestions, charConverterDefinition } =
		getAbstractUserQuestion(restructureduserQuestion);

	// console.log("restructureduserQuestion", restructureduserQuestion);
	// console.log("charConverterDefinition", charConverterDefinition);

	let bestMatches: Sentence[] = getBestMatches(
		abstractedUserQuestions,
		charConverterDefinition
	);

	// console.log("bestMatches", bestMatches);

	bestMatches.map((bestMatch) => {
		if (bestMatch.sentenceID > 0) {
			commands.push(getUserCommands(bestMatch).join(","));

			let step = bestMatch.query_steps.map((qs) => {
				return destructureQuestion(qs, bestMatch.charConverterDefinition);
			});

			steps.push(...step);
		}
	});

	commands = commands.join(",").split(",");

	return { commands, steps };
}

function getUserCommands(sentences: Sentence): string[] {
	let valueUnit: string[] = sentences.absQuery.match(/\d+\.*\d*cm\b/g) || [];
	let values = valueUnit.join(",").replaceAll("cm", "").split(",");

	const userCommands: string[] = sentences.absCommand.map((com) =>
		destructureQuestion(com, sentences.charConverterDefinition)
	);

	values.forEach((val, index) => {
		if (val !== "") userCommands[index] = userCommands[index] + "-" + val;
	});

	return userCommands;
}

function getRestructedUserQuestion(query: string): string[] {
	let questions: string[] = query.split(/\.\s+/g); //split seentence by . followed by space

	let restructuredQues = questions.map((q) => {
		return removeUnwantedSpace(q);
	});

	return restructuredQues;
}

function getAbstractUserQuestion(query: string[]): {
	abstractedUserQuestions: string[];
	charConverterDefinition: CharConverter[];
} {
	let charConverterDefinition: any = [];
	let abstractedUserQuestions = query.map((q) => {
		let capitalWords: string[] = getCapitalWords(q) || [];
		let sortedChars = [...new Set(capitalWords.join(""))].sort();
		let sortedCharsRef: CharConverter = {
			X: sortedChars[0],
			Y: sortedChars[1],
			Z: sortedChars[2],
			R: sortedChars[3],
		};
		let capitalWordsXYZ = capitalWords.map((cw) => {
			return cw
				.split("")
				.map((c) => getObjectKey(sortedCharsRef, c))
				.join("");
		});
		let sortedWordsRef: any = {};
		capitalWords.forEach(
			(sc, index) => (sortedWordsRef[capitalWordsXYZ[index]] = sc)
		);

		let reCreatedQuestion = reCreateQuestion(q, sortedWordsRef);
		charConverterDefinition.push(sortedCharsRef);

		return reCreatedQuestion;
	});

	return { abstractedUserQuestions, charConverterDefinition };
}

function destructureQuestion(question: string, recreateRefObj: Object) {
	for (const [k, v] of Object.entries(recreateRefObj)) {
		question = question.replaceAll(k, v);
	}
	return question;
}

function removeUnwantedSpace(value: string) {
	return value
		.split(/\s*\={1}\s*/g) //Remove whitespace before and after =
		.join("=")
		.split(/\s*\^\s*/g) //Remove whitespace before and after ^
		.join(" ^")
		.split(/\s*(cm)|\s*(deg)/) //Remove whitespace before cm, deg
		.join("")
		.split(/segment|straight\-*/)
		.join("")
		.split(/\s+/)
		.join(" ");
}

function getCapitalWords(value: string) {
	return value.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g);
}

function getObjectKey(obj: any, value: string) {
	return Object.keys(obj).find((key) => obj[key] === value);
}

function reCreateQuestion(question: string, recreateRefObj: Object) {
	for (const [k, v] of Object.entries(recreateRefObj)) {
		question = question.replaceAll(v, k);
	}
	return question;
}

function getBestMatches(
	abstractedUserQuestions: string[],
	charConverterDefinition: CharConverter[]
): Sentence[] {
	let bestMatches: Sentence[] = [];
	abstractedUserQuestions.forEach((query, index) => {
		let bestMatchSimilarity = 0;
		let bestMatch: Sentence = {
			sentenceID: 0,
			absCommand: [],
			absQuery: "",
			charConverterDefinition: { X: "", Y: "", Z: "" },
			query_steps: [],
		};
		questionData.map((questionItem) => {
			questionItem.question.find((ques) => {
				let similarity: number = stringSimilarity(query, ques);
				if (similarity > 0.92 && similarity > bestMatchSimilarity) {
					bestMatchSimilarity = similarity;
					bestMatch = {
						sentenceID: questionItem.sentence_id,
						absCommand: questionItem.command,
						absQuery: query,
						charConverterDefinition: charConverterDefinition[index],
						query_steps: questionItem.question_step || [],
					};
				}
			});
		});
		bestMatches.push(bestMatch);
	});
	return bestMatches;
}

/****
 * 
https://www.npmjs.com/package/string-similarity

1. Restructure MySent
	- Remove whitespace before and after ^, =
	- Remove whitespace before cm, deg
	- Remove whitespace after a number
	- Remove whitespace after a number
	- Remove words (segment, straight, straight- )

2. from MySent - 
capitalWords = extract the capitalized letter words with whitespaces in either sides with optional proceeding ^(exclude ^). 
sortedChars = separate by character to a new sorted array . 
create object sortedCharsRef = {X:sortedChars[0], Y:sortedChars[1],Z:sortedChars[2]}
create new array capitalWordsXYZ out of capitalWords where each letter is replaced by corresponding sortedCharRef keys.
create object sortedWordsRef = {capitalWordsXYZ[0]:capitalWords[0],capitalWordsXYZ[1]:capitalWords[1],capitalWordsXYZ[2]:capitalWords[2]}

3. MyRefSent - If MySent has any values in sortedWordsRef, replace it with the sortedWordsRef key.

4. compare MySent with API sent for 98% similarity

4. Create query:string[] = for each command coming from APISent. Replace X=sortedChars[0],Y=sortedChars[1],Z=sortedChars[2].
5. Get values from MySent = get character combinations of number/. proceeding 'cm' without whitespace.
6. Update query by, for each query combine the values with with its corresponding command


3. from MySent - extract the capitalized 1/2/3 letter words with whitespaces in either sides or proceeding ^(checking for angle), sort each value in the acscending order, if proceeded with ^ then sort only the first(i.e.2nd chatacter) & last letter
4. Command formation
	- Get the prefix,value for each of these words from prefix,value of APISent and attach to form command.

 **/
