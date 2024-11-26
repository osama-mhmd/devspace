import * as v from "valibot";

export const registerFields = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("plzEnterEMail"),
    v.email("emailMustBeValid"),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("plzEnterPassword"),
    v.minLength(8, "passwordMustBe8CharactersOrMore"),
  ),
  password_repeat: v.pipe(
    v.string(),
    v.nonEmpty("plzRewritePassword"),
    v.minLength(8, "passwordMustBe8CharactersOrMore"),
  ),
  user_name: v.pipe(
    v.string(),
    v.nonEmpty("plzEnterUsername"),
    v.minLength(4, "usernameMustExceed4Letters"),
    v.maxLength(31, "usernameCannotExceed31Letters"),
    v.regex(
      /^[a-z0-9-_]+$/,
      "usernameOnlyContainsLowercaseLettersNumbersHyphenAndUnderscore",
    ),
  ),
  first_name: v.pipe(v.string(), v.nonEmpty("plzEnterFirstName")),
  last_name: v.pipe(v.string(), v.nonEmpty("plzEnterLastName")),
});

export type RegisterFields = v.InferInput<typeof registerFields>;
