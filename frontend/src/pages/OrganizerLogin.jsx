import { SignIn } from '@clerk/clerk-react';

const OrganizerLogin = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="text-center mb-4">
                    <img src="/nst-logo.png" alt="NST Events" className="mx-auto h-12 w-auto" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Host an Event
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Organizer login for NST Events
                    </p>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                            card: 'shadow-none border-none p-0 w-full',
                            header: 'hidden',
                            footer: 'hidden'
                        }
                    }}
                />

                <p className="mt-6 text-center text-xs text-gray-500">
                    By continuing, you agree to NST Events's <a href="#" className="underline hover:text-gray-900">Terms</a> and <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>.
                </p>
            </div>
        </div >
    );
};

export default OrganizerLogin;
