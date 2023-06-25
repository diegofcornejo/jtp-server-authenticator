import '../app/globals.css';
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import ConfettiExplosion from 'confetti-explosion-react';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [token, setToken] = useState('');
	const [nick, setNick] = useState('');
	const [error, setError] = useState('');
	const [isExploding, setIsExploding] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
    const [isTokenCopied, setIsTokenCopied] = useState(false);

	const handleMouseMove = (e) => {
        const cursorLight = document.getElementById('cursor-light');
        cursorLight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      };
      
      useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const res = await fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});

		if (res.status === 200) {
			const { token, nick } = await res.json();
			setToken(token);
			setNick(nick);
			setError('');
			setIsExploding(true);
		} else {
			setError('Invalid credentials');
			setToken('');
			setNick('');
		}

		setIsLoading(false);
	};

    const handleCopyToken = () => {
        navigator.clipboard.writeText(token);
        setIsTokenCopied(true);
    };

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<a
					href="#"
					className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
				>
					<Image
						src="/img/logo.png"
						className="w-8 h-8 mr-2"
						height={144}
						width={144}
						alt="Logo"
					/>
					JTP Server Authenticator
				</a>
				{isExploding && <ConfettiExplosion flex items-center />}
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-sm font-bold leading-tight tracking-tight text-gray-900 md:text-2sm dark:text-white">
							Sign in to generate your access token
						</h1>
						<form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="username"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Your username
								</label>
								<input
									type="text"
									name="username"
									id="username"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="username"
									required=""
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password
								</label>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<button
								type="submit"
								className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
								disabled={isLoading}
							>
								{isLoading ? (
									<ClipLoader
										color="#ffffff"
										loading={true}
										css={css`
											display: block;
											margin: 0 auto;
										`}
									/>
								) : (
									'Sign in'
								)}
							</button>
						</form>
						{error && (
							<p className="text-sm font-light text-red-500 dark:text-red-400">{error}</p>
						)}
						{token && (
							<>
								<p className="text-sm text-green-500">Welcome {nick}!</p>
								<p className="text-lg break-all">{token}</p>
                                <button
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    onClick={handleCopyToken}
                                    >
                                    {isTokenCopied ? 'Token Copied!' : 'Copy Token'}
                                </button>
							</>
						)}
					</div>
				</div>
			</div>
            <div id="cursor-light" className="cursor-light"></div>
		</section>
	);
};

export default Login;