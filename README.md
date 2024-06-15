
# ClassZap

ClassZap is a scheduling application designed to manage class schedules and student registrations. This application includes features like creating weekly schedules, registering students to classes, and viewing daily schedules.

## Features

- Add classes by title, day, and hour.
- View and register users to classes.
- Allow users to register for classes.
- Allow admin to register users.
- Only admin can add weekly schedules and classes.

## Requirements

To run this project, you need to have the following installed:

- Node.js (>=14.x.x)
- npm (>=6.x.x)
- MongoDB (>=4.x.x)

**-Backend**
express
dotenv
mongodb
body-parser
cors
**Frontend**
react-big-calendar
moment
axios
react-router-dom
react-icons

## Environment Variables

The application requires the following environment variables. Create a `.env` file in the root of your project and add the following:

```
COSMOSDB_URI=<your_cosmosdb_uri>
PORT=<your_port>
REACT_APP_API_URL=<your_api_url>
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/classzap.git
   cd classzap
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MongoDB:**

   Ensure MongoDB is running and the connection URI is added to your `.env` file.

4. **Run the Node Express API:**

   ```bash
   cd backend
   node index.js
   ```

5. **Run the frontend application:**

   ```bash
   cd frontend
   npm start
   ```

## Project Structure

```
classzap/
├── backend/
│   ├── index.js
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarComponent.js
│   │   │   ├── CreateWeek.js
│   │   │   ├── ...
│   │   ├── App.js
│   │   └── ...
│   ├── public/
│   └── ...
├── .env
├── package.json
└── README.md
```

## Features

1. **Add Classes by Title, Day, and Hour:**
   - Admin can add classes specifying the title, day, and hour.

2. **View and Register Users to Classes:**
   - Users can view available classes and register themselves.
   - Admin can view and register any user to classes.

3. **Allow Users to Register for Classes:**
   - Users can self-register for available classes through the application.

4. **Allow Admin to Register Users:**
   - Admin has the privilege to register any user to classes and manage user registrations.

5. **Only Admin Can Add Weekly Schedules and Classes:**
   - Admins have exclusive rights to create and manage weekly schedules and class entries.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
