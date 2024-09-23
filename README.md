https://devpost.com/software/study-buddy-os2hr1
# Description
## Inspiration
As busy college students, we often find ourselves in a cycle of taking notes during lectures, only to let them gather dust, never to be revisited. We've noticed a significant disconnect between writing notes down on paper and actually studying the subjects they cover. To address this inherent friction in the learning process, we decided to design a tool that not only understands and interprets textual notes for studying, but further enables concrete progress towards studying goals by integrating these study plans into one’s daily schedule.

## What it does
StudySync establishes an end-to-end process for study planning, from automating topic generation to scheduling study itinerary based on a user’s existing calendar.

First, StudySync takes a batch of class notes from the user. A generative AI model then interprets the contents of the notes and yields a comprehensive set of specific study suggestions, along with expected times required to study each topic. These sequentially define a concrete plan the user can leverage to effectively learn and study the material. This study plan is sent back and displayed by our front end for the user to inspect and possibly regenerate, if unsatisfactory. 

If the user is satisfied with the suggestions, StudySync uses an efficient scheduling algorithm to seamlessly integrate these study suggestions into the user’s pre-existing Google Calendar, molding a study schedule around their existing responsibilities. 

## How we built it
Our web app is built using a React frontend and a Python/Flask backend, storing user’s notes and study plans in a MongoDB database. Users authenticate using their Google accounts, and then can input textual notes for their classes into our platform, which are stored in our database. Users can request a study plan based on their input notes, for which we leverage extensive prompt engineering and OpenAI’s GPT API to summarize and find key points in their notes around which to center study activities. We then developed an algorithm that greedily inserted study events into a user’s pre-existing Google Calendar based on these generated study plans, subject to constraints based on the user’s working hours and availability as well as user-defined priorities for various classes. 

## Challenges we ran into
We struggled with eliciting the appropriate responses from ChatGPT, but with careful prompt engineering, we were able to obtain favorable responses we could use as a study plan. We also had a difficult time integrating Google OAuthentication and Google Calendar with our application, but through extensive review of documentation and troubleshooting, we were able to achieve a seamless integration.

## Accomplishments that we're proud of
We take pride in our innovative use of cutting-edge technologies to deliver a practical and effective tool that addresses a real challenge encountered by students of all ages.

## What we learned
We learned the power of prompt engineering in eliciting desired responses from generative AI. We also learned the power of different frameworks like React and Flask to deliver working applications in an efficient manner. 

## What's next for StudySync
In future work, we want to orient StudySync to become a self-contained notetaking and storage tool, allowing for users to have a streamlined experience from notetaking to study planning and execution. Towards this end, we hope to establish additional functionality to allow users to upload various file formats including PDFs, Word documents, and images of notes (which can be parsed for text), as well as potentially integration with existing note-taking platforms. Additional directions include integrating our application with course administration tools such as Canvas so student’s classes can be automatically synchronized with StudySync as well as adding more customizable features for schedule integration. These include indicating break times and how to space study sessions of the same subject, as well as other online calendars. 

# Dev Guide
## Requirements

python 3.12 <br>
node.js 20.17 <br>
npm 10.8.3

## Instructions

### Backend

After cloning this repo, open the backend folder in the terminal `cd backend` and then create a python virtual environment `python -m venv venv`. The start this venv:

```
# Windows
venv\Scripts\activate
# macOS and Linux
source venv/bin/activate
```

Then install the requirements `pip install -r requirements.txt` <br>
You will also need to create a `.env` folder: `touch .env` <br>
Inside that file, you will have to add the necessary secret strings for your platform:
```
export MONGODB_URI='<mongoDB URL>'
export OPENAI_API_KEY='<openAI api key>'
export CLIENT_ID='<google client id>'
export CLIENT_SECRET='<google client secret>'
```

### Frontend

Enter the frontend with `cd ..` and `cd frontend`. Install the dependencies with `npm install` and run with `npm run dev` <br>
You will also need to create a `.env` folder: `touch .env` <br>
Inside that file, you will have to add the necessary secret strings for your platform:
```
export VITE_GOOGLE_ID="<google client id>"
export VITE_API_URI="<wherever your backend is hosted>"
```

