import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      <main>
        {/* Hero Section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          {/* Background Gradient Blob */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Take control of your personal finances today.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Track your income, monitor your expenses, and see where your money is actually going. A simple, fast, and secure way to manage your budget.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/signup"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                  Get started for free
                </Link>
                <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                  Already have an account? Log in <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="py-24 sm:py-32 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Track Faster</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your money
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                
                {/* Feature 1 */}
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                      $
                    </div>
                    Instant Balance Updates
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Your total balance, income, and expenses calculate automatically the moment you add a new transaction.
                  </dd>
                </div>

                {/* Feature 2 */}
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                      ✓
                    </div>
                    Simple & Intuitive
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    No cluttered menus or confusing charts. Just add what you earned and what you spent, and let the app do the rest.
                  </dd>
                </div>

              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}