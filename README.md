# Ourika Travels

<p align="center">
  <img src="src/assets/images/logo.png" alt="Ourika Travels Logo" width="200">
</p>

## Project Overview
Ourika Travels is a comprehensive tourism platform connecting travelers with expert local guides, focusing on adventure tourism experiences in destinations like Morocco. The platform allows guides to create profiles, share their expertise, and offer guided tours, while travelers can discover, book, and review these experiences.

## Features

<p align="center">
  <img src="src/assets/images/hero.jpg" alt="Ourika Travels Features" width="700">
</p>

### For Travelers
- **Tour Discovery**: Browse and search for tours and activities
- **Booking System**: Reserve activities with flexible payment options
- **Community Engagement**: View guide profiles, ratings, and reviews
- **User Profiles**: Create and manage personal accounts

### For Guides
- **Profile Management**: Create and maintain professional guide profiles
- **Tour Management**: Create, edit, and manage tour listings
- **Booking Management**: Handle reservations and customer communications
- **Community Interaction**: Post updates and respond to user inquiries

<p align="center">
  <img src="src/assets/images/Screenshot from 2025-04-03 11-41-55.png" alt="Guide Registration" width="700">
</p>

### Admin Features
- **Guide Verification**: Process and approve guide applications
- **Content Moderation**: Monitor and moderate community posts and reviews
- **Analytics Dashboard**: Track platform performance and user engagement



## Technical Stack


### Frontend
- **Framework**: React.js (v19.0.0)
- **State Management**: React Context API
- **Routing**: React Router DOM (v7.3.0)
- **Styling**: Tailwind CSS with responsive design
- **UI Components**: Custom components with responsive design for both desktop and mobile
- **Icons**: Lucide React and React Icons
- **Notifications**: React Hot Toast and React Toastify
- **Charts**: Recharts for analytics visualization

### Integration Points
- **Maps**: Google Maps API for tour locations and itineraries
- **Payment Processing**: Secure payment gateway integration
- **Email Notifications**: Automated booking confirmations and updates
- **Date Handling**: Date-fns for date manipulation

## Getting Started

<p align="center">
  <img src="src/assets/images/Screenshot from 2025-04-03 11-40-33.png" alt="Ourika Travels App" width="700">
</p>

### Prerequisites
- Node.js (v16.x or later)
- npm (v8.x or later)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ouchin55edcx/ourika-front.git
   cd ourika-front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The application will be available at `http://localhost:3000`

## Project Structure

<p align="center">
  <img src="src/assets/images/about.jpg" alt="Ourika Travels Structure" width="700">
</p>

```
ourika-travels/
├── public/
│   ├── index.html
│   ├── logo192.png
│   └── logo512.png
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── community/
│   │   ├── dashboard/
│   │   │   └── guide/
│   │   ├── layout/
│   │   └── treks/
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── ReservationContext.js
│   │   └── WishlistContext.js
│   ├── pages/
│   │   ├── About/
│   │   ├── Auth/
│   │   ├── Bookings/
│   │   ├── Community/
│   │   ├── Dashboard/
│   │   │   ├── Admin/
│   │   │   ├── Guide/
│   │   │   └── Tourist/
│   │   ├── GuideProfile/
│   │   ├── Legal/
│   │   ├── Support/
│   │   └── TrekDetails/
│   ├── services/
│   │   ├── adminApi.js
│   │   ├── api.js
│   │   ├── axiosConfig.js
│   │   ├── categoryApi.js
│   │   ├── guideApi.js
│   │   ├── highlightApi.js
│   │   ├── imageApi.js
│   │   ├── postApi.js
│   │   ├── reservationApi.js
│   │   ├── serviceApi.js
│   │   ├── touristApi.js
│   │   ├── trekApi.js
│   │   └── wishlistApi.js
│   ├── App.js
│   └── index.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Key Interfaces

### Community Page
The community section allows guides and travelers to share experiences and connect with each other. Features include:
- Feed of updates from guides
- Top guides showcase
- Photo sharing
- Post and comment functionality

<p align="center">
  <img src="src/assets/images/Screenshot from 2025-04-03 11-39-48.png" alt="Community Page" width="700">
</p>

### Guide Profiles
Comprehensive guide profiles that showcase:
- Verified status and credentials
- Experience statistics
- Tour offerings
- Languages spoken
- Availability calendar
- Reviews and ratings

<p align="center">
  <img src="src/assets/images/Screenshot from 2025-04-03 11-40-16.png" alt="Guide Profile" width="700">
</p>

### Tour Booking
Intuitive booking interface with:
- Tour details and itinerary
- Pricing information
- Date selection
- Participant count
- Booking policies
- Payment processing

<p align="center">
  <img src="src/assets/images/Screenshot from 2025-04-03 11-40-33.png" alt="Tour Booking" width="700">
</p>

## Deployment
The application is designed to be deployed on standard web hosting platforms:
- Vercel
- Netlify
- AWS Amplify

## Contributing
Guidelines for contributing to the project:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  <img src="src/assets/images/logo.png" alt="Ourika Travels Logo" width="100">
</p>
<p align="center">
  © 2025 Ourika Travels. All rights reserved.
</p>