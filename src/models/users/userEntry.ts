type UserEntry = {
    username: Value;
    password: Value;
    mainLanguage: Value;
    savedVocabulary: Value;
    createdDate: Value;
}

type Value = {
    S: string | undefined | null;
}