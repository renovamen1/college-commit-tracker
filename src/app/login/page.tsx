'use client'

export default function LoginPage() {
  return (
    <div style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>

      {/* Main Login Form */}
      <main className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Log in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Or{' '}
              <a className="font-medium text-[var(--primary-color)] hover:text-blue-500" href="#">
                start your 14-day free trial
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="sr-only" htmlFor="email-address">
                  Username or Email
                </label>
                <input
                  autoComplete="email"
                  className="relative block w-full appearance-none rounded-md border border-[#324d67] bg-[#192633] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                  id="email-address"
                  name="email"
                  placeholder="Username or Email"
                  required
                  type="email"
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  className="relative block w-full appearance-none rounded-md border border-[#324d67] bg-[#192633] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-[var(--primary-color)] focus:outline-none focus:ring-[var(--primary-color)] sm:text-sm"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  type="password"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-offset-gray-800"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-gray-300" htmlFor="remember-me"> Remember me </label>
              </div>
              <div className="text-sm">
                <a className="font-medium text-[var(--primary-color)] hover:text-blue-500" href="#">
                  {' '}
                  Forgot your password?{' '}
                </a>
              </div>
            </div>
            <div>
              <button
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--primary-color)] py-3 px-4 text-sm font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                type="submit"
              >
                Log In
              </button>
            </div>
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <a className="font-medium text-[var(--primary-color)] hover:text-blue-500" href="#">
                {' '}
                Sign up{' '}
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
