# Smart EdTech Flask Backend

This is the Flask backend for the Smart EdTech application.

## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   flask run
   ```

## API Endpoints

- Authentication:
  - POST `/api/auth/register` - Register a new user
  - POST `/api/auth/login` - Login a user

- Dashboard:
  - GET `/api/dashboard/user/<user_id>` - Get user dashboard data

- Assignments:
  - GET `/api/assignments/<user_id>` - Get user assignments
  - POST `/api/assignments/<user_id>` - Create a new assignment
  - PUT `/api/assignments/<user_id>/<assignment_id>` - Update an assignment

- Health Check:
  - GET `/api/health` - Check API health