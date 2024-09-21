from openai import OpenAI
from dotenv import load_dotenv
import os
import json

# TJ's FAVORITE T SWIZ SONG: BLANK SPACE

load_dotenv()
client = OpenAI(
    # Set up OpenAI API key
    api_key = os.environ["OPENAI_API_KEY"],
)

# ENDPOINT: Takes in a list of notes strings and a course name
#           Returns response from chatgpt
def generate_study_plan(name, notes):
    prompt = build_prompt(name, notes)
    response = get_response(prompt)
    return json.loads(response)

# Build a prompt based on the notes files
def build_prompt(name, notes):
    labeled_notes = ""
    for i in range(len(notes)):
        labeled_notes += f"--note {i}--\n{notes[i]}\n\n"
    
    leftbrace ="{"
    rightbrace = "}"

    prompt = f"""You are a JSON generator for a study app. You will return a JSON string according the the specified schema, and ONLY that JSON string. You will base your response based on the user's notes below.

Your response JSON should adhere to the following schema, representing a list of study suggestions:
[
    {leftbrace}
        "title": string
        "agenda": string
        "time": int
    {rightbrace}
]

"title" is name of the study suggestion
"agenda" is a study suggestion based on the contents of the notes. Provide both the content to study and a recommended study method.
"time" is the expected time IN MINUTES it will take to study the suggestion.

You should return the study plan sequentially with respect to the order they appeared in the notes. You may have multiple notes per suggestion, or multiple suggestions per note. Here is an example response:

[
    {leftbrace}
        "title": "Barriers to Rational Thinking"
        "agenda": "Review barriers to rational thinking by making flashcards for each cognitive bias. Some are harder to understand than others, so make sure you study those (like Framing Effects!)."
        "time": 10
    {rightbrace},
    {leftbrace}
        "title": "Theories of Intelligence"
        "agenda": "Quiz yourself on different theories of intelligence. What is the difference between fluid and crystalized intelligence? What factors are linked with high/low IQ scores? Is intelligence at all genetic? Recall any studies mentioned in lecture."
        "time": 15
    {rightbrace}
]

Below is a list of notes from the course "{name}", delimited by '--note 1--', '--note 2--', etc. Each note is enclosed in quotations, so note 1 will look like this: \n\n--note 1--\n"[content]"\n\n You will use these to construct the JSON array of study suggestions, as detailed above.

{labeled_notes}
    """
    return prompt

# Send the file content as a prompt to the API
def get_response(prompt):
    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
    )
    return completion.choices[0].message.content
