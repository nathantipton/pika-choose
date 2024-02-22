# Pika-Choose

## Introduction

Pika-Choose is a web-based Pokémon tournament game designed to let players pick their favorite Pokémon in a fun and interactive way. Built with SvelteKit for a sleek, modern UI, and utilizing Firebase Auth and Firestore for user authentication and data storage. Cloudinary is integrated for efficient image management, ensuring fast load times and optimal performance. Hosted on Vercel, Pika-Choose is easily accessible and provides a stable, responsive gaming environment. Developed for my son to enjoy and others to discover their favorite Pokémon, Pika-Choose aims to bring joy and engagement to Pokémon enthusiasts of all ages.

## Features

- **User Authentication**: Secure login and signup processes using Firebase Auth.
- **Tournament Style Gameplay**: Players can participate in Pokémon tournaments to select their favorite Pokémon.
- **Real-time Data**: Utilizes Firestore for real-time updates on tournament progress and results.
- **Image Management**: Pokémon images are hosted on Cloudinary, ensuring quick load times and optimal performance.
- **Responsive Design**: Built with SvelteKit, the game is fully responsive and provides a great experience on both desktop and mobile devices. It is also a PWA, allowing users to install it on their devices for quick access.
- **Hosting on Vercel**: Ensures high availability and excellent speed for users worldwide.

## Technologies Used

- SvelteKit
- Firebase Auth
- Firestore
- Cloudinary
- Vercel
- PWA

## Setup Instructions

1. **Clone the Repository**
    ```
    git clone https://github.com/nathantipton/pika-choose.git
    cd pika-choose
    ```

2. **Install Dependencies**
    ```
    npm install
    ```

3. **Setup Environment Variables**
    - Create a `.env` file in the root directory.
    - Add your Firebase and Cloudinary configuration keys:
        ```
        PUBLIC_STATIC_FIREBASE_CONFIG=your_api_key
        PRIVATE_STATIC_FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account
        PRIVATE_CLOUDINARY_API_KEY=your_cloudinary_api_key
        PRIVATE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        PRIVATE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        ```

4. **Run the Development Server**
    ```
    npm run dev
    ```

5. **Build and Deploy**
    - To build the project for production, run:
        ```
        npm run build
        ```
    - Deploy to Vercel following their [official guide](https://vercel.com/docs).

## Usage

After setting up the project, navigate to the local development server address or your Vercel deployment URL. Sign up or log in to start participating in Pokémon tournaments. Select your favorite Pokémon and see how they fare against others in the community!

## Contributing

Contributions are welcome! If you have ideas on how to improve Pika-Choose or add new features, please feel free to fork the repository, make changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE.md)

## Acknowledgments

- Pokémon images and data provided by [PokéAPI](https://pokeapi.co).
- Special thanks to my son, the inspiration behind this project, and to all Pokémon fans out there!

