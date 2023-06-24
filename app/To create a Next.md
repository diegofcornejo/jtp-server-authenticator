To create a Next.js application with user authentication, follow these steps:

1. Set up the Next.js project and install dependencies:

```bash
npx create-next-app next-auth-example
cd next-auth-example
npm install redis jsonwebtoken tailwindcss
```

2. Configure Tailwind CSS:

Create a configuration file:

```bash
npx tailwindcss init
```

Edit `tailwind.config.js` and add the following:

```javascript
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

Edit `styles/globals.css` to import Tailwind CSS:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

3. Create the login form:

Create a new file `pages/login.js`:

```jsx
import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 200) {
      const { token } = await res.json();
      setToken(token);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-5">Login</h1>
      <form onSubmit={handleSubmit} className="w-1/3">
        <div className="mb-4">
          <label className="block text-gray-700">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-