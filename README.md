# Quiz Application

This is a Quiz Application built using React for the front-end and Django for the back-end. The application allows users to register, login, attempt quizzes, and view their quiz history. The quiz includes a timer and a scoring system.

## Features

- User Registration & Login
- Quiz Listing and Details
- Score Calculation
- Quiz Attempt Archive
- User Profile

## Tech Stack

- **Frontend:**
  - React
  - React Router
  - Axios
  - CSS for styling

- **Backend:**
  - Django
  - Django REST Framework
  - JWT Authentication
  - SQLite (or any other database)

## Prerequisites

- Node.js (for React frontend)
- Python 3.x (for Django backend)
- Django & Django REST Framework (for backend)
- Postman or any API testing tool (optional)

## Installation

### Backend (Django)

1. Clone the repository:
    ```bash
    git clone <repo_url>
    cd <project_folder>
    ```

2. Set up a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
  

4. Apply database migrations:
    ```bash
    python manage.py migrate
    ```

5. Create a superuser (optional for admin access):
    ```bash
    python manage.py createsuperuser
    ```

6. Run the Django server:
    ```bash
    python manage.py runserver
    ```

The backend will be available at `http://127.0.0.1:8000/`.

### Frontend (React)

1. Navigate to the `frontend` directory:
    ```bash
    cd quiz-app
    ```

2. Install the necessary packages:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

The frontend will be available at `http://localhost:3000/`.

## API Endpoints

- **POST** `/api/register/`: Register a new user
- **POST** `/api/login/`: Login to get JWT tokens
- **GET** `/api/quizzes/`: Fetch all quizzes
- **GET** `/api/questions/<quiz_id>/`: Fetch questions for a quiz
- **POST** `/api/submit_quiz/`: Submit the quiz and calculate the score
- **GET** `/api/quiz_archive/<username>/`: Get quiz attempts history

## Usage

1. Register a new user or log in with an existing account.
2. Browse the available quizzes and start taking them.
3. A timer will be displayed while attempting a quiz.
4. Once the quiz is completed, the score is calculated based on correct answers.
5. View your quiz history on the profile page.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or bug fixes. To contribute, please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- React documentation: [https://reactjs.org/docs/](https://reactjs.org/docs/)
- Django documentation: [https://www.djangoproject.com/](https://www.djangoproject.com/)
- Django REST Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
