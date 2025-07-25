# SafeStreet - Community Road Safety Platform

A modern React TypeScript application focused on community road safety, featuring interactive maps, real-time notifications, and user management.

## 🚀 Features

### Core Functionality
- **Interactive Safety Map**: Report and view incidents, construction, and safety alerts
- **Real-time Notifications**: Context-aware notification system with different types
- **User Authentication**: Secure login/registration with Firebase
- **Community Management**: User profiles and community features
- **Responsive Design**: Modern UI with Tailwind CSS

### Interactive Map Features
- Click to report incidents
- Different marker types (incidents, construction, alerts, safety)
- Severity-based color coding
- Zoom controls
- Marker details modal
- Real-time incident reporting

### Notification System
- Success, error, warning, and info notifications
- Auto-dismiss with configurable duration
- Manual dismiss option
- Clear all functionality
- Context-aware messaging

### UI Components
- Reusable Button component with variants
- Input component with validation
- Loading spinner with different sizes
- Modern, accessible design

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React icons
- **Authentication**: Firebase (demo configuration)
- **Routing**: React Router v6
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SafeStreet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Credentials

For testing purposes, use these demo credentials:
- **Email**: `demo@safestreets.com`
- **Password**: `demo123`

## 🗺️ Interactive Map Usage

### Reporting Incidents
1. Click the "Report Incident" button or click anywhere on the map
2. Fill out the incident form:
   - Select incident type (Traffic Incident, Construction, Safety Alert, Safety Improvement)
   - Describe the location
   - Provide detailed description
   - Set severity level (Low, Medium, High)
3. Submit the report

### Viewing Markers
- Click on any marker to view details
- Markers are color-coded by severity
- Different icons represent different incident types
- View timestamp and description for each incident

### Map Controls
- Use zoom controls (+/-) to adjust map scale
- Legend shows marker types and meanings
- Grid overlay for better navigation

## 🔔 Notification System

The app includes a comprehensive notification system:

### Types
- **Success**: Green notifications for successful actions
- **Error**: Red notifications for errors and failures
- **Warning**: Yellow notifications for warnings
- **Info**: Blue notifications for informational messages

### Features
- Auto-dismiss after 5 seconds (configurable)
- Manual dismiss with X button
- Clear all notifications option
- Timestamp display
- Hover effects and animations

## 🎨 UI Components

### Button Component
```tsx
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `success`, `danger`, `warning`, `ghost`
Sizes: `sm`, `md`, `lg`

### Input Component
```tsx
<Input 
  label="Email"
  placeholder="Enter your email"
  leftIcon={<Mail className="w-4 h-4" />}
  error="Invalid email"
/>
```

### LoadingSpinner Component
```tsx
<LoadingSpinner size="md" variant="primary" />
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Button.tsx           # Reusable button component
│   ├── Input.tsx            # Reusable input component
│   ├── LoadingSpinner.tsx   # Loading spinner component
│   ├── InteractiveMap.tsx   # Interactive map with reporting
│   ├── LoginPage.tsx        # Authentication page
│   ├── NotificationSystem.tsx # Notification context and UI
│   ├── UserProfile.tsx      # User profile management
│   └── CommunityManagement.tsx # Community features
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── config/
│   └── firebase.ts          # Firebase configuration
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## 🚧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in `src/components/`
2. Add routing in `App.tsx`
3. Update notification system for user feedback
4. Test with different screen sizes

## 🔧 Configuration

### Firebase Setup
The app uses Firebase for authentication. Update `src/config/firebase.ts` with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

### Tailwind Customization
Customize the design system in `tailwind.config.js`:
- Add custom colors
- Extend animations
- Modify spacing and typography

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Breakpoint-specific layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎯 Future Enhancements

- Real map integration (Google Maps, Mapbox)
- Real-time collaboration features
- Advanced filtering and search
- Mobile app development
- Analytics dashboard
- Community forums

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**SafeStreet** - Making communities safer, one report at a time. 